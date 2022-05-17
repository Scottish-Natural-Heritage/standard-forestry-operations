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
    cy.get('h1').should('contain', 'What is your postcode?');
  });

  it('throws error after a blank submission', () => {
    cy.get('button.govuk-button').click();
    cy.get('h1').contains('postcode', {matchCase: false});
    cy.get('.govuk-error-summary__title').contains('problem', {matchCase: false});
  });

  it('throws error after an invalid submission', () => {
    cy.get('input[type=text][name=addressPostcode]').type('XM4');
    cy.get('button.govuk-button').click();
    cy.get('h1').contains('postcode', {matchCase: false});
    cy.get('.govuk-error-summary__title').contains('problem', {matchCase: false});
  });

  it('takes us to choose-address after a successful form submission', () => {
    cy.get('input[type=text][name=addressPostcode]').type('IV3 8NW');
    cy.get('button.govuk-button').click();
    cy.get('h1').contains('choose', {matchCase: false});
    cy.get('h1').contains('address', {matchCase: false});
  });
});
