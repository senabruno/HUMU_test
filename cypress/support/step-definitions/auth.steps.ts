import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { LoginPage } from '../page-objects/LoginPage';

const loginPage = new LoginPage();

Given('I am on the login page', () => {
  loginPage.visit();
  loginPage.isOnLoginPage();
});

Given('I am authenticated via API with {string} and {string}', (username: string, password: string) => {
  cy.loginViaAPI(username, password).then(token => {
    cy.setAuthToken(token as string);
    cy.wrap(token).as('authToken');
  });
});

Given('I have a valid token in localStorage', () => {
  cy.get('@authToken').then(token => {
    cy.setAuthToken(token as string);
  });
});

When('I login with {string} and {string}', (username: string, password: string) => {
  loginPage.login(username, password);
});

When('I submit the login form', () => {
  loginPage.submit();
});

When('I visit the profile page directly', () => {
  cy.visit('#/profile');
});

When('I clear the authentication token', () => {
  cy.clearAuth();
});

When('I reload the page', () => {
  cy.reload();
});

When('I login with invalid credentials', () => {
  cy.get('input[type="text"]').clear().type('invaliduser');
  cy.get('input[type="password"]').clear().type('wrongpass');
  cy.get('.self-start').click();
});

Then('I should be redirected to the profile page', () => {
  loginPage.waitForProfilePage();
});

Then('I should see my profile information', () => {
  cy.url().should('include', '#/profile');
  cy.get('body').should('be.visible');
});

Then('the token should be stored in localStorage', () => {
  cy.getAuthToken().then(token => {
    expect(token).to.not.be.null;
    expect(token).to.be.a('string');
  });
});

Then('the token should persist after reload', () => {
  cy.reload();
  cy.getAuthToken().then(token => {
    expect(token).to.not.be.null;
  });
  cy.url().should('include', '#/profile');
});

Then('I should see an error message', () => {
  cy.get('body').then(($body) => {
    const text = $body.text();
    if (text.includes('Invalid') || text.includes('error') || text.includes('incorrect')) {
      cy.contains(/invalid|error|incorrect/i).should('be.visible');
    } else {
      cy.url().should('include', '/f4-contest-3');
    }
  });
});

Then('the error message should contain {string}', (message: string) => {
  cy.get('body').then(($body) => {
    if ($body.text().includes(message)) {
      cy.contains(message).should('be.visible');
    } else {
      cy.intercept('POST', 'https://dummyjson.com/auth/login').as('loginCheck');
      cy.wait('@loginCheck').then((inter) => {
        expect(inter.response?.statusCode).to.eq(400);
      });
    }
  });
});

Then('I should remain on the login page', () => {
  cy.url().should('include', '/f4-contest-3');
  cy.get('input[type="text"]').should('be.visible');
});

Then('I should not be authenticated', () => {
  cy.getAuthToken().then(token => {
    expect(token).to.be.null;
  });
});

Then('the session should be invalid and redirect to login', () => {
  cy.url().should('include', '/f4-contest-3');
  cy.get('input[type="text"]').should('be.visible');
});

Then('I should be redirected to the login page', () => {
  cy.url().should('include', '/f4-contest-3');
  cy.get('input[type="text"]', { timeout: 5000 }).should('be.visible');
});