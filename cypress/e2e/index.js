describe('Register button test', () => {
  it('Should load register page', () => {
    cy.visit('/')
      .get('form > :nth-child(3) > :nth-child(2)')
      .click()
      .get('.MuiTypography-root-139')
      .should('have.text', 'Register')
      .get('.MuiToolbar-root-271 > :nth-child(2)')
      .should('have.text', 'register');
  });
});
