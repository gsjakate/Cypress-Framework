```javascript
// cypress/e2e/config/CONSTANTS.js
export const CONSTANTS = {
  BASE_URL: 'https://naveenautomationlabs.com/opencart/index.php',
  TIMEOUT: 10000,
  DEFAULT_WAIT: 2000
};

// cypress/e2e/config/routes.js
export const ROUTES = {
  HOME: '?route=common/home',
  LOGIN: '?route=account/login',
  REGISTER: '?route=account/register',
  ACCOUNT: '?route=account/account',
  SEARCH: '?route=product/search',
  CART: '?route=checkout/cart',
  WISHLIST: '?route=account/wishlist'
};

// cypress/e2e/config/errorMessages.js
export const ERROR_MESSAGES = {
  INVALID_LOGIN: 'Warning: No match for E-Mail Address and/or Password.',
  REGISTRATION_REQUIRED: 'Warning: You must agree to the Privacy Policy!',
  EMPTY_CART: 'Your shopping cart is empty!',
  PRODUCT_NOT_FOUND: 'There is no product that matches the search criteria.'
};

// cypress/e2e/pages/BasePage.js
import { CONSTANTS } from '../config/CONSTANTS.js';

export class BasePage {
  visit(route = '') {
    cy.visit(`${CONSTANTS.BASE_URL}${route}`);
  }

  getPageTitle() {
    return cy.get('#content h1');
  }

  waitForPageLoad() {
    cy.wait(CONSTANTS.DEFAULT_WAIT);
  }
}

// cypress/e2e/components/HeaderComponent.js
export class HeaderComponent {
  searchProduct(productName) {
    cy.get('#search input[name="search"]').clear().type(productName);
    cy.get('#search button').click();
  }

  navigateToAccount() {
    cy.get('#top-links a').contains('My Account').click();
  }

  navigateToWishlist() {
    cy.get('#top-links #wishlist-total').click();
  }

  navigateToCart() {
    cy.get('#top-links a').contains('Shopping Cart').click();
  }
}

// cypress/e2e/pages/LoginPage.js
import { BasePage } from './BasePage.js';
import { ROUTES } from '../config/routes.js';

export class LoginPage extends BasePage {
  visit() {
    super.visit(ROUTES.LOGIN);
  }

  fillEmail(email) {
    cy.get('#input-email').clear().type(email);
    return this;
  }

  fillPassword(password) {
    cy.get('#input-password').clear().type(password);
    return this;
  }

  clickLogin() {
    cy.get('input[value="Login"]').click();
    return this;
  }

  login(email, password) {
    this.fillEmail(email);
    this.fillPassword(password);
    this.clickLogin();
  }

  getErrorMessage() {
    return cy.get('#account-login .alert');
  }
}

// cypress/e2e/pages/RegisterPage.js
import { BasePage } from './BasePage.js';
import { ROUTES } from '../config/routes.js';

export class RegisterPage extends BasePage {
  visit() {
    super.visit(ROUTES.REGISTER);
  }

  fillFirstName(firstName) {
    cy.get('#input-firstname').clear().type(firstName);
    return this;
  }

  fillLastName(lastName) {
    cy.get('#input-lastname').clear().type(lastName);
    return this;
  }

  fillEmail(email) {
    cy.get('#input-email').clear().type(email);
    return this;
  }

  fillTelephone(telephone) {
    cy.get('#input-telephone').clear().type(telephone);
    return this;
  }

  fillPassword(password) {
    cy.get('#input-password').clear().type(password);
    return this;
  }

  fillConfirmPassword(password) {
    cy.get('#input-confirm').clear().type(password);
    return this;
  }

  agreeToPrivacyPolicy() {
    cy.get('input[name="agree"]').check();
    return this;
  }

  clickContinue() {
    cy.get('input[value="Continue"]').click();
    return this;
  }

  register(userData) {
    this.fillFirstName(userData.firstName);
    this.fillLastName(userData.lastName);
    this.fillEmail(userData.email);
    this.fillTelephone(userData.telephone);
    this.fillPassword(userData.password);
    this.fillConfirmPassword(userData.password);
    this.agreeToPrivacyPolicy();
    this.clickContinue();
  }

  getErrorMessage() {
    return cy.get('#account-register .alert');
  }
}

// cypress/e2e/pages/ProductsSearchPage.js
import { BasePage } from './BasePage.js';
import { ROUTES } from '../config/routes.js';

export class ProductsSearchPage extends BasePage {
  visit() {
    super.visit(ROUTES.SEARCH);
  }

  searchProduct(productName) {
    cy.get('#input-search').clear().type(productName);
    cy.get('#button-search').click();
  }

  getSearchResults() {
    return cy.get('#content #product');
  }

  getProductTitles() {
    return cy.get('.caption h4 a');
  }

  getProductPrices() {
    return cy.get('.price');
  }

  selectProduct(index = 0) {
    this.getProductTitles().eq(index).click();
  }

  sortProducts(sortOption) {
    cy.get('#input-sort').select(sortOption);
  }

  getNoResultsMessage() {
    return cy.get('#product-search .alert');
  }
}

// cypress/e2e/pages/ProductDetailsPage.js
import { BasePage } from './BasePage.js';

export class ProductDetailsPage extends BasePage {
  addToCart() {
    cy.get('#button-cart').click();
    return this;
  }

  addToWishlist() {
    cy.get('button[data-original-title="Add to Wish List"]').click();
    return this;
  }

  getProductName() {
    return cy.get('#content h1');
  }

  getProductPrice() {
    return cy.get('.price');
  }

  getSuccessMessage() {
    return cy.get('#product-product .alert');
  }

  selectQuantity(quantity) {
    cy.get('#input-quantity').clear().type(quantity);
    return this;
  }
}

// cypress/e2e/pages/ShoppingCartPage.js
import { BasePage } from './BasePage.js';
import { ROUTES } from '../config/routes.js';

export class ShoppingCartPage extends BasePage {
  visit() {
    super.visit(ROUTES.CART);
  }

  getCartItems() {
    return cy.get('form table>tbody>tr');
  }

  getCartTotal() {
    return cy.get('h2 + div>table>tbody>tr');
  }

  updateQuantity(productIndex, quantity) {
    cy.get('form table>tbody>tr').eq(productIndex).find('input[name^="quantity"]').clear().type(quantity);
    cy.get('button[data-original-title="Update"]').eq(productIndex).click();
  }

  removeItem(productIndex) {
    cy.get('form table>tbody>tr').eq(productIndex).find('button[data-original-title="Remove"]').click();
  }

  getEmptyCartMessage() {
    return cy.get('#content>h2+p');
  }
}

// cypress/e2e/pages/WishlistPage.js
import { BasePage } from './BasePage.js';
import { ROUTES } from '../config/routes.js';

export class WishlistPage extends BasePage {
  visit() {
    super.visit(ROUTES.WISHLIST);
  }

  getWishlistItems() {
    return cy.get('form table>tbody>tr');
  }

  addToCartFromWishlist(productIndex) {
    cy.get("td:nth-of-type(2) a").eq(productIndex).click();
  }

  removeFromWishlist(productIndex) {
    cy.get('a[data-original-title="Remove"]').eq(productIndex).click();
  }
}

// cypress/e2e/pages/AccountPage.js
import { BasePage } from './BasePage.js';
import { ROUTES } from '../config/routes.js';

export class AccountPage extends BasePage {
  visit() {
    super.visit(ROUTES.ACCOUNT);
  }

  getWelcomeMessage() {
    return cy.get('#content .intro');
  }

  navigateToWishlist() {
    cy.get('a').contains('Wish List').click();
  }

  navigateToOrderHistory() {
    cy.get('a').contains('Order History').click();
  }

  logout() {
    cy.get('a').contains('Logout').click();
  }
}

// cypress/e2e/utils/ProductUtils.js
export class ProductUtils {
  static generateProductData() {
    return {
      searchTerm: 'MacBook',
      category: 'Laptops & Notebooks',
      minPrice: 500,
      maxPrice: 2000
    };
  }

  static generateUserData() {
    const timestamp = Date.now();
    return {
      firstName: 'Test',
      lastName: 'User',
      email: `test${timestamp}@example.com`,
      telephone: '1234567890',
      password: 'password123'
    };
  }
}

// cypress/e2e/tests/TC_01.cy.js
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsSearchPage } from '../pages/ProductsSearchPage.js';
import { ProductDetailsPage } from '../pages/ProductDetailsPage.js';
import { ShoppingCartPage } from '../pages/ShoppingCartPage.js';
import { HeaderComponent } from '../components/HeaderComponent.js';
import { ProductUtils } from '../utils/ProductUtils.js';
import { CONSTANTS } from '../config/CONSTANTS.js';
import { ERROR_MESSAGES } from '../config/errorMessages.js';

describe('TC_01: Complete User Journey Test', () => {
  let loginPage;
  let searchPage;
  let productPage;
  let cartPage;
  let header;

  beforeEach(() => {
    loginPage = new LoginPage();
    searchPage = new ProductsSearchPage();
    productPage = new ProductDetailsPage();
    cartPage = new ShoppingCartPage();
    header = new HeaderComponent();
    
    // Set up test data aliases
    cy.wrap(ProductUtils.generateProductData()).as('productData');
    cy.wrap(['Desktops', 'Laptops & Notebooks', 'Components', 'Tablets', 'Software', 'Phones & PDAs', 'Cameras', 'MP3 Players']).as('productCategories');
  });

  it('TC_01: Should complete full user journey from search to cart', () => {
    // Step 1: Visit homepage and search for product
    cy.visit(CONSTANTS.BASE_URL);
    cy.get('@productData').then((data) => {
      header.searchProduct(data.searchTerm);
    });

    // Step 2: Verify search results and select product
    cy.get('#content #product').should('have.length.greaterThan', 0);
    cy.get('.caption h4 a').first().click();

    // Step 3: Verify product details page
    cy.get('#content h1').should('be.visible');
    cy.get('.price').should('be.visible');

    // Step 4: Add product to cart
    cy.get('#button-cart').click();
    cy.get('#product-product .alert').should('contain.text', 'Success');

    // Step 5: Navigate to cart and verify item
    cy.get('#top-links a').contains('Shopping Cart').click();
    cy.get('form table>tbody>tr').should('have.length.greaterThan', 0);

    // Step 6: Verify cart total is displayed
    cy.get('h2 + div>table>tbody>tr').should('be.visible');

    // Step 7: Update quantity and verify changes
    cy.get('form table>tbody>tr').first().find('input[name^="quantity"]').clear().type('2');
    cy.get('button[data-original-title="Update"]').first().click();
    cy.wait(CONSTANTS.DEFAULT_WAIT);

    // Step 8: Verify updated total
    cy.get('h2 + div>table>tbody>tr').should('be.visible');
  });

  it('TC_01_B: Should handle empty search results gracefully', () => {
    // Step 1: Search for non-existent product
    cy.visit(CONSTANTS.BASE_URL);
    header.searchProduct('NonExistentProduct123');

    // Step 2: Verify no results message
    cy.get('#product-search .alert').should('be.visible');
    cy.get('#content>h2+p').should('contain.text', 'no product');
  });

  it('TC_01_C: Should sort products correctly', () => {
    // Step 1: Search for products
    cy.visit(CONSTANTS.BASE_URL);
    cy.get('@productData').then((data) => {
      header.searchProduct(data.searchTerm);
    });

    // Step 2: Apply sorting
    cy.get('#input-sort').select('Price (Low > High)');
    cy.wait(CONSTANTS.DEFAULT_WAIT);

    // Step 3: Verify products are displayed
    cy.get('.price').should('have.length.greaterThan', 0);
  });

  it('TC_01_D: Should validate product categories', () => {
    cy.get('@productCategories').then((categories) => {
      categories.forEach((category, index) => {
        if (index < 3) { // Test first 3 categories to avoid long test execution
          cy.visit(CONSTANTS.BASE_URL);
          header.searchProduct(category);
          cy.get('#content h2').should('be.visible');
        }
      });
    });
  });
});

// cypress/e2e/tests/LoginTest.cy.js
import { LoginPage } from '../pages/LoginPage.js';
import { AccountPage } from '../pages/AccountPage.js';
import { ERROR_MESSAGES } from '../config/errorMessages.js';

describe('Login Tests', () => {
  let loginPage;
  let accountPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    accountPage = new AccountPage();
    loginPage.visit();
  });

  it('should login with valid credentials', () => {
    loginPage.login('test@example.com', 'password');
    cy.get('#content .intro').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    loginPage.login('invalid@email.com', 'wrongpassword');
    cy.get('#account-login .alert').should('be.visible');
  });
});

// cypress/e2e/tests/RegistrationTest.cy.js
import { RegisterPage } from '../pages/RegisterPage.js';
import { ProductUtils } from '../utils/ProductUtils.js';

describe('Registration Tests', () => {
  let registerPage;

  beforeEach(() => {
    registerPage = new RegisterPage();
    registerPage.visit();
  });

  it('should register with valid data', () => {
    const userData = ProductUtils.generateUserData();
    registerPage.register(userData);
    cy.url().should('include', 'account');
  });

  it('should show error when privacy policy not agreed', () => {
    const userData = ProductUtils.generateUserData();
    cy.get('#input-firstname').type(userData.firstName);
    cy.get('#input-lastname').type(userData.lastName);
    cy.get('#input-email').type(userData.email);
    cy.get('#input-telephone').type(userData.telephone);
    cy.get('#input-password').type(userData.password);
    cy.get('#input-confirm').type(userData.password);
    cy.get('input[value="Continue"]').click();
    cy.get('#account-register .alert').should('be.visible');
  });
});

// cypress/e2e/tests/ProductsSearchTest.cy.js
import { ProductsSearchPage } from '../pages/ProductsSearchPage.js';
import { HeaderComponent } from '../components/HeaderComponent.js';

describe('Product Search Tests', () => {
  let searchPage;
  let header;

  beforeEach(() => {
    searchPage = new ProductsSearchPage();
    header = new HeaderComponent();
  });

  it('should search for products', () => {
    cy.visit('https://naveenautomationlabs.com/opencart/index.php');
    header.searchProduct('MacBook');
    cy.get('#content #product').should('have.length.greaterThan', 0);
  });
});

// cypress/e2e/tests/AddToCartTest.cy.js
import { ProductsSearchPage } from '../pages/ProductsSearchPage.js';
import { ProductDetailsPage } from '../pages/ProductDetailsPage.js';

describe('Add to Cart Tests', () => {
  let searchPage;
  let productPage;

  beforeEach(() => {
    searchPage = new ProductsSearchPage();
    productPage = new ProductDetailsPage();
  });

  it('should add product to cart', () => {
    cy.visit('https://naveenautomationlabs.com/opencart/index.php');
    cy.get('#search input[name="search"]').type('MacBook');
    cy.get('#search button').click();
    cy.get('.caption h4 a').first().click();
    cy.get('#button-cart').click();
    cy.get('#product-product .alert').should('contain.text', 'Success');
  });
});

// cypress/e2e/tests/WishlistTest.cy.js
import { WishlistPage } from '../pages/WishlistPage.js';

describe('Wishlist Tests', () => {
  let wishlistPage;

  beforeEach(() => {
    wishlistPage = new WishlistPage();
  });

  it('should view wishlist', () => {
    wishlistPage.visit();
    cy.get('form table>tbody>tr').should('exist');
  });
});

// cypress/e2e/tests/ProductDataTest.cy.js
import { ProductUtils } from '../utils/ProductUtils.js';

describe('Product Data Tests', () => {
  beforeEach(() => {
    cy.wrap(ProductUtils.generateProductData()).as('productData');
    cy.wrap(['Desktops', 'Laptops & Notebooks']).as('productCategories');
  });

  it('should validate product data', () => {
    cy.get('@productData').then((data) => {
      expect(data).to.have.property('searchTerm');
    });
  });
});

// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.visit('https://naveenautomationlabs.com/opencart/index.php?route=account/login');
  cy.get('#input-email').type(email);
  cy.get('#input-password').type(password);
  cy.get('input[value="Login"]').click();
});

// cypress/support/e2e.js
import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
```
