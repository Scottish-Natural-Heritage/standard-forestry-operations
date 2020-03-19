describe('Details page directly', function() {
  it('should prevent access', function() {
    cy.visit('/details', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Details page ', function() {
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
  });

  it('should allow access if the user visits all the pages in order', function() {
    cy.visit('/details');
    cy.get('h1').should('contain', 'personal details');
  });

  it('blank entries + main button should navigate to same page with error', function() {
    cy.visit('/details');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/details');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a')
      .should('contain', 'Enter your full name')
      .and('contain', 'Enter your building and street')
      .and('contain', 'Enter your town')
      .and('contain', 'Enter your postcode')
      .and('contain', 'Enter your phone number')
      .and('contain', 'Enter your email address');

    cy.get('form fieldset .govuk-form-group--error')
      .and('contain', 'Enter your full name')
      .and('contain', 'Enter your building and street')
      .and('contain', 'Enter your town')
      .and('contain', 'Enter your postcode')
      .and('contain', 'Enter your phone number')
      .and('contain', 'Enter your email address');
  });

  it('filled-out entries + main button should navigate to site location page', function() {
    cy.visit('/details');

    cy.get('input[type="text"]#full-name').type('Nature Scot');
    cy.get('input[type="text"]#address-line-1').type('Great Glen House');
    cy.get('input[type="text"]#address-town').type('Inverness');
    cy.get('input[type="text"]#address-postcode').type('IV3 8NW');
    cy.get('input[type="tel"]#phone-number').type('01463 725 000');
    cy.get('input[type="text"]#email-address').type('licensing@nature.scot');

    cy.get('#main-content form button.naturescot-forward-button').click();

    cy.url().should('include', '/site-location');
  });
});
