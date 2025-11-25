## cypress/e2e/tests/TC_03.cy.js
```javascript
import '../support/commands';

describe('TC_03 - Product Search and Cart Test', () => {
  
  beforeEach(() => {
    cy.visit('/');
  });

  it('should search for a product successfully', () => {
    cy.get('input[name="search"]').type('MacBook');
    cy.get('.btn-default').contains('Search').click();
    cy.url().should('include', 'search=MacBook');
    cy.get('.product-thumb').should('have.length.greaterThan', 0);
  });

  it('should view product details', () => {
    cy.get('input[name="search"]').type('iPhone');
    cy.get('.btn-default').contains('Search').click();
    cy.get('.product-thumb').first().find('h4 a').click();
    cy.get('h1').should('be.visible');
    cy.get('.price').should('be.visible');
    cy.get('#button-cart').should('be.visible');
  });

  it('should add product to cart', () => {
    cy.get('input[name="search"]').type('MacBook');
    cy.get('.btn-default').contains('Search').click();
    cy.get('.product-thumb').first().find('h4 a').click();
    cy.get('#button-cart').click();
    cy.get('.alert-success').should('contain.text', 'Success');
  });

  it('should view cart contents', () => {
    cy.get('input[name="search"]').type('iPhone');
    cy.get('.btn-default').contains('Search').click();
    cy.get('.product-thumb').first().find('h4 a').click();
    cy.get('#button-cart').click();
    cy.get('#cart').click();
    cy.get('.table-responsive').should('be.visible');
  });

  it('should handle empty search results', () => {
    cy.get('input[name="search"]').type('NonExistentProduct12345');
    cy.get('.btn-default').contains('Search').click();
    cy.get('p').should('contain.text', 'There is no product that matches the search criteria');
  });

});
```

## cypress/e2e/pages/SearchPage.js
```javascript
class SearchPage {
  elements = {
    searchInput: () => cy.get('input[name="search"]'),
    searchButton: () => cy.get('.btn-default'),
    productThumbs: () => cy.get('.product-thumb'),
    productTitles: () => cy.get('.product-thumb h4 a'),
    productPrices: () => cy.get('.product-thumb .price'),
    addToCartButtons: () => cy.get('.product-thumb button[onclick*="cart.add"]'),
    noResultsMessage: () => cy.get('p'),
    sortDropdown: () => cy.get('#input-sort'),
    showDropdown: () => cy.get('#input-limit'),
    listViewButton: () => cy.get('#list-view'),
    gridViewButton: () => cy.get('#grid-view')
  }

  searchProduct(productName) {
    this.elements.searchInput().clear().type(productName);
    this.elements.searchButton().click();
  }

  verifySearchResults() {
    this.elements.productThumbs().should('have.length.greaterThan', 0);
  }

  verifyNoResults() {
    this.elements.noResultsMessage().should('contain.text', 'There is no product that matches the search criteria');
  }

  clickFirstProduct() {
    this.elements.productTitles().first().click();
  }

  addFirstProductToCart() {
    this.elements.addToCartButtons().first().click();
  }

  sortBy(option) {
    this.elements.sortDropdown().select(option);
  }

  changeView(view) {
    if (view === 'list') {
      this.elements.listViewButton().click();
    } else {
      this.elements.gridViewButton().click();
    }
  }
}

export default SearchPage;
```

## cypress/e2e/pages/ProductDetailPage.js
```javascript
class ProductDetailPage {
  elements = {
    productTitle: () => cy.get('h1'),
    productPrice: () => cy.get('.price'),
    addToCartButton: () => cy.get('#button-cart'),
    quantityInput: () => cy.get('#input-quantity'),
    productImages: () => cy.get('.thumbnails img'),
    productDescription: () => cy.get('#tab-description'),
    productSpecification: () => cy.get('#tab-specification'),
    productReviews: () => cy.get('#tab-review'),
    successAlert: () => cy.get('.alert-success'),
    wishlistButton: () => cy.get('button[data-original-title="Add to Wish List"]'),
    compareButton: () => cy.get('button[data-original-title="Compare this Product"]'),
    availabilityStatus: () => cy.get('.list-unstyled li').contains('Availability'),
    productCode: () => cy.get('.list-unstyled li').contains('Product Code'),
    brand: () => cy.get('.list-unstyled li').contains('Brand')
  }

  verifyProductDetails() {
    this.elements.productTitle().should('be.visible');
    this.elements.productPrice().should('be.visible');
    this.elements.addToCartButton().should('be.visible');
  }

  addToCart(quantity = 1) {
    if (quantity !== 1) {
      this.elements.quantityInput().clear().type(quantity);
    }
    this.elements.addToCartButton().click();
  }

  verifyAddToCartSuccess() {
    this.elements.successAlert().should('contain.text', 'Success');
  }

  addToWishlist() {
    this.elements.wishlistButton().click();
  }

  addToCompare() {
    this.elements.compareButton().click();
  }

  viewProductImages() {
    this.elements.productImages().should('be.visible');
    this.elements.productImages().first().click();
  }

  checkAvailability() {
    this.elements.availabilityStatus().should('be.visible');
  }
}

export default ProductDetailPage;
```

## cypress/e2e/pages/CartPage.js
```javascript
class CartPage {
  elements = {
    cartButton: () => cy.get('#cart'),
    cartDropdown: () => cy.get('.dropdown-menu'),
    cartTable: () => cy.get('.table-responsive'),
    cartItems: () => cy.get('.table tbody tr'),
    removeButtons: () => cy.get('button[data-original-title="Remove"]'),
    quantityInputs: () => cy.get('input[name*="quantity"]'),
    updateButtons: () => cy.get('button[data-original-title="Update"]'),
    totalPrice: () => cy.get('.text-right strong'),
    checkoutButton: () => cy.get('a[href*="checkout"]'),
    continueShoppingButton: () => cy.get('a[href*="common/home"]'),
    emptyCartMessage: () => cy.get('p').contains('Your shopping cart is empty!')
  }

  openCart() {
    this.elements.cartButton().click();
  }

  verifyCartContents() {
    this.elements.cartTable().should('be.visible');
    this.elements.cartItems().should('have.length.greaterThan', 0);
  }

  verifyEmptyCart() {
    this.elements.emptyCartMessage().should('be.visible');
  }

  removeFirstItem() {
    this.elements.removeButtons().first().click();
  }

  updateQuantity(itemIndex, quantity) {
    this.elements.quantityInputs().eq(itemIndex).clear().type(quantity);
    this.elements.updateButtons().eq(itemIndex).click();
  }

  proceedToCheckout() {
    this.elements.checkoutButton().click();
  }

  continueShopping() {
    this.elements.continueShoppingButton().click();
  }

  getTotalPrice() {
    return this.elements.totalPrice().invoke('text');
  }
}

export default CartPage;
```
