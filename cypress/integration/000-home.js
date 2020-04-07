describe('Home page', function () {
  it('successfully loads', function () {
    cy.visit('/');
  });

  it('redirects to start', function () {
    cy.visit('/');
    cy.url().should('include', '/start');
  });
});
