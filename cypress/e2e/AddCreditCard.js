describe('Add CreditCard', () => {
  const card = {
    name: 'Test Card',
    limit: 2000,
    balance: 1000,
    interest_rate: 5,
  };
  it('Should add a creditcard', () => {
    cy.registerUser().then(user => {
      cy.visit('/')
        .getByLabelText(/email/i)
        .type(user.email)
        .getByLabelText(/password/i)
        .type(user.password)
        .getByText(/login/i)
        .click()
        .getByTestId('add-card')
        .click()
        .get('#name')
        .type(card.name)
        .get('#limit')
        .type(card.limit)
        .get('#balance')
        .type(card.balance)
        .get('#interest_rate')
        .type(card.interest_rate)
        .getByTestId('save-card-button')
        .click()
        .getByText(/CARD ADDED/i);
    });
  });
});
