export {};

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      loginViaAPI(username: string, password: string): Cypress.Chainable<string>;
      setAuthToken(token: string): Cypress.Chainable<void>;
      getAuthToken(): Cypress.Chainable<string | null>;
      clearAuth(): Cypress.Chainable<void>;
      interceptSearch(delay?: number): Cypress.Chainable<void>;
      interceptSearchError(statusCode: number): Cypress.Chainable<void>;
      interceptSearchEmpty(): Cypress.Chainable<void>;
      searchProducts(query: string): Cypress.Chainable<void>;
    }
  }
}

// Autenticação
Cypress.Commands.add('loginViaAPI', function(username: string, password: string): Cypress.Chainable<string> {
  return cy.request({
    method: 'POST',
    url: 'https://dummyjson.com/auth/login',
    body: { username, password }
  }).then((response) => {
    expect(response.status).to.eq(200);
    return cy.wrap(response.body.token) as unknown as Cypress.Chainable<string>;
  });
});

Cypress.Commands.add('setAuthToken', function(token: string): Cypress.Chainable<void> {
  cy.window().then((win) => {
    win.localStorage.setItem('token', token);
  });
  return cy.wrap(null) as unknown as Cypress.Chainable<void>;
});

Cypress.Commands.add('getAuthToken', function(): Cypress.Chainable<string | null> {
  return cy.window().then((win) => {
    return win.localStorage.getItem('token');
  }) as unknown as Cypress.Chainable<string | null>;
});

Cypress.Commands.add('clearAuth', function(): Cypress.Chainable<void> {
  cy.window().then((win) => {
    win.localStorage.removeItem('token');
  });
  return cy.wrap(null) as unknown as Cypress.Chainable<void>;
});

// Interceptações de busca
Cypress.Commands.add('interceptSearch', function(delay?: number): Cypress.Chainable<void> {
  cy.intercept('GET', '**/products/search?q=*', (req) => {
    if (delay) {
      req.on('response', (res) => {
        res.setDelay(delay * 1000);
      });
    }
  }).as('searchRequest');
  return cy.wrap(null) as unknown as Cypress.Chainable<void>;
});

Cypress.Commands.add('interceptSearchError', function(statusCode: number): Cypress.Chainable<void> {
  cy.intercept('GET', '**/products/search?q=*', {
    statusCode: statusCode,
    body: { message: 'Internal Server Error' }
  }).as('searchError');
  return cy.wrap(null) as unknown as Cypress.Chainable<void>;
});

Cypress.Commands.add('interceptSearchEmpty', function(): Cypress.Chainable<void> {
  cy.intercept('GET', '**/products/search?q=*', {
    statusCode: 200,
    body: { products: [], total: 0, limit: 10, skip: 0 }
  }).as('searchEmpty');
  return cy.wrap(null) as unknown as Cypress.Chainable<void>;
});

Cypress.Commands.add('searchProducts', function(query: string): Cypress.Chainable<void> {
  cy.get('[data-testid="search-input"]').clear().type(query);
  return cy.wrap(null) as unknown as Cypress.Chainable<void>;
});