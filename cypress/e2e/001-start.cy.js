describe('Start page', function () {
  it('main button should navigate to before-you-start', function () {
    cy.visit('/start');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/before-you-start');
  });
});
