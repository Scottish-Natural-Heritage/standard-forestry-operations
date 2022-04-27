describe('Postcode page directly', function () {
  it('should prevent access', function () {
    cy.visit('/postcode', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Postcode page', function () {
  beforeEach(() => {
    // GET `/start`
    cy.visit('/start');

    // POST `/start`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/before-you-start``~
    // POST `/before-you-start``
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/conviction`~
    // CLICK no
    cy.get('#main-content form input[type="radio"][value="no"]').click();
    // POST `/conviction`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/details`~
    // FILL the form
    cy.get('input[type="text"]#full-name').type('Nature Scot', {delay: 1});
    cy.get('input[type="text"]#email-address').type('licensing@nature.scot', {delay: 1});
    cy.get('input[type="tel"]#phone-number').type('01463 725 000', {delay: 1});
    // POST `/details`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/details`~
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/postcode');
    cy.get('h1').should('contain', 'Postcode');
  });

  it('main button should navigate to Postcode', function () {
    cy.visit('/postcode');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/choose-address');
  });
});
