import { getUser } from '../../src/client/utils/mockData';

describe('Login test', () => {
  it('Should login an existing user', () => {
    const user = getUser();
    cy.request({
      url: `${Cypress.config().baseUrl}/auth/register`,
      method: 'POST',
      body: user,
    });
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
