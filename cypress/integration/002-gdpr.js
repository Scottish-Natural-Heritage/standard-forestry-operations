describe('GDPR page directly', function () {
  it('should prevent access', function () {
    cy.visit('/gdpr', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('GDPR page ', function () {
  beforeEach(() => {
    cy.visit('/start');
    cy.get('#main-content form button.naturescot-forward-button').click();
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/gdpr');
    cy.get('h1').should('contain', 'How we use your information');
  });

  it('main button should navigate to other', function () {
    cy.visit('/gdpr');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/other');
  });
});
