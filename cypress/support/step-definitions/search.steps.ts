import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I will search for {string}', (query: string) => {
  cy.intercept('GET', `https://dummyjson.com/products/search?q=${query}`, (req) => {
    req.on('response', (res) => {
      res.setDelay(3000);
    });
  }).as('slowSearch');

  cy.visit('http://localhost:8080/search.html');
  cy.get('#searchInput').type(query);
  cy.get('#searchButton').click();

  cy.wait('@slowSearch');
});

Then('I should receive products', () => {
  cy.get('#products [data-testid="product"]', { timeout: 10000 })
    .should('have.length.gt', 0);
});

When('I trigger a request to httpbin status 500', () => {
  cy.intercept('GET', 'https://dummyjson.com/products/search?q=*', {
    statusCode: 500,
    body: { message: 'Internal Server Error' }
  }).as('forceError');

  cy.visit('http://localhost:8080/search.html');
  cy.get('#searchInput').type('test');
  cy.get('#searchButton').click();

  cy.wait('@forceError');
});

Then('I should receive a 500 status code', () => {
  cy.get('#error').should('be.visible');
  cy.contains('Error loading products').should('be.visible');
});

When('I search for {string} and receive empty results', (query: string) => {
  cy.intercept('GET', `https://dummyjson.com/products/search?q=${query}`, {
    statusCode: 200,
    body: { products: [], total: 0 }
  }).as('emptySearch');

  cy.visit('http://localhost:8080/search.html');
  cy.get('#searchInput').type(query);
  cy.get('#searchButton').click();

  cy.wait('@emptySearch');
});

Then('I should see {string} message', (message: string) => {
  cy.contains(message, { timeout: 5000 }).should('be.visible');
});