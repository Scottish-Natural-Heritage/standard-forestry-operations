describe('Start page', function() {
  it('main button should navigate to gdpr', function() {
    cy.visit('/start');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/gdpr');
  });
});
