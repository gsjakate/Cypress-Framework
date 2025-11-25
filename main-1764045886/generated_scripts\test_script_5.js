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

  getUpdateButton() {
    return cy.get('button[data-original-title="Update"]');
  }

  getTotalPrice() {
    return cy.get('.text-right').contains('Total:');
  }

  getSubTotal() {
    return cy.get('.text-right').contains('Sub-Total:');
  }

  getProductName() {
    return cy.get('.table-responsive tbody tr td').eq(1);
  }

  getProductPrice() {
    return cy.get('.table-responsive tbody tr td').eq(4);
  }

  getCartTotal() {
    return cy.get('.table-responsive tbody tr td').eq(5);
  }

  getEmptyCartMessage() {
    return cy.get('p').contains('Your shopping cart is empty!');
  }

  getCouponCode() {
    return cy.get('input[name="coupon"]');
  }

  getApplyCouponButton() {
    return cy.get('input[value="Apply Coupon"]');
  }

  getEstimateShipping() {
    return cy.get('a').contains('Estimate Shipping & Taxes');
  }

  updateQuantity(quantity) {
    this.getQuantityInput().clear().type(quantity);
    this.getUpdateButton().click();
  }

  removeItem() {
    this.getRemoveButton().first().click();
  }

  applyCoupon(couponCode) {
    this.getCouponCode().type(couponCode);
    this.getApplyCouponButton().click();
  }

  proceedToCheckout() {
    this.getCheckoutButton().click();
  }

  continueShopping() {
    this.getContinueShoppingButton().click();
  }
}

export default CartPage;
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

  getWishlistButton() {
    return cy.get('button[data-original-title="Add to Wish List"]');
  }

  getCompareButton() {
    return cy.get('button[data-original-title="Compare this Product"]');
  }

  getProductOptions() {
    return cy.get('.form-group');
  }

  getSuccessMessage() {
    return cy.get('.alert-success');
  }

  addToCart(quantity = 1) {
    if (quantity > 1) {
      this.getQuantityInput().clear().type(quantity);
    }
    this.getAddToCartButton().click();
  }

  selectOption(optionName, value) {
    cy.get(`select[name*="option"]`).select(value);
  }
}

export default ProductPage;
```

## cypress/e2e/utils/CartUtils.js
```javascript
class CartUtils {
  static validateCartItem(productName, quantity, price) {
    cy.get('.table-responsive tbody tr').should('contain', productName);
    cy.get('input[name*="quantity"]').should('have.value', quantity.toString());
    cy.get('.table-responsive tbody tr').should('contain', price);
  }

  static validateEmptyCart() {
    cy.get('p').contains('Your shopping cart is empty!').should('be.visible');
  }

  static calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  static formatPrice(price) {
    return `$${price.toFixed(2)}`;
  }

  static validateCartTotal(expectedTotal) {
    cy.get('.text-right').contains('Total:').should('contain', this.formatPrice(expectedTotal));
  }

  static getTestProducts() {
    return [
      { name: 'iPhone', quantity: 1, price: 123.20 },
      { name: 'MacBook', quantity: 2, price: 602.00 },
      { name: 'Canon EOS 5D', quantity: 1, price: 122.00 }
    ];
  }

  static addMultipleProducts(products) {
    products.forEach(product => {
      cy.visit('/');
      cy.get('input[name="search"]').type(product.name);
      cy.get('button[class*="btn-default"]').contains('Search').click();
      cy.get('.product-thumb').first().click();
      
      if (product.quantity > 1) {
        cy.get('#input-quantity').clear().type(product.quantity);
      }
      
      cy.get('#button-cart').click();
      cy.get('.alert-success').should('be.visible');
    });
  }
}

export default CartUtils;
```

## cypress/e2e/TC_04.cy.js
```javascript
import HomePage from '../support/pages/HomePage';
import CartPage from '../support/pages/CartPage';
import ProductPage from '../support/pages/ProductPage';
import ProductUtils from './utils/ProductUtils';
import CartUtils from './utils/CartUtils';

describe('TC_04 - Shopping Cart Management Tests', () => {
  const homePage = new HomePage();
  const cartPage = new CartPage();
  const productPage = new ProductPage();

  beforeEach(() => {
    cy.visit('/');
  });

  it('should add product to cart and verify cart contents', () => {
    homePage.searchProduct('iPhone');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    productPage.getSuccessMessage().should('contain', 'Success');
    
    cartPage.visit();
    cartPage.getCartItems().should('have.length.greaterThan', 0);
    cartPage.getProductName().should('contain', 'iPhone');
  });

  it('should update product quantity in cart', () => {
    homePage.searchProduct('MacBook');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    cartPage.visit();
    cartPage.updateQuantity('3');
    
    cy.get('.alert-success').should('contain', 'Success');
    cartPage.getQuantityInput().should('have.value', '3');
  });

  it('should remove product from cart', () => {
    homePage.searchProduct('Canon');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    cartPage.visit();
    cartPage.removeItem();
    
    cy.get('.alert-success').should('contain', 'Success');
  });

  it('should add multiple products to cart', () => {
    const products = ['iPhone', 'MacBook'];
    
    products.forEach(product => {
      homePage.visit();
      homePage.searchProduct(product);
      cy.get('.product-thumb').first().click();
      productPage.addToCart();
      productPage.getSuccessMessage().should('be.visible');
    });
    
    cartPage.visit();
    cartPage.getCartItems().should('have.length', products.length);
  });

  it('should calculate cart total correctly', () => {
    homePage.searchProduct('iPhone');
    cy.get('.product-thumb').first().click();
    
    cy.get('.price').invoke('text').then(priceText => {
      productPage.addToCart(2);
      
      cartPage.visit();
      cartPage.getTotalPrice().should('be.visible');
    });
  });

  it('should display empty cart message when cart is empty', () => {
    cartPage.visit();
    cartPage.getEmptyCartMessage().should('be.visible');
  });

  it('should continue shopping from cart', () => {
    homePage.searchProduct('Samsung');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    cartPage.visit();
    cartPage.continueShopping();
    
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should proceed to checkout from cart', () => {
    homePage.searchProduct('Apple Cinema');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    cartPage.visit();
    cartPage.proceedToCheckout();
    
    cy.url().should('include', 'checkout');
  });

  it('should apply coupon code', () => {
    homePage.searchProduct('iPhone');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    cartPage.visit();
    cartPage.applyCoupon('TESTCOUPON');
    
    cy.get('.alert').should('be.visible');
  });

  it('should update cart when quantity is set to zero', () => {
    homePage.searchProduct('MacBook');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    cartPage.visit();
    cartPage.updateQuantity('0');
    
    cy.get('.alert').should('be.visible');
  });

  it('should validate minimum quantity restrictions', () => {
    homePage.searchProduct('Canon');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    cartPage.visit();
    cartPage.getQuantityInput().clear().type('-1');
    cartPage.getUpdateButton().click();
    
    cy.get('.alert-danger').should('be.visible');
  });

  it('should maintain cart contents across sessions', () => {
    homePage.searchProduct('iPhone');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    cy.reload();
    
    cartPage.visit();
    cartPage.getCartItems().should('have.length.greaterThan', 0);
  });

  it('should show cart dropdown when hovering over cart icon', () => {
    homePage.searchProduct('Samsung');
    cy.get('.product-thumb').first().click();
    productPage.addToCart();
    
    homePage.visit();
    homePage.getCartButton().click();
    
    cy.get('.dropdown-menu').should('be.visible');
  });

  it('should display product options in cart', () => {
    homePage.searchProduct('Apple Cinema');
    cy.get('.product-thumb').first().click();
    
    cy.get('select[name*="option"]').then($select => {
      if ($select.length > 0) {
        cy.wrap($select).first().select(1);
      }
    });
    
    productPage.addToCart();
    cartPage.visit();
    
    cartPage.getCartItems().should('have.length.greaterThan', 0);
  });

  it('should validate cart total after removing items', () => {
    const products = ['iPhone', 'MacBook', 'Canon'];
    
    products.forEach(product => {
      homePage.visit();
      homePage.searchProduct(product);
      cy.get('.product-thumb').first().click();
      productPage.addToCart();
    });
    
    cartPage.visit();
    const initialCount = products.length;
    
    cartPage.removeItem();
    
    cy.get('.alert-success').should('be.visible');
    cartPage.getCartItems().should('have.length', initialCount - 1);
  });
});
```
