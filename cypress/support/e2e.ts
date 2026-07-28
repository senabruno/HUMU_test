import './commands/api-commands';

beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

Cypress.on('uncaught:exception', (err, runnable) => {
  console.error('Uncaught exception:', err.message);
  return false;
});