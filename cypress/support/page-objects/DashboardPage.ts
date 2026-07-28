export class DashboardPage {
  private selectors = {
    searchInput: 'input[type="search"], input[placeholder*="Search"]',
    productRows: 'table tbody tr',
    productCategory: 'td:nth-child(6)',
    emptyState: '.empty-state, .no-results, .no-products',
    errorMessage: '.error, .alert'
  };

  visit() {
    cy.visit('https://dummy-json-api.codewithriz.com');
    return this;
  }

  waitForLoading() {
    cy.get(this.selectors.productRows, { timeout: 10000 }).should('exist');
    return this;
  }

  search(query: string) {
    cy.get(this.selectors.searchInput).clear().type(query);
    cy.wait(1000);
    return this;
  }

  getProductRows() {
    return cy.get(this.selectors.productRows);
  }

  getEmptyState() {
    return cy.get(this.selectors.emptyState);
  }

  getErrorMessage() {
    return cy.get(this.selectors.errorMessage);
  }
}