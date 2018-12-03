describe('Login test', () => {
  it('Should login an existing user', () => {
    cy.registerUser().then(user => {
      cy.visit('/')
        .getByLabelText(/email/i)
        .type(user.email)
        .getByLabelText(/password/i)
        .type(user.password)
        .getByText(/login/i)
        .click()
        .getByText(new RegExp(user.username, 'i'))
        .getByText(new RegExp('Credit Cards', 'i'));
    });
  });
});
