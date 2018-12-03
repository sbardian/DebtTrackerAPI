describe('Logout test', () => {
  it('Should login an existing user and then logout', () => {
    cy.registerUser().then(user => {
      cy.visit('/')
        .getByLabelText(/email/i)
        .type(user.email)
        .getByLabelText(/password/i)
        .type(user.password)
        .getByText(/login/i)
        .click()
        .getByText(new RegExp(user.username, 'i'))
        .getByTestId(/logout-button/i)
        .click()
        .queryByText(new RegExp(user.username, 'i'));
    });
  });
});
