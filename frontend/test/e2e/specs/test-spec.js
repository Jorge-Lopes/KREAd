/* eslint-disable ui-testing/no-disabled-tests */

const localChainConfig = {
  rpc: "http://localhost:26657",
  rest: "http://localhost:1317",
  chainId: "agoriclocal",
  chainName: "Agoric localhost",
  stakeCurrency: {
    coinDenom: "BLD",
    coinMinimalDenom: "ubld",
    coinDecimals: 6,
    gasPriceStep: {
      low: 0,
      average: 0,
      high: 0,
    },
  },
  walletUrlForStaking: "https://wallet.agoric.app.staking.agoric.app",
  bip44: {
    coinType: 564,
  },
  bech32Config: {
    bech32PrefixAccAddr: "agoric",
    bech32PrefixAccPub: "agoricpub",
    bech32PrefixValAddr: "agoricvaloper",
    bech32PrefixValPub: "agoricvaloperpub",
    bech32PrefixConsAddr: "agoricvalcons",
    bech32PrefixConsPub: "agoricvalconspub",
  },
  currencies: [
    {
      coinDenom: "BLD",
      coinMinimalDenom: "ubld",
      coinDecimals: 6,
      gasPriceStep: {
        low: 0,
        average: 0,
        high: 0,
      },
    },
    {
      coinDenom: "IST",
      coinMinimalDenom: "uist",
      coinDecimals: 6,
      gasPriceStep: {
        low: 0,
        average: 0,
        high: 0,
      },
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "IST",
      coinMinimalDenom: "uist",
      coinDecimals: 6,
      gasPriceStep: {
        low: 0,
        average: 0,
        high: 0,
      },
    },
  ],
  features: ["stargate", "ibc-transfer"],
};
const getBlockHeight = () => {
  return cy.request("http://localhost:26657/abci_info?").then(($response) => {
    expect($response.status).to.eq(200);
    return +$response.body.result.response.last_block_height;
  });
};

const checkBlockHeight = (firstBlockHeight, blockDifference = 10) => {
  expect(firstBlockHeight).to.be.greaterThan(0);
  getBlockHeight().then((height) => {
    cy.log(`Current block height: ${height}`);
    if (height < firstBlockHeight + blockDifference) {
      cy.log(
        `Waiting for block height to be ${firstBlockHeight + blockDifference}`,
      );
      cy.wait(5000);
      checkBlockHeight(firstBlockHeight, blockDifference);
    }
  });
};

describe("DAPP Offer Up E2E Test Cases", () => {
  context("Test commands", () => {
    it("should connect to Agoric local chain", () => {
      cy.visit("/");
      cy.window()
        .then((cyWindow) => {
          cyWindow.keplr.experimentalSuggestChain(localChainConfig);
          return null;
        })
        .then(() => cy.acceptAccess());
      cy.contains("connect Keplr Wallet").click();
      cy.acceptAccess().then((taskCompleted) => {
        expect(taskCompleted).to.be.true;
      });
    });

    it(`should complete Keplr setup by importing User1 wallet using private key`, () => {
      cy.setupWallet({
        privateKey: Cypress.env("USER1_PRIVATE_KEY"),
        password: "Test1234",
        newAccount: true,
        walletName: "User1 test wallet",
        selectedChains: ["Agoric localhost"],
        createNewWallet: false,
      }).then((setupFinished) => {
        expect(setupFinished).to.be.true;
      });
    });

    it(`should get wallet address for Agoric`, () => {
      cy.getWalletAddress("Agoric localhost").then((walletAddress) => {
        expect(walletAddress.length).to.be.equal(45);
      });
    });

    it(`should mint a character`, () => {
      cy.visit("/character");
      cy.get('[data-cy="new-character-button"]').should("be.enabled").click();
      cy.get('[data-cy="new-character-input"]').type("test-e2e-1");
      cy.get('[data-cy="next-button"]').should("be.enabled").click();
      cy.get('[data-cy="send-offer-button"]').should("be.enabled").click();
      cy.confirmTransaction().then((taskCompleted) => {
        expect(taskCompleted).to.be.true;
      });
      cy.get('[data-cy="confirm-offer-button"]').should("be.enabled").click();
      cy.get('[data-cy="visit-character-button"]').should("be.enabled").click();
      cy.contains("test-e2e-1");
    });

    it(`should unequip Item`, () => {
      cy.visit("/inventory/items");

      cy.get('[data-cy="unequip-item-button"]')
        .should("have.length", 3)
        .each(() => {
          getBlockHeight().then((height) => {
            const firstBlockHeight = height;

            cy.get('[data-cy="unequip-item-button"]')
              .first()
              .should("exist")
              .click();

            cy.confirmTransaction().then((taskCompleted) => {
              expect(taskCompleted).to.be.true;
            });
            cy.get('[data-cy="close-notification-button"]').click();

            checkBlockHeight(firstBlockHeight);
          });
        });
    });

    it("should buy Item", () => {
      cy.visit("/shop/items");

      cy.get('[data-cy="buy-item-button"]')
        .first()
        .click()
        .get('[data-cy="send-buy-offer-button"]')
        .should("exist")
        .click();

      cy.confirmTransaction().then((taskCompleted) => {
        expect(taskCompleted).to.be.true;
      });

      cy.get('[data-cy="close-notification-button"]').click();
      cy.get('[data-cy="confirm-buy-offer-button"]')
        .should("be.enabled")
        .click();
      cy.get('[data-cy="confirm-check-button"]').click();
    });

    it.skip(`should equip Item`, () => {
      cy.visit("/inventory/items");
      cy.get('[data-cy="equip-item-button"]').first().click();
      cy.confirmTransaction().then((taskCompleted) => {
        expect(taskCompleted).to.be.true;
      });
      cy.get('[data-cy="close-notification-button"]').click();
    });

    it(`should sell Character`, () => {
      cy.visit("/inventory/characters");

      cy.get('[data-cy="sell-character-button"]').should("exist").click();
      cy.get('[data-cy="sell-price-input"]').type("2");
      cy.get('[data-cy="next-button"]').should("be.enabled").click();
      cy.get('[data-cy="send-offer-button"]').should("be.enabled").click();

      cy.confirmTransaction().then((taskCompleted) => {
        expect(taskCompleted).to.be.true;
      });
      cy.get('[data-cy="close-notification-button"]').click();

      cy.get('[data-cy="confirm-offer-button"]').should("be.enabled").click();
      cy.get('[data-cy="confirm-check-button"]').click();

      cy.contains("test-e2e").should("not.exist");
    });

    it(`should sell Items`, () => {
      cy.visit("/inventory/items");
      cy.get('[data-cy="sell-item-button"]')
        .should("have.length", 4)
        .each(() => {
          cy.visit("/inventory/items");
          cy.get('[data-cy="sell-item-button"]')
            .first()
            .should("exist")
            .click();

          cy.get('[data-cy="sell-price-input"]').type("1");
          cy.get('[data-cy="next-button"]').should("be.enabled").click();
          cy.get('[data-cy="send-offer-button"]').should("be.enabled").click();

          cy.confirmTransaction().then((taskCompleted) => {
            expect(taskCompleted).to.be.true;
          });
          cy.get('[data-cy="close-notification-button"]').click();

          cy.get('[data-cy="confirm-offer-button"]')
            .should("be.enabled")
            .click();
          cy.get('[data-cy="confirm-check-button"]').click();
        });
    });

    it.skip(`should complete Keplr setup by importing User2 wallet using private key`, () => {
      cy.setupWallet({
        privateKey: Cypress.env("USER2_PRIVATE_KEY"),
        password: "Test1234",
        newAccount: true,
        walletName: "User2 test wallet",
        selectedChains: ["Agoric localhost"],
        createNewWallet: false,
      }).then((setupFinished) => {
        expect(setupFinished).to.be.true;
      });
    });

    it.skip(`should get wallet address for Agoric`, () => {
      cy.getWalletAddress("Agoric localhost").then((walletAddress) => {
        expect(walletAddress.length).to.be.equal(45);
      });
    });

    it.skip("should buy Character", () => {
      cy.visit("/shop/characters");

      cy.get('[data-cy="buy-character-button"]')
        .first()
        .click()
        .get('[data-cy="send-buy-offer-button"]')
        .should("exist")
        .click();

      cy.confirmTransaction().then((taskCompleted) => {
        expect(taskCompleted).to.be.true;
      });

      cy.get('[data-cy="close-notification-button"]').click();
      cy.get('[data-cy="confirm-buy-offer-button"]')
        .should("be.enabled")
        .click();
      cy.get('[data-cy="confirm-check-button"]').click();
    });

    it.skip("should buy Item", () => {
      cy.visit("/shop/items");

      cy.get('[data-cy="itemsCards"]')
        .children()
        .first()
        .find('[data-cy="buy-item-button"]')
        .click()
        .get('[data-cy="send-buy-offer-button"]')
        .should("exist")
        .click();

      cy.confirmTransaction().then((taskCompleted) => {
        expect(taskCompleted).to.be.true;
      });

      cy.get('[data-cy="close-notification-button"]').click();
      cy.get('[data-cy="confirm-buy-offer-button"]')
        .should("be.enabled")
        .click();
      cy.get('[data-cy="confirm-check-button"]').click();
    });
  });
});
