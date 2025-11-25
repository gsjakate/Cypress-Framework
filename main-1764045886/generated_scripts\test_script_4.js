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

## cypress/support/pages/SearchPage.js
```javascript
class SearchPage {
  visit(searchTerm = '') {
    if (searchTerm) {
      cy.visit(`/index.php?route=product/search&search=${searchTerm}`);
    } else {
      cy.visit('/index.php?route=product/search');
    }
  }

  getSearchInput() {
    return cy.get('#input-search');
  }

  getSearchButton() {
    return cy.get('#button-search');
  }

  getCategoryDropdown() {
    return cy.get('select[name="category_id"]');
  }

  getSubCategoryCheckbox() {
    return cy.get('input[name="sub_category"]');
  }

  getDescriptionCheckbox() {
    return cy.get('input[name="description"]');
  }

  getProductResults() {
    return cy.get('.product-thumb');
  }

  getProductTitles() {
    return cy.get('.product-thumb h4 a');
  }

  getProductPrices() {
    return cy.get('.product-thumb .price');
  }

  getNoResultsMessage() {
    return cy.get('p').contains('There is no product that matches the search criteria');
  }

  getSortDropdown() {
    return cy.get('#input-sort');
  }

  getShowDropdown() {
    return cy.get('#input-limit');
  }

  getListViewButton() {
    return cy.get('#list-view');
  }

  getGridViewButton() {
    return cy.get('#grid-view');
  }

  searchWithFilters(searchTerm, category = null, includeSubCategories = false, searchInDescription = false) {
    this.getSearchInput().clear().type(searchTerm);
    
    if (category) {
      this.getCategoryDropdown().select(category);
    }
    
    if (includeSubCategories) {
      this.getSubCategoryCheckbox().check();
    }
    
    if (searchInDescription) {
      this.getDescriptionCheckbox().check();
    }
    
    this.getSearchButton().click();
  }

  sortResults(sortOption) {
    this.getSortDropdown().select(sortOption);
  }

  changeResultsPerPage(limit) {
    this.getShowDropdown().select(limit);
  }

  switchToListView() {
    this.getListViewButton().click();
  }

  switchToGridView() {
    this.getGridViewButton().click();
  }
}

export default SearchPage;
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

  addToCart(quantity = 1) {
    if (quantity > 1) {
      this.getQuantityInput().clear().type(quantity);
    }
    this.getAddToCartButton().click();
  }
}

export default ProductPage;
```

## cypress/e2e/utils/SearchUtils.js
```javascript
class SearchUtils {
  static getSearchTerms() {
    return {
      valid: ['iPhone', 'MacBook', 'Canon', 'Samsung', 'Apple'],
      invalid: ['xyz123', 'nonexistent', 'qwerty'],
      partial: ['iph', 'mac', 'can'],
      special: ['@#$%', '123', '   '],
      categories: ['Desktops', 'Laptops & Notebooks', 'Components', 'Tablets', 'Software', 'Phones & PDAs', 'Cameras', 'MP3 Players']
    };
  }

  static getSortOptions() {
    return [
      'Default',
      'Name (A - Z)',
      'Name (Z - A)',
      'Price (Low > High)',
      'Price (High > Low)',
      'Rating (Highest)',
      'Rating (Lowest)',
      'Model (A - Z)',
      'Model (Z - A)'
    ];
  }

  static validateSearchResults(searchTerm) {
    cy.get('.product-thumb').should('have.length.greaterThan', 0);
    cy.get('.product-thumb h4 a').each(($el) => {
      cy.wrap($el).invoke('text').should('include', searchTerm);
    });
  }

  static validateNoResults() {
    cy.get('p').contains('There is no product that matches the search criteria').should('be.visible');
  }
}

export default SearchUtils;
```

## cypress/e2e/TC_03.cy.js
```javascript
import HomePage from '../support/pages/HomePage';
import SearchPage from '../support/pages/SearchPage';
import ProductPage from '../support/pages/ProductPage';
import ProductUtils from './utils/ProductUtils';
import SearchUtils from './utils/SearchUtils';

describe('TC_03 - Product Search Functionality Tests', () => {
  const homePage = new HomePage();
  const searchPage = new SearchPage();
  const productPage = new ProductPage();

  beforeEach(() => {
    cy.visit('/');
  });

  it('should search for products using search box', () => {
    const searchTerm = SearchUtils.getSearchTerms().valid[0];
    
    homePage.searchProduct(searchTerm);
    
    cy.url().should('include', 'search');
    searchPage.getProductResults().should('have.length.greaterThan', 0);
  });

  it('should display no results for invalid search term', () => {
    const invalidTerm = SearchUtils.getSearchTerms().invalid[0];
    
    homePage.searchProduct(invalidTerm);
    
    SearchUtils.validateNoResults();
  });

  it('should search with category filter', () => {
    const searchTerm = SearchUtils.getSearchTerms().valid[1];
    const category = SearchUtils.getSearchTerms().categories[0];
    
    searchPage.visit();
    searchPage.searchWithFilters(searchTerm, category);
    
    searchPage.getProductResults().should('be.visible');
  });

  it('should search with subcategory inclusion', () => {
    const searchTerm = SearchUtils.getSearchTerms().valid[2];
    
    searchPage.visit();
    searchPage.searchWithFilters(searchTerm, null, true);
    
    cy.url().should('include', 'sub_category=1');
  });

  it('should search in product descriptions', () => {
    const searchTerm = SearchUtils.getSearchTerms().valid[3];
    
    searchPage.visit();
    searchPage.searchWithFilters(searchTerm, null, false, true);
    
    cy.url().should('include', 'description=1');
  });

  it('should sort search results by name A-Z', () => {
    const searchTerm = SearchUtils.getSearchTerms().valid[0];
    
    homePage.searchProduct(searchTerm);
    searchPage.sortResults('Name (A - Z)');
    
    cy.url().should('include', 'sort=pd.name');
    cy.url().should('include', 'order=ASC');
  });

  it('should sort search results by price low to high', () => {
    const searchTerm = SearchUtils.getSearchTerms().valid[1];
    
    homePage.searchProduct(searchTerm);
    searchPage.sortResults('Price (Low > High)');
    
    cy.url().should('include', 'sort=p.price');
    cy.url().should('include', 'order=ASC');
  });

  it('should change number of results per page', () => {
    const searchTerm = SearchUtils.getSearchTerms().valid[2];
    
    homePage.searchProduct(searchTerm);
    searchPage.changeResultsPerPage('25');
    
    cy.url().should('include', 'limit=25');
  });

  it('should switch between grid and list view', () => {
    const searchTerm = SearchUtils.getSearchTerms().valid[0];
    
    homePage.searchProduct(searchTerm);
    
    searchPage.switchToListView();
    cy.get('.product-list').should('be.visible');
    
    searchPage.switchToGridView();
    cy.get('.product-grid').should('be.visible');
  });

  it('should handle empty search', () => {
    homePage.getSearchBox().clear();
    homePage.getSearchButton().click();
    
    cy.url().should('include', 'search');
  });

  it('should search with partial product name', () => {
    const partialTerm = SearchUtils.getSearchTerms().partial[0];
    
    homePage.searchProduct(partialTerm);
    
    searchPage.getProductResults().should('have.length.greaterThan', 0);
  });

  it('should click on search result and view product details', () => {
    const searchTerm = SearchUtils.getSearchTerms().valid[0];
    
    homePage.searchProduct(searchTerm);
    searchPage.getProductTitles().first().click();
    
    cy.url().should('include', 'product_id');
    productPage.getProductTitle().should('be.visible');
    productPage.getAddToCartButton().should('be.visible');
  });

  it('should handle special characters in search', () => {
    const specialTerm = SearchUtils.getSearchTerms().special[0];
    
    homePage.searchProduct(specialTerm);
    
    SearchUtils.validateNoResults();
  });

  it('should maintain search term in search box after search', () => {
    const searchTerm = SearchUtils.getSearchTerms().valid[1];
    
    homePage.searchProduct(searchTerm);
    
    searchPage.getSearchInput().should('have.value', searchTerm);
  });

  it('should search from search results page', () => {
    const firstTerm = SearchUtils.getSearchTerms().valid[0];
    const secondTerm = SearchUtils.getSearchTerms().valid[1];
    
    homePage.searchProduct(firstTerm);
    searchPage.getSearchInput().clear().type(secondTerm);
    searchPage.getSearchButton().click();
    
    searchPage.getSearchInput().should('have.value', secondTerm);
  });
});
```
