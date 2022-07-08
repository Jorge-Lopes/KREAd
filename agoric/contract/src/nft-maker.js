// @ts-check
import '@agoric/zoe/exported';
import { AssetKind, AmountMath } from '@agoric/ertp';
import { assertProposalShape } from '@agoric/zoe/src/contractSupport/index.js';
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';
import { errors } from './errors';
import { mulberry32 } from './prng';

/**
 * This contract handles the mint of KREAd characters,
 * along with its corresponding item inventories and keys.
 * It also allows for equiping and unequiping items to
 * and from the inventory, using a token as access
 *
 * @type {ContractStartFn}
 */
const start = async (zcf) => {
  // Define Assets
  const assetMints = await Promise.all([
    zcf.makeZCFMint('KREA', AssetKind.SET),
    zcf.makeZCFMint('KREAITEM', AssetKind.SET),
  ]);

  const [
    { issuer: characterIssuer, brand: characterBrand },
    { issuer: itemIssuer, brand: itemBrand },
  ] = assetMints.map((mint) => mint.getIssuerRecord());

  const [characterMint, itemMint] = assetMints;

  let PRNG; // Pseudo random number generator (mulberry32)

  /**
   * Contract state
   *
   * @type {State}
   */
  const state = {
    config: undefined, // Holds list of base characters and default items
    characterNames: [], // Holds a list of minted character names, used to check for uniqueness
    characters: [], // Holds each character's inventory + copy of its data
  };
  /**
   * Private state
   *
   * @type {InventoryKeyStorage}
   */
  let privateState = [];

  /**
   * Set contract configuration, required for most contract features,
   * base characters will be picked at random on new mint
   * default items will be minted along each character
   * seed is used to init the PRNG
   *
   * @param {{
   * baseCharacters: any[],
   * defaultItems: any[],
   * seed: number
   * }} config
   * @returns {string}
   */
  const initConfig = ({ baseCharacters, defaultItems, seed }) => {
    state.config = {
      baseCharacters,
      defaultItems,
      completed: true,
    };
    assert(!Number.isNaN(seed), X`Seed must be a number`);
    PRNG = mulberry32(seed);
    return 'Setup completed';
  };

  /**
   * TODO: establish a rarity system set by the creator of the character set
   * TODO: add character type in return
   */
  const getRandomBaseCharacter = () => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    const number = Math.floor(PRNG() * state.config.baseCharacters.length);
    return state.config.baseCharacters[number];
  };
  /**
   * TODO: establish a rarity system set by the creator of the character set
   */
  const getRandomItem = () => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    const number = Math.floor(PRNG() * state.config.defaultItems.length);
    return state.config.defaultItems[number];
  };

  /**
   * @param {string} name
   * @returns {boolean}
   */
  const nameIsUnique = (name) => {
    return !state.characterNames.includes(name);
  };

  /**
   * Mints Item NFTs via mintGains
   *
   * @param {ZCFSeat} seat
   */
  const mintItemNFT = (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      want: { Item: null },
    });
    const { want } = seat.getProposal();
    itemMint.mintGains(want, seat);
    seat.exit();
    return 'You minted an Item NFT!';
  };

  /**
   * Mints a new character
   *
   * @param {ZCFSeat} seat
   */
  const mintCharacterNFT = (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      want: {
        Asset: null,
        InventoryKey: null,
      },
    });
    const { want } = seat.getProposal();
    const newCharacterName = want.Asset.value[0].name;
    assert(nameIsUnique(newCharacterName), X`${errors.nameTaken}`);

    // Get random base character and merge with name input
    const newCharacter = {
      ...getRandomBaseCharacter(),
      name: newCharacterName,
    };
    const { zcfSeat: inventorySeat } = zcf.makeEmptySeatKit();

    const newCharacterAmount1 = AmountMath.make(
      characterBrand,
      harden([{ ...newCharacter, id: 1 }]),
    );
    const newCharacterAmount2 = AmountMath.make(
      characterBrand,
      harden([{ ...newCharacter, id: 2 }]),
    );
    // Mint character to user seat
    characterMint.mintGains({ Asset: newCharacterAmount1 }, seat);
    characterMint.mintGains({ Character: newCharacterAmount2 }, inventorySeat);

    // Mint items to inventory seat
    const allDefaultItems = Object.values(state.config.defaultItems);
    const uniqueItems = allDefaultItems.map((item) => ({
      ...item,
      id: state.characterNames.length,
    }));
    const itemsAmount = AmountMath.make(itemBrand, harden(uniqueItems));
    itemMint.mintGains({ Item: itemsAmount }, inventorySeat);

    // Add to public state
    /**
     * @type {CharacterRecord}
     */
    const character = {
      name: newCharacter.name,
      character: newCharacter,
      inventory: inventorySeat,
    };
    state.characters = [...state.characters, character];

    // Add to private state
    privateState = [
      ...privateState,
      {
        name: character.name,
        history: [
          {
            id: 0,
            add: uniqueItems.map((i) => i.title),
          },
        ],
      },
    ];

    seat.exit();

    return 'You minted an NFT!';
  };

  /**
   * Adds item to inventory
   *
   * @param {ZCFSeat} seat
   */
  const equip = async (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      give: {
        Item: null,
        InventoryKey1: null,
      },
      want: {
        InventoryKey2: null,
      },
    });

    // Retrieve Items and Inventory key from user seat
    const providedItemAmount = seat.getAmountAllocated('Item');
    const providedKeyAmount = seat.getAmountAllocated('CharacterA');
    const providedKey = providedKeyAmount.value[0];
    const characterName = providedKey.name;

    // Find characterRecord entry based on provided key
    const characterRecord = state.characters.find(
      (c) => c.name === characterName,
    );
    assert(characterRecord, X`${errors.inventory404}`);
    const inventorySeat = characterRecord.inventory;
    assert(inventorySeat, X`${errors.inventory404}`);

    // Get current inventory items and key from inventorySeat
    const currentInventoryKey = inventorySeat.getAmountAllocated('Character');

    // Widthdraw Item and Key from user seat
    seat.decrementBy(harden({ Item: providedItemAmount }));
    seat.decrementBy(harden({ InventoryKey1: providedKeyAmount }));
    // Deposit Item and Key to inventory seat
    inventorySeat.incrementBy(harden({ Item: providedItemAmount }));
    inventorySeat.incrementBy(harden({ InventoryKey: providedKeyAmount }));
    // Widthdraw Key from character seat and deposit into user seat
    inventorySeat.decrementBy(harden({ InventoryKey: currentInventoryKey }));
    seat.incrementBy(harden({ InventoryKey2: currentInventoryKey }));

    zcf.reallocate(seat, inventorySeat);

    // Add to private state
    const characterIndex = privateState.findIndex(
      (c) => c.name === characterName,
    );
    assert(characterIndex >= 0, X`no character private state found`);
    privateState[characterIndex] = {
      name: characterRecord.name,
      history: [
        {
          id: 0,
          add: [providedItemAmount.value.map((i) => i.name)],
        },
      ],
    };

    seat.exit();
  };

  /**
   * Remove items from inventory
   *
   * @param {ZCFSeat} seat
   */
  const unequip = async (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      give: {
        Character1: null,
      },
      want: {
        Item: null,
        Character2: null,
      },
    });

    const providedKeyAmount = seat.getAmountAllocated('InventoryKey1');
    const providedKey = providedKeyAmount.value[0];
    const characterName = providedKey.name;
    const characterRecord = state.characters.find(
      (c) => c.name === characterName,
    );

    assert(characterRecord, X`${errors.inventory404}`);
    const characterSeat = characterRecord.inventory;
    assert(characterSeat, X`${errors.inventory404}`);

    const currentInventoryKey =
      characterSeat.getAmountAllocated('InventoryKey');

    const { want } = seat.getProposal();
    const { Item: wantedItems } = want;

    assert(providedKey, X`${errors.invalidInventoryKey}`);

    // Widthdraw Key from user seat
    seat.decrementBy({ InventoryKey1: providedKeyAmount });
    // Deposit Item and Key to inventory seat
    characterSeat.decrementBy({ Item: wantedItems });
    seat.incrementBy({ Item: wantedItems });
    characterSeat.incrementBy({ InventoryKey: providedKeyAmount });
    // Widthdraw Key from character seat and deposit into user seat
    characterSeat.decrementBy({ InventoryKey: currentInventoryKey });
    seat.incrementBy({ InventoryKey2: currentInventoryKey });

    zcf.reallocate(seat, characterSeat);

    // Add to private state
    const characterIndex = privateState.findIndex(
      (c) => c.name === characterName,
    );
    assert(characterIndex >= 0, X`no character private state found`);
    privateState[characterIndex] = {
      name: characterRecord.name,
      history: [
        {
          id: 0,
          remove: [wantedItems.value.map((i) => i.title)],
        },
      ],
    };
    seat.exit();
  };

  // Opportunity for more complex queries
  const getCharacters = () => {
    return harden({
      characters: state.characters,
    });
  };

  /**
   * Gets the inventory of a given character
   *
   * @param {string} characterName
   */
  const getCharacterInventory = (characterName) => {
    const characterRecord = state.characters.find(
      ({ character }) => character.name === characterName,
    );
    assert(characterRecord, X`${errors.character404}`);
    const { inventory } = characterRecord;
    const items = inventory.getAmountAllocated('Item', itemBrand);
    return { items };
  };

  const creatorFacet = Far('Character store creator', {
    initConfig,
    getCharacterIssuer: () => characterIssuer,
    getItemIssuer: () => itemIssuer,
    getItemBrand: () => itemBrand,
    getCharacters,
    getConfig: () => state.config,
  });

  const publicFacet = Far('Chracter store public', {
    getConfig: () => state.config,
    getCharacterBase: () => state.config?.baseCharacters[0],
    getCharacters,
    getCharacterInventory,
    getCount: () => state.characterNames.length,
    getCharacterIssuer: () => characterIssuer,
    getCharacterBrand: () => characterBrand,
    getItemIssuer: () => itemIssuer,
    getItemBrand: () => itemBrand,
    getNftConfig: () => ({ characterBrand, characterIssuer }),
    getRandomBaseCharacter,
    getRandomItem,
    equip: () => zcf.makeInvitation(equip, 'addToInventory'),
    unequip: () => zcf.makeInvitation(unequip, 'removeFromInventory'),
    mintCharacterNFT: () =>
      zcf.makeInvitation(mintCharacterNFT, 'mintCharacterNfts'),
    mintItemNFT: () => zcf.makeInvitation(mintItemNFT, 'mintItemNfts'),
    getPrivateState: () => privateState,
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
