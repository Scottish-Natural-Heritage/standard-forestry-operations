describe('Eligible page directly', function () {
  it('should prevent access', function () {
    cy.visit('/eligible', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Eligible page ', function () {
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
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/eligible');
    cy.get('h1').should('contain', 'You are eligible');
  });

  it('main button should navigate to comply', function () {
    cy.visit('/eligible');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/comply');
  });
});
