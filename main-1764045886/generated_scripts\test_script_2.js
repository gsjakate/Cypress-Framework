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

## cypress/support/pages/CartPage.js
```javascript
class CartPage {
  visit() {
    cy.visit('/index.php?route=checkout/cart');
  }

  getCartItems() {
    return cy.get('.table-responsive tbody tr');
  }

  getCheckoutButton() {
    return cy.get('a').contains('Checkout');
  }

  getContinueShoppingButton() {
    return cy.get('a').contains('Continue Shopping');
  }

  getRemoveButton() {
    return cy.get('button[data-original-title="Remove"]');
  }

  getQuantityInput() {
    return cy.get('input[name*="quantity"]');
  }

  updateQuantity(quantity) {
    this.getQuantityInput().clear().type(quantity);
    cy.get('button[data-original-title="Update"]').click();
  }

  removeItem() {
    this.getRemoveButton().first().click();
  }
}

export default CartPage;
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

## cypress/e2e/TC_01.cy.js
```javascript
import HomePage from '../support/pages/HomePage';
import ProductPage from '../support/pages/ProductPage';
import LoginPage from '../support/pages/LoginPage';
import CartPage from '../support/pages/CartPage';
import ProductUtils from './utils/ProductUtils';
import TestDataUtils from './utils/TestDataUtils';

describe('TC_01', () => {
  const homePage = new HomePage();
  const productPage = new ProductPage();
  const loginPage = new LoginPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    cy.visit('/');
  });

  it('should verify home page loads successfully', () => {
    homePage.visit();
    cy.url().should('include', 'opencart');
    homePage.getSearchBox().should('be.visible');
  });

  it('should search for products', () => {
    const searchTerm = TestDataUtils.getProductSearchTerms()[0];
    homePage.visit();
    homePage.searchProduct(searchTerm);
    cy.url().should('include', 'search');
  });

  it('should add product to cart', () => {
    homePage.visit();
    homePage.searchProduct('iPhone');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    cy.get('.alert-success').should('contain', 'Success');
  });

  it('should login with valid credentials', () => {
    const credentials = TestDataUtils.getValidLoginCredentials();
    loginPage.visit();
    loginPage.login(credentials.email, credentials.password);
    cy.url().should('include', 'account');
  });

  it('should view cart contents', () => {
    homePage.visit();
    homePage.searchProduct('MacBook');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    cartPage.visit();
    cartPage.getCartItems().should('have.length.greaterThan', 0);
  });

  it('should update cart quantity', () => {
    homePage.visit();
    homePage.searchProduct('Canon');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    cartPage.visit();
    cartPage.updateQuantity('2');
    cartPage.getQuantityInput().should('have.value', '2');
  });

  it('should remove item from cart', () => {
    homePage.visit();
    homePage.searchProduct('Samsung');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    cartPage.visit();
    cartPage.removeItem();
    cy.get('.alert').should('contain', 'Success');
  });
});
```

## cypress.config.js
```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://naveenautomationlabs.com/opencart/index.php',
    setupNodeEvents(on, config) {
    },
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
});
```
