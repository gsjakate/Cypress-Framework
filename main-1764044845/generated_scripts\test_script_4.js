## cypress/e2e/pages/SearchPage.js
```javascript
export class SearchPage {
  visit(searchTerm = '') {
    if (searchTerm) {
      cy.visit(`?route=product/search&search=${encodeURIComponent(searchTerm)}`);
    } else {
      cy.visit('?route=product/search');
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

  getShowLimitDropdown() {
    return cy.get('#input-limit');
  }

  getGridViewButton() {
    return cy.get('#grid-view');
  }

  getListViewButton() {
    return cy.get('#list-view');
  }

  getPaginationLinks() {
    return cy.get('.pagination li');
  }

  getAddToCartButtons() {
    return cy.get('button[data-original-title="Add to Cart"]');
  }

  getAddToWishlistButtons() {
    return cy.get('button[data-original-title="Add to Wish List"]');
  }

  getCompareButtons() {
    return cy.get('button[data-original-title="Compare this Product"]');
  }

  performSearch(searchTerm, options = {}) {
    this.getSearchInput().clear().type(searchTerm);
    
    if (options.category) {
      this.getCategoryDropdown().select(options.category);
    }
    
    if (options.includeSubCategories) {
      this.getSubCategoryCheckbox().check();
    }
    
    if (options.searchInDescription) {
      this.getDescriptionCheckbox().check();
    }
    
    this.getSearchButton().click();
  }

  sortResults(sortOption) {
    this.getSortDropdown().select(sortOption);
  }

  setResultsLimit(limit) {
    this.getShowLimitDropdown().select(limit.toString());
  }

  switchToListView() {
    this.getListViewButton().click();
  }

  switchToGridView() {
    this.getGridViewButton().click();
  }
}
```

## cypress/e2e/utils/SearchUtils.js
```javascript
export class SearchUtils {
  static getSearchTestData() {
    return {
      validSearchTerms: [
        'MacBook',
        'iPhone',
        'Samsung',
        'Canon',
        'HP'
      ],
      invalidSearchTerms: [
        'xyz123nonexistent',
        'qwertyuiop',
        '!@#$%^&*()'
      ],
      categories: [
        'Desktops',
        'Laptops & Notebooks',
        'Components',
        'Tablets',
        'Software',
        'Phones & PDAs',
        'Cameras',
        'MP3 Players'
      ],
      sortOptions: [
        'Default',
        'Name (A - Z)',
        'Name (Z - A)',
        'Price (Low > High)',
        'Price (High > Low)',
        'Rating (Highest)',
        'Rating (Lowest)',
        'Model (A - Z)',
        'Model (Z - A)'
      ]
    };
  }

  static validateSearchResults(searchTerm, productTitles) {
    return productTitles.some(title => 
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  static extractPriceValue(priceText) {
    const match = priceText.match(/\$[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/[$,]/g, '')) : 0;
  }

  static validatePriceSorting(prices, order = 'asc') {
    const numericPrices = prices.map(price => this.extractPriceValue(price));
    
    for (let i = 1; i < numericPrices.length; i++) {
      if (order === 'asc' && numericPrices[i] < numericPrices[i - 1]) {
        return false;
      }
      if (order === 'desc' && numericPrices[i] > numericPrices[i - 1]) {
        return false;
      }
    }
    return true;
  }

  static generateRandomSearchTerm() {
    const terms = this.getSearchTestData().validSearchTerms;
    return terms[Math.floor(Math.random() * terms.length)];
  }
}
```

## cypress/e2e/tests/TC_03_search.cy.js
```javascript
import { HomePage } from '../pages/HomePage.js';
import { SearchPage } from '../pages/SearchPage.js';
import { ProductPage } from '../pages/ProductPage.js';
import { SearchUtils } from '../utils/SearchUtils.js';

describe('TC_03 - Product Search Functionality', () => {
  const homePage = new HomePage();
  const searchPage = new SearchPage();
  const productPage = new ProductPage();
  const testData = SearchUtils.getSearchTestData();

  beforeEach(() => {
    cy.visit('/');
  });

  it('TC_03_001 - Should search for products using header search box', () => {
    const searchTerm = 'MacBook';
    
    homePage.search(searchTerm);
    
    cy.url().should('include', 'search');
    searchPage.getProductResults().should('have.length.greaterThan', 0);
    
    searchPage.getProductTitles().each(($title) => {
      cy.wrap($title.text()).should('contain', searchTerm);
    });
  });

  it('TC_03_002 - Should display no results for invalid search term', () => {
    const invalidTerm = testData.invalidSearchTerms[0];
    
    homePage.search(invalidTerm);
    
    searchPage.getNoResultsMessage().should('be.visible');
    searchPage.getProductResults().should('not.exist');
  });

  it('TC_03_003 - Should perform advanced search with category filter', () => {
    searchPage.visit();
    
    searchPage.performSearch('MacBook', {
      category: 'Laptops & Notebooks'
    });
    
    searchPage.getProductResults().should('have.length.greaterThan', 0);
  });

  it('TC_03_004 - Should search in product descriptions', () => {
    searchPage.visit();
    
    searchPage.performSearch('processor', {
      searchInDescription: true
    });
    
    searchPage.getProductResults().should('have.length.greaterThan', 0);
  });

  it('TC_03_005 - Should include subcategories in search', () => {
    searchPage.visit();
    
    searchPage.performSearch('laptop', {
      category: 'Laptops & Notebooks',
      includeSubCategories: true
    });
    
    searchPage.getProductResults().should('have.length.greaterThan', 0);
  });

  it('TC_03_006 - Should sort search results by price low to high', () => {
    homePage.search('MacBook');
    
    searchPage.sortResults('Price (Low > High)');
    
    let prices = [];
    searchPage.getProductPrices().each(($price) => {
      prices.push($price.text());
    }).then(() => {
      expect(SearchUtils.validatePriceSorting(prices, 'asc')).to.be.true;
    });
  });

  it('TC_03_007 - Should sort search results by price high to low', () => {
    homePage.search('MacBook');
    
    searchPage.sortResults('Price (High > Low)');
    
    let prices = [];
    searchPage.getProductPrices().each(($price) => {
      prices.push($price.text());
    }).then(() => {
      expect(SearchUtils.validatePriceSorting(prices, 'desc')).to.be.true;
    });
  });

  it('TC_03_008 - Should sort search results by name A-Z', () => {
    homePage.search('Samsung');
    
    searchPage.sortResults('Name (A - Z)');
    
    let names = [];
    searchPage.getProductTitles().each(($title) => {
      names.push($title.text());
    }).then(() => {
      const sortedNames = [...names].sort();
      expect(names).to.deep.equal(sortedNames);
    });
  });

  it('TC_03_009 - Should change results display limit', () => {
    homePage.search('Samsung');
    
    searchPage.setResultsLimit(25);
    
    cy.url().should('include', 'limit=25');
  });

  it('TC_03_010 - Should switch between grid and list view', () => {
    homePage.search('MacBook');
    
    searchPage.switchToListView();
    cy.get('.product-list').should('exist');
    
    searchPage.switchToGridView();
    cy.get('.product-grid').should('exist');
  });

  it('TC_03_011 - Should add product to cart from search results', () => {
    homePage.search('MacBook');
    
    searchPage.getAddToCartButtons().first().click();
    
    cy.get('.alert-success').should('contain', 'Success: You have added');
  });

  it('TC_03_012 - Should add product to wishlist from search results', () => {
    homePage.search('iPhone');
    
    searchPage.getAddToWishlistButtons().first().click();
    
    cy.get('.alert').should('be.visible');
  });

  it('TC_03_013 - Should compare products from search results', () => {
    homePage.search('Samsung');
    
    searchPage.getCompareButtons().first().click();
    searchPage.getCompareButtons().eq(1).click();
    
    cy.get('.alert-success').should('contain', 'Success: You have added');
  });

  it('TC_03_014 - Should navigate to product details from search results', () => {
    homePage.search('Canon');
    
    searchPage.getProductTitles().first().click();
    
    cy.url().should('include', 'product_id');
    productPage.getProductTitle().should('be.visible');
  });

  it('TC_03_015 - Should handle pagination in search results', () => {
    homePage.search('a');
    
    searchPage.getPaginationLinks().should('have.length.greaterThan', 1);
    
    searchPage.getPaginationLinks().contains('2').click();
    cy.url().should('include', 'page=2');
  });

  it('TC_03_016 - Should maintain search parameters across pages', () => {
    searchPage.visit();
    
    searchPage.performSearch('Samsung', {
      category: 'Phones & PDAs'
    });
    
    searchPage.sortResults('Price (Low > High)');
    
    cy.url().should('include', 'search=Samsung');
    cy.url().should('include', 'sort=p.price');
  });

  it('TC_03_017 - Should search with special characters', () => {
    homePage.search('HP LP3065');
    
    searchPage.getProductResults().should('have.length.greaterThan', 0);
  });

  it('TC_03_018 - Should handle empty search submission', () => {
    searchPage.visit();
    searchPage.getSearchButton().click();
    
    searchPage.getNoResultsMessage().should('be.visible');
  });
});
```
