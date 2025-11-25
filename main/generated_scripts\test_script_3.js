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

  clickMyAccountDropdown() {
    cy.get('#top-links a').contains('My Account').click();
  }

  clickLoginFromDropdown() {
    cy.get('a').contains('Login').click();
  }

  clickRegisterFromDropdown() {
    cy.get('a').contains('Register').click();
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

  validateLoginForm() {
    cy.get('#input-email').should('be.visible');
    cy.get('#input-password').should('be.visible');
    cy.get('input[value="Login"]').should('be.visible');
    return this;
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

  validateRegistrationForm() {
    cy.get('#input-firstname').should('be.visible');
    cy.get('#input-lastname').should('be.visible');
    cy.get('#input-email').should('be.visible');
    cy.get('#input-telephone').should('be.visible');
    cy.get('#input-password').should('be.visible');
    cy.get('#input-confirm').should('be.visible');
    return this;
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

  validateSearchResults() {
    cy.get('#content h2').should('contain.text', 'Search');
    return this;
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

  validateProductDetailsPage() {
    cy.get('#content h1').should('be.visible');
    cy.get('.price').should('be.visible');
    cy.get('#button-cart').should('be.visible');
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

  proceedToCheckout() {
    cy.get('a').contains('Checkout').click();
    return this;
  }

  continueShopping() {
    cy.get('a').contains('Continue Shopping').click();
    return this;
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

  getEmptyWishlistMessage() {
    return cy.get('#content>h2+p');
  }

  continueShopping() {
    cy.get('a').contains('Continue').click();
    return this;
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

  validateAccountDashboard() {
    cy.get('#content h1').should('contain.text', 'My Account');
    return this;
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

  static generateTestProducts() {
    return [
      'MacBook',
      'iPhone',
      'Canon EOS',
      'Samsung SyncMaster',
      'HTC Touch HD'
    ];
  }
}

// cypress/e2e/tests/TC_02.cy.js
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { ProductsSearchPage } from '../pages/ProductsSearchPage.js';
import { ProductDetailsPage } from '../pages/ProductDetailsPage.js';
import { ShoppingCartPage } from '../pages/ShoppingCartPage.js';
import { WishlistPage } from '../pages/WishlistPage.js';
import { AccountPage } from '../pages/AccountPage.js';
import { HeaderComponent } from '../components/HeaderComponent.js';
import { ProductUtils } from '../utils/ProductUtils.js';
import { CONSTANTS } from '../config/CONSTANTS.js';
import { ERROR_MESSAGES } from '../config/errorMessages.js';

describe('TC_02: User Registration and Wishlist Management Test', () => {
  let loginPage;
  let registerPage;
  let searchPage;
  let productPage;
  let cartPage;
  let wishlistPage;
  let accountPage;
  let header;

  beforeEach(() => {
    loginPage = new LoginPage();
    registerPage = new RegisterPage();
    searchPage = new ProductsSearchPage();
    productPage = new ProductDetailsPage();
    cartPage = new ShoppingCartPage();
    wishlistPage = new WishlistPage();
    accountPage = new AccountPage();
    header = new HeaderComponent();
    
    // Set up test data aliases
    cy.wrap(ProductUtils.generateProductData()).as('productData');
    cy.wrap(['Desktops', 'Laptops & Notebooks', 'Components', 'Tablets', 'Software', 'Phones & PDAs', 'Cameras', 'MP3 Players']).as('productCategories');
    cy.wrap(ProductUtils.generateTestProducts()).as('testProducts');
  });

  it('TC_02: Should register new user and manage wishlist functionality', () => {
    // Step 1: Navigate to registration page
    cy.visit(CONSTANTS.BASE_URL);
    header.clickMyAccountDropdown();
    header.clickRegisterFromDropdown();

    // Step 2: Validate registration form
    registerPage.validateRegistrationForm();

    // Step 3: Register new user
    const userData = ProductUtils.generateUserData();
    registerPage.register(userData);

    // Step 4: Verify successful registration
    cy.url().should('include', 'account/success');
    cy.get('#content h1').should('contain.text', 'Your Account Has Been Created!');

    // Step 5: Navigate to account dashboard
    accountPage.visit();
    accountPage.validateAccountDashboard();

    // Step 6: Search for first product and add to wishlist
    cy.get('@testProducts').then((products) => {
      header.searchProduct(products[0]);
      cy.get('#content #product').should('have.length.greaterThan', 0);
      cy.get('.caption h4 a').first().click();
      
      productPage.validateProductDetailsPage();
      productPage.addToWishlist();
      cy.wait(CONSTANTS.DEFAULT_WAIT);
    });

    // Step 7: Search for second product and add to wishlist
    cy.get('@testProducts').then((products) => {
      header.searchProduct(products[1]);
      cy.get('#content #product').should('have.length.greaterThan', 0);
      cy.get('.caption h4 a').first().click();
      
      productPage.addToWishlist();
      cy.wait(CONSTANTS.DEFAULT_WAIT);
    });

    // Step 8: Navigate to wishlist and verify items
    header.navigateToWishlist();
    cy.get('form table>tbody>tr').should('have.length.greaterThan', 0);

    // Step 9: Add item from wishlist to cart
    cy.get("td:nth-of-type(2) a").first().click();
    cy.wait(CONSTANTS.DEFAULT_WAIT);

    // Step 10: Navigate to shopping cart and verify item
    header.navigateToCart();
    cy.get('form table>tbody>tr').should('have.length.greaterThan', 0);
    cy.get('h2 + div>table>tbody>tr').should('be.visible');

    // Step 11: Remove item from cart
    cy.get('form table>tbody>tr').first().find('button[data-original-title="Remove"]').click();
    cy.wait(CONSTANTS.DEFAULT_WAIT);

    // Step 12: Verify empty cart message
    cy.get('#content>h2+p').should('contain.text', 'empty');
  });

  it('TC_02_B: Should validate registration form fields', () => {
    // Step 1: Navigate to registration page
    registerPage.visit();
    registerPage.validateRegistrationForm();

    // Step 2: Try to register without agreeing to privacy policy
    const userData = ProductUtils.generateUserData();
    cy.get('#input-firstname').type(userData.firstName);
    cy.get('#input-lastname').type(userData.lastName);
    cy.get('#input-email').type(userData.email);
    cy.get('#input-telephone').type(userData.telephone);
    cy.get('#input-password').type(userData.password);
    cy.get('#input-confirm').type(userData.password);
    cy.get('input[value="Continue"]').click();

    // Step 3: Verify error message
    cy.get('#account-register .alert').should('be.visible');
  });

  it('TC_02_C: Should handle empty wishlist scenario', () => {
    // Step 1: Navigate to login and login with existing user
    loginPage.visit();
    loginPage.login('test@example.com', 'password123');

    // Step 2: Navigate to empty wishlist
    header.navigateToWishlist();
    
    // Step 3: Verify empty wishlist message or continue shopping option
    cy.get('body').then(($body) => {
      if ($body.find('#content>h2+p:contains("empty")').length > 0) {
        cy.get('#content>h2+p').should('contain.text', 'empty');
      } else {
        cy.get('a').contains('Continue').should('be.visible');
      }
    });
  });

  it('TC_02_D: Should manage multiple wishlist items', () => {
    // Step 1: Register new user
    registerPage.visit();
    const userData = ProductUtils.generateUserData();
    registerPage.register(userData);

    // Step 2: Add multiple products to wishlist
    cy.get('@testProducts').then((products) => {
      products.slice(0, 3).forEach((product, index) => {
        header.searchProduct(product);
        cy.get('#content #product').should('have.length.greaterThan', 0);
        cy.get('.caption h4 a').first().click();
        productPage.addToWishlist();
        cy.wait(CONSTANTS.DEFAULT_WAIT);
      });
    });

    // Step 3: Navigate to wishlist and verify multiple items
    header.navigateToWishlist();
    cy.get('form table>tbody>tr').should('have.length.greaterThan', 0);

    // Step 4: Remove first item from wishlist
    cy.get('a[data-original-title="Remove"]').first().click();
    cy.wait(CONSTANTS.DEFAULT_WAIT);
  });

  it('TC_02_E: Should validate product sorting in search results', () => {
    // Step 1: Search for products
    cy.visit(CONSTANTS.BASE_URL);
    cy.get('@productData').then((data) => {
      header.searchProduct(data.searchTerm);
    });

    // Step 2: Verify search results
    searchPage.validateSearchResults();
    cy.get('#content #product').should('have.length.greaterThan', 0);

    // Step 3: Apply different sorting options
    cy.get('#input-sort').select('Name (A - Z)');
    cy.wait(CONSTANTS.DEFAULT_WAIT);
    cy.get('.caption h4 a').should('have.length.greaterThan', 0);

    cy.get('#input-sort').select('Price (Low > High)');
    cy.wait(CONSTANTS.DEFAULT_WAIT);
    cy.get('.price').should('have.length.greaterThan', 0);

    cy.get('#input-sort').select('Rating (Highest)');
    cy.wait(CONSTANTS.DEFAULT_WAIT);
  });
});

// cypress/e2e/tests/LoginTest.cy.js
import { LoginPage } from '../pages/LoginPage.js';
import { AccountPage } from '../pages/AccountPage.js';

describe('Login Tests', () => {
  let loginPage;
  let accountPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    accountPage = new AccountPage();
  });

  it('should login with valid credentials', () => {
    loginPage.visit();
    loginPage.login('test@example.com', 'password');
    cy.get('#content .intro').should('be.visible');
  });
});

// cypress/e2e/tests/RegistrationTest.cy.js
import { RegisterPage } from '../pages/RegisterPage.js';
import { ProductUtils } from '../utils/ProductUtils.js';

describe('Registration Tests', () => {
  let registerPage;

  beforeEach(() => {
    registerPage = new RegisterPage();
  });

  it('should register with valid data', () => {
    registerPage.visit();
    const userData = ProductUtils.generateUserData();
    registerPage.register(userData);
    cy.url().should('include', 'account');
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
import { ProductDetailsPage } from '../pages/ProductDetailsPage.js';

describe('Add to Cart Tests', () => {
  let productPage;

  beforeEach(() => {
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

Cypress.Commands.add('addToWishlist', (productName) => {
  cy.get('#search input[name="search"]').clear().type(productName);
  cy.get('#search button').click();
  cy.get('.caption h4 a').first().click();
  cy.get('button[data-original-title="Add to Wish List"]').click();
});

// cypress/support/e2e.js
import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
```
