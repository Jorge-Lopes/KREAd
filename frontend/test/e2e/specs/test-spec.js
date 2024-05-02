/* eslint-disable ui-testing/no-disabled-tests */

const localChainConfig = {
    "rpc": "http://localhost:26657",
    "rest": "http://localhost:1317",
    "chainId": "agoriclocal",
    "chainName": "Agoric localhost",
    "stakeCurrency": {
      "coinDenom": "BLD",
      "coinMinimalDenom": "ubld",
      "coinDecimals": 6,
      "gasPriceStep": {
        "low": 0,
        "average": 0,
        "high": 0
      }
    },
    "walletUrlForStaking": "https://wallet.agoric.app.staking.agoric.app",
    "bip44": {
      "coinType": 564
    },
    "bech32Config": {
      "bech32PrefixAccAddr": "agoric",
      "bech32PrefixAccPub": "agoricpub",
      "bech32PrefixValAddr": "agoricvaloper",
      "bech32PrefixValPub": "agoricvaloperpub",
      "bech32PrefixConsAddr": "agoricvalcons",
      "bech32PrefixConsPub": "agoricvalconspub"
    },
    "currencies": [
      {
        "coinDenom": "BLD",
        "coinMinimalDenom": "ubld",
        "coinDecimals": 6,
        "gasPriceStep": {
          "low": 0,
          "average": 0,
          "high": 0
        }
      },
      {
        "coinDenom": "IST",
        "coinMinimalDenom": "uist",
        "coinDecimals": 6,
        "gasPriceStep": {
          "low": 0,
          "average": 0,
          "high": 0
        }
      }
    ],
    "feeCurrencies": [
      {
        "coinDenom": "IST",
        "coinMinimalDenom": "uist",
        "coinDecimals": 6,
        "gasPriceStep": {
          "low": 0,
          "average": 0,
          "high": 0
        }
      }
    ],
    "features": [
      "stargate",
      "ibc-transfer"
    ]
  };

describe('DAPP Offer Up E2E Test Cases', () => {
    context('Test commands', () => {
      it('should ', () => {
        cy.visit('/');
        cy.window().then(cyWindow => {
            cyWindow.keplr.experimentalSuggestChain(localChainConfig)
            return null;
          }
        ).then(() => cy.acceptAccess());
        cy.contains('connect Keplr Wallet').click();
        cy.acceptAccess().then(taskCompleted => {
          expect(taskCompleted).to.be.true;
        });
      });

      it(`should complete Keplr setup by importing an existing wallet using private key`, () => {
        cy.setupWallet({
          privateKey: Cypress.env('PRIVATE_KEY'),
          password : 'Test1234',
          newAccount: true,
          walletName: 'Kread test wallet',
          selectedChains : ['Agoric localhost'],
          createNewWallet : false,
        }).then(setupFinished => {
          expect(setupFinished).to.be.true;
        });
      });

      it(`should get wallet address for Agoric`, () => {
        cy.getWalletAddress('Agoric localhost').then(walletAddress => {
          expect(walletAddress.length).to.be.equal(45);
        });
      });

      it(`should get the accurate values for the tokens in the wallet`, () => {
        cy.getTokenAmount('BLD').then(tokenValue => {
          expect(tokenValue).to.gte(5); // For tx fees
        });
        cy.getTokenAmount('IST').then(tokenValue => {
          expect(tokenValue).to.gte(20);
        });
      });

      it('should buy selected item', () => {
        cy.visit('/shop/items');

        const form = cy.get('#hello').children().first().find(
          '[data-cy="button"]').click().get('[data-cy="buy-offer"]');

        form.should('exist').click();

        cy.confirmTransaction().then((taskCompleted) => {
          expect(taskCompleted).to.be.true;
        });

        cy.get('#closeNotificationButton').click();

        cy.get('[data-cy="buy-confirm"]').should('be.enabled').click();

        cy.get('[data-cy="confirm-check"]').click();
      });

      it(`should create new character`, () => {
        debugger
        cy.visit('/character');
        cy.contains('create a new character').click();
        cy.get('#root > div > section > div > div.css-ra3ygx-ContentWrapper.eln6yby16 > form > div.css-18b5bhk-FormFields.eln6yby17 > div > input').type('test-e2e-1');
        cy.contains('next').click();
        cy.get('#root > div > section > div > div.css-ra3ygx-ContentWrapper.eln6yby16 > div.css-2iorbx-StepContainer.eln6yby12 > div.css-st8xlq-StepWrapper.eln6yby10 > div > button').click();
        cy.confirmTransaction().then((taskCompleted) => {
          expect(taskCompleted).to.be.true;
        });
        cy.get('#root > div > section > div > div.css-ra3ygx-ContentWrapper.eln6yby16 > div.css-hmnl7f-ButtonWrapper.eln6yby2 > div > button').click();
        cy.get('#root > div > section > div > div.css-ra3ygx-ContentWrapper.eln6yby16 > div.css-1fwd4h0-ButtonContainer.eln6yby14 > button').click();
      });

      it(`should verify character`, () => {
        cy.visit('/character');
        cy.contains('my Characters').click();
        cy.contains('test-e2e')
      });

      it(`should sell character`, () => {
        cy.get('#root > div > div.css-1u0eero-ChildrenContainer-ChildrenContainer.el6gwdp1 > div.css-gzfkp-Layout.e7ftloa18 > div.css-1skrci2-CanvasAssetInventoryWrapper.e1lh9tbw5 > div > div.css-1xefd4u-CanvasContentWrapper.e1lh9tbw2 > div.css-1hvzc0c-CardActionsContainer.e1lh9tbw1 > button').click();
        cy.get('#root > div > div > form > div.css-1wxtr10-FormFields.ekici4y9 > div > div.css-1ng6ct8-InputContainer.ekici4y7 > p > input').type(5);
        cy.get('#root > div > div > form > div.css-1fkkbj3-ButtonContainer.ekici4y19 > button').click();
        cy.get('#root > div > div > div.css-xxyme9-StepContainer.ekici4y17 > div.css-1adx2z9-GeneralInfo.ekici4y3 > button').click();
        cy.confirmTransaction().then((taskCompleted) => {
          expect(taskCompleted).to.be.true;
        });
        cy.get("#closeNotificationButton").click();
        cy.get('#root > div > div > div.css-hmnl7f-ButtonWrapper.eln6yby2 > div > button').click();
        cy.get('#root > div > div > div.css-1aii2zd-ConfirmationContainer.ekici4y0 > div.css-1fkkbj3-ButtonContainer.ekici4y19 > button').click();
      });

      it(`should verify sell record`, () => {
        cy.visit('/shop/characters');
        cy.contains('test-e2e')
      });

      it(`should create a second character`, () => {
        cy.visit('/character');
        cy.contains('create a new character').click();
        cy.get('#root > div > section > div > div.css-ra3ygx-ContentWrapper.eln6yby16 > form > div.css-18b5bhk-FormFields.eln6yby17 > div > input').type('test-e2e-2');
        cy.contains('next').click();
        cy.get('#root > div > section > div > div.css-ra3ygx-ContentWrapper.eln6yby16 > div.css-2iorbx-StepContainer.eln6yby12 > div.css-st8xlq-StepWrapper.eln6yby10 > div > button').click();
        cy.confirmTransaction().then((taskCompleted) => {
          expect(taskCompleted).to.be.true;
        });
        cy.get('#root > div > section > div > div.css-ra3ygx-ContentWrapper.eln6yby16 > div.css-hmnl7f-ButtonWrapper.eln6yby2 > div > button').click();
        cy.get('#root > div > section > div > div.css-ra3ygx-ContentWrapper.eln6yby16 > div.css-1fwd4h0-ButtonContainer.eln6yby14 > button').click();
      });

      it(`should unequip Item`, () => {
        cy.visit('/character');
        cy.get('#maskButton').click()
        cy.get('#unequipButton').click();
        cy.confirmTransaction().then((taskCompleted) => {
          expect(taskCompleted).to.be.true;
        });
        cy.get("#closeNotificationButton").click();
        cy.get('#unequipButton').should('be.disabled');
      });

      it(`should equip Item`, () => {
        cy.get("#unequippedItemButton").click();
        cy.get('#equipButton').click();
        cy.confirmTransaction().then((taskCompleted) => {
          expect(taskCompleted).to.be.true;
        });
        cy.get("#closeNotificationButton").click();
        cy.get('#equipButton').should('be.disabled');
      });
    });
});
