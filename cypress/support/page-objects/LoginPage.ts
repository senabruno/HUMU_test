export class LoginPage {
  private selectors = {
    usernameInput: 'input[type="text"]',
    passwordInput: 'input[type="password"]',
    loginButton: '.self-start',
    errorMessage: '.error-message, [role="alert"], .alert, .text-red-500, .text-danger'
  };

  visit() {
    cy.visit('/');
    return this;
  }

  fillUsername(username: string) {
    cy.get(this.selectors.usernameInput).clear().type(username);
    return this;
  }

  fillPassword(password: string) {
    cy.get(this.selectors.passwordInput).clear().type(password);
    return this;
  }

  submit() {
    cy.get(this.selectors.loginButton).click();
    return this;
  }

  login(username: string, password: string) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.submit();
    return this;
  }

  getErrorMessage() {
    return cy.get('body').then(($body) => {
      if ($body.text().toLowerCase().includes('invalid')) {
        return cy.contains(/invalid/i);
      }
      return cy.get(this.selectors.errorMessage);
    });
  }

  isOnLoginPage() {
    return cy.url().should('include', '/f4-contest-3');
  }

  waitForProfilePage() {
    cy.url({ timeout: 10000 }).should('include', '#/profile');
    return this;
  }
}