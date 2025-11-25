## cypress/support/pages/HomePage.js
```javascript
class HomePage {
  visit() {
    cy.visit('/');
  }

  getSearchBox() {
    return cy.get('input[name="search"]');
  }

  getSearchButton() {
    return cy.get('button[class*="btn-default"]').contains('Search');
  }

  getCartButton() {
    return cy.get('#cart');
  }

  getMyAccountDropdown() {
    return cy.get('.dropdown').contains('My Account');
  }

  getLoginLink() {
    return cy.get('a').contains('Login');
  }

  getRegisterLink() {
    return cy.get('a').contains('Register');
  }

  searchProduct(productName) {
    this.getSearchBox().type(productName);
    this.getSearchButton().click();
  }
}

export default HomePage;
```

## cypress/support/pages/ProductPage.js
```javascript
class ProductPage {
  getProductTitle() {
    return cy.get('h1');
  }

  getAddToCartButton() {
    return cy.get('#button-cart');
  }

  getQuantityInput() {
    return cy.get('#input-quantity');
  }

  getProductPrice() {
    return cy.get('.price');
  }

  getProductImages() {
    return cy.get('.thumbnails img');
  }

  addToCart(quantity = 1) {
    if (quantity > 1) {
      this.getQuantityInput().clear().type(quantity);
    }
    this.getAddToCartButton().click();
  }
}

export default ProductPage;
```

## cypress/support/pages/LoginPage.js
```javascript
class LoginPage {
  visit() {
    cy.visit('/index.php?route=account/login');
  }

  getEmailInput() {
    return cy.get('#input-email');
  }

  getPasswordInput() {
    return cy.get('#input-password');
  }

  getLoginButton() {
    return cy.get('input[type="submit"][value="Login"]');
  }

  getForgotPasswordLink() {
    return cy.get('a').contains('Forgotten Password');
  }

  login(email, password) {
    this.getEmailInput().type(email);
    this.getPasswordInput().type(password);
    this.getLoginButton().click();
  }
}

export default LoginPage;
```

## cypress/support/pages/RegisterPage.js
```javascript
class RegisterPage {
  visit() {
    cy.visit('/index.php?route=account/register');
  }

  getFirstNameInput() {
    return cy.get('#input-firstname');
  }

  getLastNameInput() {
    return cy.get('#input-lastname');
  }

  getEmailInput() {
    return cy.get('#input-email');
  }

  getTelephoneInput() {
    return cy.get('#input-telephone');
  }

  getPasswordInput() {
    return cy.get('#input-password');
  }

  getConfirmPasswordInput() {
    return cy.get('#input-confirm');
  }

  getNewsletterYes() {
    return cy.get('input[name="newsletter"][value="1"]');
  }

  getNewsletterNo() {
    return cy.get('input[name="newsletter"][value="0"]');
  }

  getPrivacyPolicyCheckbox() {
    return cy.get('input[name="agree"]');
  }

  getContinueButton() {
    return cy.get('input[type="submit"][value="Continue"]');
  }

  register(userData) {
    this.getFirstNameInput().type(userData.firstName);
    this.getLastNameInput().type(userData.lastName);
    this.getEmailInput().type(userData.email);
    this.getTelephoneInput().type(userData.telephone);
    this.getPasswordInput().type(userData.password);
    this.getConfirmPasswordInput().type(userData.password);
    this.getPrivacyPolicyCheckbox().check();
    this.getContinueButton().click();
  }
}

export default RegisterPage;
```

## cypress/e2e/utils/TestDataUtils.js
```javascript
class TestDataUtils {
  static getTestUser() {
    return {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'Test123!',
      telephone: '1234567890'
    };
  }

  static getValidLoginCredentials() {
    return {
      email: 'test@example.com',
      password: 'password123'
    };
  }

  static getProductSearchTerms() {
    return ['iPhone', 'MacBook', 'Canon', 'Samsung'];
  }
}

export default TestDataUtils;
```

## cypress/e2e/TC_02.cy.js
```javascript
import HomePage from '../support/pages/HomePage';
import RegisterPage from '../support/pages/RegisterPage';
import LoginPage from '../support/pages/LoginPage';
import ProductUtils from './utils/ProductUtils';
import TestDataUtils from './utils/TestDataUtils';

describe('TC_02 - User Registration Tests', () => {
  const homePage = new HomePage();
  const registerPage = new RegisterPage();
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.visit('/');
  });

  it('should register a new user successfully', () => {
    const userData = TestDataUtils.getTestUser();
    
    homePage.getMyAccountDropdown().click();
    homePage.getRegisterLink().click();
    
    registerPage.register(userData);
    
    cy.url().should('include', 'success');
    cy.get('h1').should('contain', 'Account Created');
  });

  it('should validate required fields on registration form', () => {
    homePage.getMyAccountDropdown().click();
    homePage.getRegisterLink().click();
    
    registerPage.getContinueButton().click();
    
    cy.get('.text-danger').should('be.visible');
    cy.get('#input-firstname').should('have.class', 'is-invalid').or('have.attr', 'required');
  });

  it('should validate email format', () => {
    const userData = TestDataUtils.getTestUser();
    userData.email = 'invalid-email';
    
    homePage.getMyAccountDropdown().click();
    homePage.getRegisterLink().click();
    
    registerPage.getFirstNameInput().type(userData.firstName);
    registerPage.getLastNameInput().type(userData.lastName);
    registerPage.getEmailInput().type(userData.email);
    registerPage.getTelephoneInput().type(userData.telephone);
    registerPage.getPasswordInput().type(userData.password);
    registerPage.getConfirmPasswordInput().type(userData.password);
    registerPage.getPrivacyPolicyCheckbox().check();
    registerPage.getContinueButton().click();
    
    cy.get('.text-danger').should('contain', 'E-Mail Address does not appear to be valid');
  });

  it('should validate password confirmation', () => {
    const userData = TestDataUtils.getTestUser();
    
    homePage.getMyAccountDropdown().click();
    homePage.getRegisterLink().click();
    
    registerPage.getFirstNameInput().type(userData.firstName);
    registerPage.getLastNameInput().type(userData.lastName);
    registerPage.getEmailInput().type(userData.email);
    registerPage.getTelephoneInput().type(userData.telephone);
    registerPage.getPasswordInput().type(userData.password);
    registerPage.getConfirmPasswordInput().type('DifferentPassword123!');
    registerPage.getPrivacyPolicyCheckbox().check();
    registerPage.getContinueButton().click();
    
    cy.get('.text-danger').should('contain', 'Password confirmation does not match password');
  });

  it('should require privacy policy acceptance', () => {
    const userData = TestDataUtils.getTestUser();
    
    homePage.getMyAccountDropdown().click();
    homePage.getRegisterLink().click();
    
    registerPage.getFirstNameInput().type(userData.firstName);
    registerPage.getLastNameInput().type(userData.lastName);
    registerPage.getEmailInput().type(userData.email);
    registerPage.getTelephoneInput().type(userData.telephone);
    registerPage.getPasswordInput().type(userData.password);
    registerPage.getConfirmPasswordInput().type(userData.password);
    registerPage.getContinueButton().click();
    
    cy.get('.alert-danger').should('contain', 'Warning: You must agree to the Privacy Policy');
  });

  it('should navigate to login page from register page', () => {
    homePage.getMyAccountDropdown().click();
    homePage.getRegisterLink().click();
    
    cy.get('a').contains('login page').click();
    
    cy.url().should('include', 'account/login');
    cy.get('h2').should('contain', 'Returning Customer');
  });

  it('should register with newsletter subscription', () => {
    const userData = TestDataUtils.getTestUser();
    
    homePage.getMyAccountDropdown().click();
    homePage.getRegisterLink().click();
    
    registerPage.getFirstNameInput().type(userData.firstName);
    registerPage.getLastNameInput().type(userData.lastName);
    registerPage.getEmailInput().type(userData.email);
    registerPage.getTelephoneInput().type(userData.telephone);
    registerPage.getPasswordInput().type(userData.password);
    registerPage.getConfirmPasswordInput().type(userData.password);
    registerPage.getNewsletterYes().check();
    registerPage.getPrivacyPolicyCheckbox().check();
    registerPage.getContinueButton().click();
    
    cy.url().should('include', 'success');
  });
});
```
