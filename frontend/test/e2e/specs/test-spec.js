/* eslint-disable ui-testing/no-disabled-tests */

describe('DAPP Offer Up E2E Test Cases', () => {
    context('Test commands', () => {
      it(`should complete Keplr setup by importing an existing wallet using 24 word phrase`, () => {
        cy.setupWallet({
          secretWords:
          'river bargain mirror again moon sell romance attend fatal odor stove gold when canoe name basket ladder latin tag sad swear school yellow replace',
          password : 'Test1234',
          newAccount: true,
          walletName: 'Kread test wallet',
          selectedChains : [], // ['Agoric localhost']
          createNewWallet : false,
        }).then(setupFinished => {
          expect(setupFinished).to.be.true;
        });
      });

      it(`should connect with Agoric Chain`, () => {
        cy.origin('https://wallet.agoric.app/', () => {
          cy.visit('/');
        });
        cy.acceptAccess().then(taskCompleted => {
          expect(taskCompleted).to.be.true;
        });
  
        cy.origin('https://wallet.agoric.app/', () => {
          cy.visit('/wallet/');
  
          cy.get('input.PrivateSwitchBase-input').click();
          cy.contains('Proceed').click();
  
          cy.get('button[aria-label="Settings"]').click();
  
          cy.get('#demo-simple-select').click();
          cy.get('li[data-value="local"]').click();
          cy.contains('button', 'Connect').click();
        });
  
        cy.acceptAccess().then(taskCompleted => {
          expect(taskCompleted).to.be.true;
        });
      });

      it(`should get wallet address for Agoric`, () => {
        cy.getWalletAddress('Agoric wallet').then(walletAddress => {
          expect(walletAddress.length).to.be.equal(45);
        });
      });
      
      it(`should get the accurate values for the tokens in the wallet`, () => {
        cy.getTokenAmount('BLD').then(tokenValue => {
          expect(tokenValue).to.equal(30);
        });
        cy.getTokenAmount('IST').then(tokenValue => {
          expect(tokenValue).to.equal(60);
        });
      });
  
      it(`should accept connection with wallet`, () => {
        cy.visit('/');
        cy.contains('connect Keplr Wallet').click();
        cy.acceptAccess().then(taskCompleted => {
          expect(taskCompleted).to.be.true;
        });
      });

      // this test should be removed. workaround to activate wallet
      it(`should activate smart wallet`, () => {
        cy.visit('/connect-wallet')
        cy.contains('activate Wallet').click();
        cy.confirmTransaction().then((taskCompleted) => {
          expect(taskCompleted).to.be.true;
        });
      });

      it(`should create new character`, () => {
        cy.visit('/character');
        cy.contains('create a new character').click();
        cy.get('#root > div > section > div > div.css-ra3ygx-ContentWrapper.eln6yby16 > form > div.css-18b5bhk-FormFields.eln6yby17 > div > input').type('test-e2e');
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
        cy.get('#root > div > div > div.css-hmnl7f-ButtonWrapper.eln6yby2 > div > button').click();
        cy.get('#root > div > div > div.css-1aii2zd-ConfirmationContainer.ekici4y0 > div.css-1fkkbj3-ButtonContainer.ekici4y19 > button').click();
      });

      it(`should verify sell record`, () => {
        cy.visit('/shop/characters');
        cy.contains('test-e2e')
      });
    });
});
