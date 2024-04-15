/* eslint-disable ui-testing/no-disabled-tests */

describe('DAPP Offer Up E2E Test Cases', () => {
    context('Test commands', () => {
      it(`should complete Keplr setup by  importing an existing wallet using 24 word phrase`, () => {
        cy.setupWallet({
          secretWords:
          'river bargain mirror again moon sell romance attend fatal odor stove gold when canoe name basket ladder latin tag sad swear school yellow replace',
          selectedChains: ['Agoric localhost'],
        }).then(setupFinished => {
          expect(setupFinished).to.be.true;
        });
        cy.visit('/');
      });

      it(`should accept connection with wallet`, () => {
        cy.contains('connect Keplr Wallet').click();
        cy.acceptAccess().then(taskCompleted => {
          expect(taskCompleted).to.be.true;
        });
      });


      // it(`should get wallet address for Agoric`, () => {
      //   cy.getWalletAddress('Agoric localhost').then(walletAddress => {
      //     expect(walletAddress.length).to.be.equal(45);
      //   });
      // });
      // it(`should get the accurate values for the tokens in the wallet`, () => {
      //   cy.switchWallet('My Wallet').then(taskCompleted => {
      //     expect(taskCompleted).to.be.true;
      //   });
      //   cy.addNewTokensFound();
      //   cy.getTokenAmount('BLD').then(tokenValue => {
      //     expect(tokenValue).to.equal(55.20000);
      //   });
      //   cy.getTokenAmount('IST').then(tokenValue => {
      //     expect(tokenValue).to.equal(403.3350);
      //   });
      // });
      
      // it(`should accept connection with wallet`, () => {
      //   cy.contains('connect Keplr Wallet').click();
      //   cy.contains('create a new character').click();
      //   cy.visit('/connect-wallet')
      //   cy.contains('activate Wallet').click();
      //   cy.acceptAccess().then((taskCompleted) => {
      //     expect(taskCompleted).to.be.true;
      //   });
      // });
      
      // it(`should create new character`, () => {
      //   cy.contains('create a new character').click();
      //   cy.get('#root > div > section > div > div.css-ra3ygx-ContentWrapper.eln6yby16 > form > div.css-18b5bhk-FormFields.eln6yby17 > div > input').type('test-e2e');
      //   cy.acceptAccess().then((taskCompleted) => {
      //     expect(taskCompleted).to.be.true;
      //   });
      // });
    });
});


// SECRET_WORDS="river bargain mirror again moon sell romance attend fatal odor stove gold when canoe name basket ladder latin tag sad swear school yellow replace" yarn test:e2e

