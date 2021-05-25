describe('Other page directly', function () {
  it('should prevent access', function () {
    cy.visit('/other', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Other page ', function () {
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
    cy.visit('/other');
    cy.get('h1').should('contain', 'Will you be the named licence holder?');
  });

  it('"self" radio + main button should navigate to conviction', function () {
    cy.visit('/other');
    cy.get('#main-content form input[type="radio"][value="self"]').click();
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/conviction');
    cy.url().should('not.include', '/other-email');
  });

  it('"other" radio + main button should navigate to other-email', function () {
    cy.visit('/other');
    cy.get('#main-content form input[type="radio"][value="other"]').click();
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/other-email');
    cy.url().should('not.include', '/conviction');
  });
});
