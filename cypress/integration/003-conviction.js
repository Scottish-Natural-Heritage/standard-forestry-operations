describe('Conviction page directly', function () {
  it('should prevent access', function () {
    cy.visit('/conviction', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Conviction page ', function () {
  beforeEach(() => {
    // GET `/start`
    cy.visit('/start');

    // POST `/start`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/gdpr`~
    // POST `/gdpr`
    cy.get('#main-content form button.naturescot-forward-button').click();
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/conviction');
    cy.get('h1').should('contain', 'Have you been convicted of a wildlife crime?');
  });

  it('"no" radio + main button should navigate to eligible', function () {
    cy.visit('/conviction');
    cy.get('#main-content form input[type="radio"][value="no"]').click();
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/eligible');
    cy.url().should('not.include', '/conviction-stop');
  });

  it('"yes" radio + main button should navigate to conviction-stop', function () {
    cy.visit('/conviction');
    cy.get('#main-content form input[type="radio"][value="yes"]').click();
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/conviction-stop');
    cy.url().should('not.include', '/eligible');
  });
});
