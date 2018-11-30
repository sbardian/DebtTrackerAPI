import { getUser } from '../../src/client/utils/mockData';

describe('Register button test', () => {
  it('Should load register page', () => {
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
      .getByText(new RegExp(user.username, 'i'));
  });
});
