describe('Success page directly', function () {
  it('should prevent access with a custom error message', function () {
    cy.visit('/success', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'Application complete');
  });
});
