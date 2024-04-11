/* eslint-disable ui-testing/no-disabled-tests */

describe('DAPP Offer Up E2E Test Cases', () => {
    context('Test commands', () => {
      it(`should complete Keplr setup by  importing an existing wallet using 24 word phrase`, () => {
        cy.setupWallet().then((setupFinished) => {
          expect(setupFinished).to.be.true;
        });
        cy.visit('/');
      });
    });
});