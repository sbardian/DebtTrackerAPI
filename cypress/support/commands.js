// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { getRegisterUser } from '../../src/client/utils/mockData';

Cypress.Commands.add('registerUser', () => {
  const user = getRegisterUser();
  cy.request({
    url: `${Cypress.config().baseUrl}/auth/register`,
    method: 'POST',
    body: user,
  }).then(response => JSON.parse(response.requestBody));
});

// Cypress.Commands.add('loginUser', user => {
//   cy.request({
//     url: `${Cypress.config().baseUrl}/auth/login`,
//     method: 'POST',
//     body: {
//       email: user.email,
//       password: user.password,
//     },
//   }).then(response => JSON.parse(response.requestBody));
// });
