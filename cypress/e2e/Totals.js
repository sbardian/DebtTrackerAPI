describe('Totals test', () => {
  it('Should pull totals', () => {
    cy.registerUser().then(user => {
      cy.visit('/')
        .getByLabelText(/email/i)
        .type(user.email)
        .getByLabelText(/password/i)
        .type(user.password)
        .getByText(/login/i)
        .click()
        .getByTestId('totals-tab-button')
        .click()
        .getByTestId('totals-toolbar-title');
    });
  });
});
