import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

let apiResponse: any = {};

Given('I open the product dashboard', () => {
  cy.intercept('GET', 'https://dummyjson.com/products?*').as('apiCall');

  cy.visit('http://localhost:8080/dashboard.html', { timeout: 30000 });
  cy.get('body', { timeout: 30000 }).should('be.visible');

  cy.wait('@apiCall', { timeout: 15000 }).then((interception) => {
    apiResponse = interception.response?.body || {};
  });

  cy.get('#products', { timeout: 30000 }).should('be.visible');
});

When('I am on page 1', () => {
  cy.get('#pagination button:first-child').should('be.disabled');
});

When('I click on page 2', () => {
  cy.intercept('GET', 'https://dummyjson.com/products?limit=5&skip=5*').as('apiCallPage2');

  cy.get('#pagination button:contains("2")').click();

  cy.wait('@apiCallPage2', { timeout: 15000 }).then((interception) => {
    apiResponse = interception.response?.body || {};
  });
});

When('I select the category {string}', (category: string) => {
  cy.intercept('GET', `https://dummyjson.com/products/category/${category}?*`).as('apiCallFilter');

  cy.get('#categoryFilter').select(category);

  cy.wait('@apiCallFilter', { timeout: 15000 }).then((interception) => {
    apiResponse = interception.response?.body || {};
  });
});

Then('the displayed products should match the API response for page {int}', (page: number) => {
  const limit = 5;
  const start = (page - 1) * limit;

  cy.get('#products [data-testid="product"]', { timeout: 10000 }).then(($uiProducts) => {
    const uiCount = $uiProducts.length;
    const expectedCount = Math.min((apiResponse.total || 0) - start, limit);
    expect(uiCount).to.eq(expectedCount);
  });
});

Then('all displayed products should be from category {string}', (category: string) => {
  cy.get('#products [data-testid="product"]', { timeout: 10000 }).each(($el) => {
    cy.wrap($el).should('contain', category);
  });
});

Then('the product count should match the API response', () => {
  cy.get('#products [data-testid="product"]', { timeout: 10000 }).then(($uiProducts) => {
    const uiCount = $uiProducts.length;
    const apiCount = apiResponse.products?.length || 0;
    expect(uiCount).to.eq(apiCount);
  });
});