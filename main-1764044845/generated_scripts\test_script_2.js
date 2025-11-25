## cypress/e2e/pages/LoginPage.js
```javascript
export class LoginPage {
  visit() {
    cy.visit('?route=account/login');
  }

  getEmailInput() {
    return cy.get('#input-email');
  }

  getPasswordInput() {
    return cy.get('#input-password');
  }

  getLoginButton() {
    return cy.get('input[value="Login"]');
  }

  getForgotPasswordLink() {
    return cy.get('a[href*="forgotten"]');
  }

  getRegisterLink() {
    return cy.get('a[href*="register"]');
  }

  getErrorMessage() {
    return cy.get('.alert-danger');
  }

  login(email, password) {
    this.getEmailInput().type(email);
    this.getPasswordInput().type(password);
    this.getLoginButton().click();
  }
}
```

## cypress/e2e/pages/AccountPage.js
```javascript
export class AccountPage {
  visit() {
    cy.visit('?route=account/account');
  }

  getAccountHeader() {
    return cy.get('h2').contains('My Account');
  }

  getLogoutLink() {
    return cy.get('a[href*="logout"]');
  }

  getEditAccountLink() {
    return cy.get('a[href*="account/edit"]');
  }

  getPasswordChangeLink() {
    return cy.get('a[href*="account/password"]');
  }

  getOrderHistoryLink() {
    return cy.get('a[href*="account/order"]');
  }

  getWishListLink() {
    return cy.get('a[href*="account/wishlist"]');
  }

  logout() {
    this.getLogoutLink().click();
  }
}
```

## cypress/e2e/utils/LoginUtils.js
```javascript
export class LoginUtils {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static generateRandomEmail() {
    const timestamp = Date.now();
    return `test${timestamp}@example.com`;
  }

  static getTestCredentials() {
    return {
      validEmail: 'test@example.com',
      validPassword: 'password123',
      invalidEmail: 'invalid@email.com',
      invalidPassword: 'wrongpassword'
    };
  }
}
```

## cypress/e2e/tests/TC_01_login.cy.js
```javascript
import { LoginPage } from '../pages/LoginPage.js';
import { AccountPage } from '../pages/AccountPage.js';
import { LoginUtils } from '../utils/LoginUtils.js';

describe('TC_01 - User Login Functionality', () => {
  const loginPage = new LoginPage();
  const accountPage = new AccountPage();
  const credentials = LoginUtils.getTestCredentials();

  beforeEach(() => {
    loginPage.visit();
  });

  it('TC_01_001 - Should login successfully with valid credentials', () => {
    loginPage.login(credentials.validEmail, credentials.validPassword);
    accountPage.getAccountHeader().should('be.visible');
    cy.url().should('include', 'account');
  });

  it('TC_01_002 - Should show error for invalid email', () => {
    loginPage.login(credentials.invalidEmail, credentials.validPassword);
    loginPage.getErrorMessage().should('be.visible');
    loginPage.getErrorMessage().should('contain', 'Warning: No match for E-Mail Address and/or Password');
  });

  it('TC_01_003 - Should show error for invalid password', () => {
    loginPage.login(credentials.validEmail, credentials.invalidPassword);
    loginPage.getErrorMessage().should('be.visible');
  });

  it('TC_01_004 - Should show error for empty credentials', () => {
    loginPage.getLoginButton().click();
    loginPage.getErrorMessage().should('be.visible');
  });

  it('TC_01_005 - Should navigate to forgot password page', () => {
    loginPage.getForgotPasswordLink().click();
    cy.url().should('include', 'forgotten');
  });

  it('TC_01_006 - Should navigate to register page', () => {
    loginPage.getRegisterLink().click();
    cy.url().should('include', 'register');
  });

  it('TC_01_007 - Should logout successfully', () => {
    loginPage.login(credentials.validEmail, credentials.validPassword);
    accountPage.logout();
    cy.url().should('include', 'logout');
    cy.contains('Account Logout').should('be.visible');
  });
});
```
