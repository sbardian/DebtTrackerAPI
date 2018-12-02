const user = {
  email: 'test@test.com',
  password: 'test',
};

describe('Login test', () => {
  it('Should login a user', () => {
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
