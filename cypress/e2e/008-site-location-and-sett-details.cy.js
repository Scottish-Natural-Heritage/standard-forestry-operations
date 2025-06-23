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
    cy.get('input[type=text][name=addressPostcode]').type('IV3 8NW');
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/choose-address`~
    // FILL the form
    cy.get('select[name=address]').select('10092032547');
    // POST `/choose-address`
    cy.get('button.govuk-button[name=addressFound][value=yes]').click();
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
    cy.get('.govuk-error-summary ul li a').should('contain', 'Add at least one sett');
    cy.get('form .govuk-form-group--error').should('contain', 'Add at least one sett');
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
      .and('contain', 'Enter the number of Entrances');
  });

  it('add button then filled-out entries + main button should navigate back to site location page', function () {
    cy.visit('/site-location');
    cy.get('#main-content form button.naturescot-button--add').click();
    cy.url().should('include', '/sett-details');

    cy.get('input[type="text"]#current-sett-id').type('ABC123');
    cy.get('input[type="text"]#current-grid-reference').type('NH60004000');
    cy.get('input[type="text"]#current-entrances').type('3');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/site-location');
  });

  it('add a sett then main button should navigate to confirm page', function () {
    cy.visit('/site-location');
    cy.get('#main-content form button.naturescot-button--add').click();
    cy.url().should('include', '/sett-details');

    cy.get('input[type="text"]#current-sett-id').type('ABC123');
    cy.get('input[type="text"]#current-grid-reference').type('NH60004000');
    cy.get('input[type="text"]#current-entrances').type('3');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/site-location');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/confirm');
  });

  it('add a second sett with the same name as the first should give an error', function () {
    cy.visit('/site-location');
    cy.get('#main-content form button.naturescot-button--add').click();
    cy.url().should('include', '/sett-details');

    // Enter a first sett.
    cy.get('input[type="text"]#current-sett-id').type('ABC123');
    cy.get('input[type="text"]#current-grid-reference').type('NH60004000');
    cy.get('input[type="text"]#current-entrances').type('3');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/site-location');

    cy.get('#main-content form button.naturescot-button--add').click();
    cy.url().should('include', '/sett-details');

    // Enter a second sett with the same details.
    cy.get('input[type="text"]#current-sett-id').type('ABC123');
    cy.get('input[type="text"]#current-grid-reference').type('NH60004000');
    cy.get('input[type="text"]#current-entrances').type('3');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/sett-details');
    cy.get('.govuk-error-summary ul li a').should('contain', 'Enter a different Sett ID');
  });

  it('add a second sett with a different name to the first then should navigate back to site location page', function () {
    cy.visit('/site-location');
    cy.get('#main-content form button.naturescot-button--add').click();
    cy.url().should('include', '/sett-details');

    // Enter a first sett.
    cy.get('input[type="text"]#current-sett-id').type('ABC123');
    cy.get('input[type="text"]#current-grid-reference').type('NH60004000');
    cy.get('input[type="text"]#current-entrances').type('3');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/site-location');

    cy.get('#main-content form button.naturescot-button--add').click();
    cy.url().should('include', '/sett-details');

    // Enter a second sett with different ID but same grid reference.
    cy.get('input[type="text"]#current-sett-id').type('XYZ456');
    cy.get('input[type="text"]#current-grid-reference').type('NH60004000');
    cy.get('input[type="text"]#current-entrances').type('1');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/site-location');
  });

  it('forbidden characters should generate errors', function () {
    cy.visit('/site-location');
    cy.get('#main-content form button.naturescot-button--add').click();
    cy.url().should('include', '/sett-details');

    cy.get('input[type="text"]#current-sett-id').type('<a href="">FakeNastyLink</a>');
    cy.get('input[type="text"]#current-grid-reference').type('NH60004000');
    cy.get('input[type="text"]#current-entrances').type('3');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/sett-details');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'Sett ID must only include letters a to z, and special characters such as hyphens, spaces and apostrophes',
    );

    cy.get('form .govuk-form-group--error').and(
      'contain',
      'Sett ID must only include letters a to z, and special characters such as hyphens, spaces and apostrophes',
    );
  });
});
