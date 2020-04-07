describe('Site Location page directly', function () {
  it('should prevent access', function () {
    cy.visit('/site-location', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Site Location page ', function () {
  beforeEach(() => {
    // GET `/start`
    cy.visit('/start');

    // POST `/start`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/gdpr`~
    // POST `/gdpr`
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
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/site-location');
    cy.get('h1').should('contain', 'site details');
  });

  it('blank entries + main button should navigate to same page with error', function () {
    cy.visit('/site-location');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/site-location');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a')
      .should('contain', 'Enter the site name')
      .and('contain', 'Add at least one sett');

    cy.get('form .govuk-form-group--error')
      .should('contain', 'Enter the site name')
      .and('contain', 'Add at least one sett');
  });

  it('add button should navigate to sett details', function () {
    cy.visit('/site-location');
    cy.get('#main-content form button.naturescot-button--add').click();
    cy.url().should('include', '/sett-details');
  });

  it('add button then main button should navigate to same page with error', function () {
    cy.visit('/site-location');
    cy.get('#main-content form button.naturescot-button--add').click();
    cy.url().should('include', '/sett-details');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/sett-details');

    cy.get('.govuk-error-summary ul li a')
      .should('contain', 'Enter a Sett ID')
      .and('contain', 'Enter a Grid Reference')
      .and('contain', 'Choose a sett type')
      .and('contain', 'Enter the number of Entrances');
  });

  it('add button then filled-out entries + main button should navigate back to site location page', function () {
    cy.visit('/site-location');
    cy.get('#main-content form button.naturescot-button--add').click();
    cy.url().should('include', '/sett-details');

    cy.get('input[type="text"]#current-sett-id').type('ABC123');
    cy.get('input[type="text"]#current-grid-reference').type('NH60004000');
    cy.get('input[type="radio"][value="2"]').click();
    cy.get('input[type="text"]#current-entrances').type('3');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/site-location');
  });

  it('add a sett then enter name + main button should navigate to confirm page', function () {
    cy.visit('/site-location');
    cy.get('#main-content form button.naturescot-button--add').click();
    cy.url().should('include', '/sett-details');

    cy.get('input[type="text"]#current-sett-id').type('ABC123');
    cy.get('input[type="text"]#current-grid-reference').type('NH60004000');
    cy.get('input[type="radio"][value="2"]').click();
    cy.get('input[type="text"]#current-entrances').type('3');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/site-location');

    cy.get('input[type="text"]#site-name').type('Hundred Acre Wood');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/confirm');
  });
});
