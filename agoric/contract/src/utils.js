// @ts-check
import { assert, details as X } from '@agoric/assert';
import { makeStoredPublishKit } from '@agoric/notifier';
import { E } from '@endo/eventual-send';
import { errors } from './errors.js';

export const sameType = (a, b) => {
  const objectA = Object(a) === a;
  const objectB = Object(b) === b;
  if (objectA && objectB)
    return Object.getPrototypeOf(a) === Object.getPrototypeOf(b);
  else if (!objectA && !objectB) return typeof a === typeof b;
  else return false;
};

/* eslint-disable no-bitwise, no-plusplus */
// Based on 53-bit hash algorithm
export const makeHashId = (str, seed = 42) => {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  const primeA = 2246822507;
  const primeB = 3266489909;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), primeA) ^ Math.imul(h2 ^ (h2 >>> 13), primeB);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), primeA) ^ Math.imul(h1 ^ (h1 >>> 13), primeB);
  return (
    (h2 >>> 0).toString(16).padStart(8, 0) +
    (h1 >>> 0).toString(16).padStart(8, 0)
  );
};

/**
 * @param {string} name
 * @param {Object} randomCharacterBase
 * @param currentTime
 * @param newCharacterId
 * @returns {Object[]}
 */
export const makeCharacterNftObjs = (
  name,
  randomCharacterBase,
  newCharacterId,
  currentTime,
) => {
  // Merge random base character with name input, id, and keyId
  // TODO: Replace Date by a valid time generator now it returns NaN
  const newCharacter1 = {
    ...randomCharacterBase,
    date: currentTime,
    id: newCharacterId,
    name,
    keyId: 1,
  };
  const newCharacter2 = {
    ...newCharacter1,
    keyId: 2,
  };
  return [newCharacter1, newCharacter2];
};

/**
 * @param {any[]} arr
 * @param {number} interval
 * @param {number} page
 * @returns {any[]}
 */
export const getPage = (arr, interval, page) =>
  [...Array(Math.ceil(arr.length / interval)).keys()].map((idx) =>
    arr.slice(idx * interval, idx * interval + interval),
  )[page - 1];

/**
 * @param {CharacterMarketRecord[]} arr
 * @param {string} name
 * @returns {CharacterMarketRecord[]}
 */
export const removeCharacterFromMarketArray = (arr, name) => {
  const newArr = [...arr];
  const index = newArr.findIndex((entry) => entry.name === name);
  if (index > -1) {
    newArr.splice(index, 1);
  }
  return newArr;
};

/**
 * @param {ItemMarketRecord[]} arr
 * @param {string} id
 * @returns {ItemMarketRecord[]}
 */
export const removeItemFromMarketArray = (arr, id) => {
  const newArr = [...arr];
  const index = newArr.findIndex((entry) => entry.id === id);
  if (index > -1) {
    newArr.splice(index, 1);
  }
  return newArr;
};

/**
 * @template T
 * @typedef {object} PublishKit<T>
 * @property {Publisher<T>} publisher
 * @property {StoredSubscriber<T>} subscriber
 */

/**
 * @template T
 * @param {ERef<StorageNode>} storageNode
 * @param {ERef<Marshaller>} marshaller
 * @param {string} path
 * @returns {PublishKit<T>}
 */
export const makeStorageNodePublishKit = (storageNode, marshaller, path) => {
  assert(storageNode && marshaller, X`${errors.missingStorageNode}`);
  const marketNode = E(storageNode).makeChildNode(path);
  /** @type {StoredPublishKit<T>} */
  const kit = makeStoredPublishKit(marketNode, marshaller);
  return {
    publisher: kit.publisher,
    subscriber: kit.subscriber,
  };
};

/**
 * Stores the storage node and marshaller
 * and creates the relevant notifiers
 *
 * @param { Powers } powers
 * @returns { Notifiers }
 */
export const setupStorageNodeNotifiers = ({ storageNode, marshaller }) => {
  assert(storageNode && marshaller, X`${errors.invalidArg}`);

  const notifiers = {
    market: {
      characters: makeStorageNodePublishKit(
        storageNode,
        marshaller,
        'market-characters',
      ),
      items: makeStorageNodePublishKit(storageNode, marshaller, 'market-items'),
    },
    inventory: makeStorageNodePublishKit(
      storageNode,
      marshaller,
      'inventory-general',
    ),
    info: makeStorageNodePublishKit(storageNode, marshaller, 'info'),
  };

  return notifiers;
};

/**
 * @template T
 * @typedef {object} RecorderKit<T>
 * @property {Publisher<T>} publisher
 * @property {StoredSubscriber<T>} subscriber
 */

/**
 * @template T
 * @param {ERef<StorageNode>} storageNode
 * @param {import('@agoric/zoe/src/contractSupport').MakeRecorderKit} makeRecorderKit
 * @param {string} path
 * @returns {Promise<import('@agoric/zoe/src/contractSupport').RecorderKit<T>>}
 */
export const makeStorageNodeRecorderKit = async (
  storageNode,
  makeRecorderKit,
  path,
) => {
  const node = await E(storageNode).makeChildNode(path);
  return makeRecorderKit(node);
};

//TODO: fix typing
export const makeStorageNodeRecorderKits = async (
  storageNode,
  makeRecorderKit,
  paths,
) => {
  const recorderMap = {};
  await Promise.all(
    Object.keys(paths).map(async (key) => {
      const recorderKit = await makeStorageNodeRecorderKit(
        storageNode,
        makeRecorderKit,
        paths[key],
      );
      recorderMap[key] = recorderKit;
    }),
  );

  return recorderMap;
};
