describe('Sito Camicie basic flow', () => {
  it('visits app and shows header', () => {
    cy.visit('/');
    cy.contains('Configurator');
  });

  it('admin login and show admin controls', () => {
    cy.visit('/');
    cy.get('input[placeholder="username"]').type('admin');
    cy.get('input[placeholder="password"]').type('admin');
    cy.contains('Login').click();
    cy.wait(500);
    cy.get('input[type="file"]').should('not.be.disabled');
  });
});