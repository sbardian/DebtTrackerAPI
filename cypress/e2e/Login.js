import { getUser } from '../../src/client/utils/mockData';

describe('Login test', () => {
  it('Should login an existing user', () => {
    const user = getUser();
    cy.visit('/')
      .getByText('Register')
      .click()
      .getByLabelText(/email/i)
      .type(user.email)
      .getByLabelText(/username/i)
      .type(user.username)
      .getByLabelText(/password/i)
      .type(user.password)
      .getByLabelText(/confirm password/i)
      .type(user.password)
      .getByTestId(/register-button/)
      .click()
      .getByTestId(/logout-button/i)
      .click()
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
