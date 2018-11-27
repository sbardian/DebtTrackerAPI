describe('Register button test', () => {
  it('Should load register page', () => {
    cy.visit('/')
      .getByText('Register')
      .click()
      .getByTestId('title')
      .should('have.text', 'Register')
      .getByTestId('register-button')
      .should('have.text', 'register');
  });
});
