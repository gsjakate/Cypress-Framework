## cypress/e2e/tests/TC_04.cy.js
```javascript
import '../support/commands';

describe('TC_04 - User Login and Account Management Test', () => {
  
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to login page', () => {
    cy.get('.dropdown-toggle').contains('My Account').click();
    cy.get('a[href*="login"]').click();
    cy.url().should('include', 'login');
    cy.get('h2').should('contain.text', 'Returning Customer');
  });

  it('should login with valid credentials', () => {
    cy.get('.dropdown-toggle').contains('My Account').click();
    cy.get('a[href*="login"]').click();
    cy.get('#input-email').type('test@example.com');
    cy.get('#input-password').type('password123');
    cy.get('input[type="submit"][value="Login"]').click();
    cy.url().should('include', 'account/account');
  });

  it('should show error for invalid credentials', () => {
    cy.get('.dropdown-toggle').contains('My Account').click();
    cy.get('a[href*="login"]').click();
    cy.get('#input-email').type('invalid@example.com');
    cy.get('#input-password').type('wrongpassword');
    cy.get('input[type="submit"][value="Login"]').click();
    cy.get('.alert-danger').should('contain.text', 'Warning');
  });

  it('should access account dashboard after login', () => {
    cy.get('.dropdown-toggle').contains('My Account').click();
    cy.get('a[href*="login"]').click();
    cy.get('#input-email').type('test@example.com');
    cy.get('#input-password').type('password123');
    cy.get('input[type="submit"][value="Login"]').click();
    cy.get('h2').should('contain.text', 'My Account');
    cy.get('a[href*="account/edit"]').should('be.visible');
  });

  it('should logout successfully', () => {
    cy.get('.dropdown-toggle').contains('My Account').click();
    cy.get('a[href*="login"]').click();
    cy.get('#input-email').type('test@example.com');
    cy.get('#input-password').type('password123');
    cy.get('input[type="submit"][value="Login"]').click();
    cy.get('.dropdown-toggle').contains('My Account').click();
    cy.get('a[href*="logout"]').click();
    cy.url().should('include', 'logout');
  });

});
```

## cypress/e2e/pages/LoginPage.js
```javascript
class LoginPage {
  elements = {
    emailInput: () => cy.get('#input-email'),
    passwordInput: () => cy.get('#input-password'),
    loginButton: () => cy.get('input[type="submit"][value="Login"]'),
    forgotPasswordLink: () => cy.get('a[href*="forgotten"]'),
    newCustomerButton: () => cy.get('a[href*="register"]').contains('Continue'),
    errorAlert: () => cy.get('.alert-danger'),
    returningCustomerHeader: () => cy.get('h2').contains('Returning Customer'),
    newCustomerHeader: () => cy.get('h2').contains('New Customer')
  }

  visit() {
    cy.visit('/index.php?route=account/login');
  }

  login(email, password) {
    this.elements.emailInput().clear().type(email);
    this.elements.passwordInput().clear().type(password);
    this.elements.loginButton().click();
  }

  verifyLoginPage() {
    this.elements.returningCustomerHeader().should('be.visible');
    this.elements.emailInput().should('be.visible');
    this.elements.passwordInput().should('be.visible');
  }

  verifyLoginError() {
    this.elements.errorAlert().should('contain.text', 'Warning');
  }

  clickForgotPassword() {
    this.elements.forgotPasswordLink().click();
  }

  clickNewCustomer() {
    this.elements.newCustomerButton().click();
  }
}

export default LoginPage;
```

## cypress/e2e/pages/AccountPage.js
```javascript
class AccountPage {
  elements = {
    myAccountHeader: () => cy.get('h2').contains('My Account'),
    editAccountLink: () => cy.get('a[href*="account/edit"]'),
    changePasswordLink: () => cy.get('a[href*="account/password"]'),
    addressBookLink: () => cy.get('a[href*="account/address"]'),
    wishListLink: () => cy.get('a[href*="account/wishlist"]'),
    orderHistoryLink: () => cy.get('a[href*="account/order"]'),
    downloadsLink: () => cy.get('a[href*="account/download"]'),
    rewardPointsLink: () => cy.get('a[href*="account/reward"]'),
    returnsLink: () => cy.get('a[href*="account/return"]'),
    transactionsLink: () => cy.get('a[href*="account/transaction"]'),
    newsletterLink: () => cy.get('a[href*="account/newsletter"]'),
    logoutLink: () => cy.get('a[href*="logout"]'),
    myAccountDropdown: () => cy.get('.dropdown-toggle').contains('My Account')
  }

  verifyAccountDashboard() {
    this.elements.myAccountHeader().should('be.visible');
    this.elements.editAccountLink().should('be.visible');
    this.elements.orderHistoryLink().should('be.visible');
  }

  editAccount() {
    this.elements.editAccountLink().click();
  }

  changePassword() {
    this.elements.changePasswordLink().click();
  }

  viewAddressBook() {
    this.elements.addressBookLink().click();
  }

  viewWishList() {
    this.elements.wishListLink().click();
  }

  viewOrderHistory() {
    this.elements.orderHistoryLink().click();
  }

  logout() {
    this.elements.myAccountDropdown().click();
    this.elements.logoutLink().click();
  }

  verifyLogout() {
    cy.url().should('include', 'logout');
    cy.get('h1').should('contain.text', 'Account Logout');
  }
}

export default AccountPage;
```

## cypress/e2e/pages/NavigationPage.js
```javascript
class NavigationPage {
  elements = {
    myAccountDropdown: () => cy.get('.dropdown-toggle').contains('My Account'),
    loginLink: () => cy.get('a[href*="login"]'),
    registerLink: () => cy.get('a[href*="register"]'),
    logoutLink: () => cy.get('a[href*="logout"]'),
    wishListLink: () => cy.get('#wishlist-total'),
    shoppingCartLink: () => cy.get('#cart'),
    checkoutLink: () => cy.get('a[href*="checkout"]'),
    homeLink: () => cy.get('a').contains('Home'),
    logo: () => cy.get('#logo')
  }

  goToLogin() {
    this.elements.myAccountDropdown().click();
    this.elements.loginLink().click();
  }

  goToRegister() {
    this.elements.myAccountDropdown().click();
    this.elements.registerLink().click();
  }

  logout() {
    this.elements.myAccountDropdown().click();
    this.elements.logoutLink().click();
  }

  goToWishList() {
    this.elements.wishListLink().click();
  }

  goToCart() {
    this.elements.shoppingCartLink().click();
  }

  goToCheckout() {
    this.elements.checkoutLink().click();
  }

  goHome() {
    this.elements.logo().click();
  }
}

export default NavigationPage;
```

## cypress/e2e/utils/AuthUtils.js
```javascript
export class AuthUtils {
  static getValidCredentials() {
    return {
      email: 'test@example.com',
      password: 'password123'
    };
  }

  static getInvalidCredentials() {
    return {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    };
  }

  static getTestUser() {
    return {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      telephone: '1234567890',
      password: 'testpassword123'
    };
  }

  static loginViaUI(email, password) {
    cy.get('.dropdown-toggle').contains('My Account').click();
    cy.get('a[href*="login"]').click();
    cy.get('#input-email').type(email);
    cy.get('#input-password').type(password);
    cy.get('input[type="submit"][value="Login"]').click();
  }

  static verifyLoggedIn() {
    cy.get('.dropdown-toggle').contains('My Account').click();
    cy.get('a[href*="logout"]').should('be.visible');
  }

  static verifyLoggedOut() {
    cy.get('.dropdown-toggle').contains('My Account').click();
    cy.get('a[href*="login"]').should('be.visible');
  }
}
```
