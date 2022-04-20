describe('Before you start page directly', function () {
  it('should prevent access', function () {
    cy.visit('/before-you-start', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});
describe('Before you start page', function () {

  beforeEach(() => {
    // GET `/start`
    cy.visit('/start');

    // POST `/start`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/before-you-start`~
    // POST `/before-you-start`
    cy.get('#main-content form button.naturescot-forward-button').click();
  });

  it('main button should navigate to conviction', function () {
    cy.visit('/start');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/conviction');
  });
});
