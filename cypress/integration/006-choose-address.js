describe('Choose address page directly', function () {
  it('should prevent access', function () {
    cy.visit('/choose-address', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('choose address page', function () {
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
    // ~GET `/postcode`~
    // POST `/postcode`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/choose-address`~
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/choose-address');
    cy.get('h1').should('contain', 'Choose your address');
  });

  it('main button should navigate to manual address page', function () {
    cy.visit('/choose-address');
    cy.get('#main-content form button.govuk-button--secondary').click();
    cy.url().should('include', '/manual-address');
  });

  it('main button should navigate to site location page', function () {
    cy.visit('/choose-address');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/site-location');
  });
});
