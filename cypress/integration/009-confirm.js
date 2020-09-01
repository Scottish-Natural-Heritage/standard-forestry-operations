describe('Confirm page directly', function () {
  it('should prevent access', function () {
    cy.visit('/confirm', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Confirm page ', function () {
  beforeEach(() => {
    // GET `/start`
    cy.visit('/start');

    // POST `/start`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/gdpr`~
    // POST `/gdpr`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/other`~
    // CLICK self
    cy.get('#main-content form input[type="radio"][value="self"]').click();
    // POST `/other`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/conviction`~
    // CLICK no
    cy.get('#main-content form input[type="radio"][value="no"]').click();
    // POST `/conviction`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/eligible`~
    // POST `/eligible`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/comply`~
    // CLICK yes
    cy.get('#main-content form input[type="checkbox"]#comply').click();
    // POST `/comply`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/details`~
    // FILL the form
    cy.get('input[type="text"]#full-name').type('Nature Scot', {delay: 1});
    cy.get('input[type="text"]#address-line-1').type('Great Glen House', {delay: 1});
    cy.get('input[type="text"]#address-town').type('Inverness', {delay: 1});
    cy.get('input[type="text"]#address-postcode').type('IV3 8NW', {delay: 1});
    cy.get('input[type="tel"]#phone-number').type('01463 725 000', {delay: 1});
    cy.get('input[type="text"]#email-address').type('licensing@nature.scot', {delay: 1});
    // POST `/details`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/site-location`~
    // POST add to `/site-location`
    cy.get('#main-content form button.naturescot-button--add').click();

    // ~GET `/sett-details`~
    // FILL the form
    cy.get('input[type="text"]#current-sett-id').type('ABC123', {delay: 1});
    cy.get('input[type="text"]#current-grid-reference').type('NH60004000', {delay: 1});
    cy.get('input[type="text"]#current-entrances').type('3', {delay: 1});
    // POST `/sett-details`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/site-location`~
    // POST continue to `/site-location`
    cy.get('#main-content form button.naturescot-forward-button').click();
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/confirm');
    cy.get('h1').should('contain', 'answers before sending');
  });

});
