describe('Error page', function () {
  it('successfully loads', function () {
    cy.visit('/definitely-a-fake-page', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'not found');
  });
});
