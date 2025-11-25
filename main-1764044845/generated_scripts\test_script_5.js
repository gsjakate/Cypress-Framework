## cypress/e2e/pages/CheckoutPage.js
```javascript
export class CheckoutPage {
  visit() {
    cy.visit('?route=checkout/checkout');
  }

  // Billing Details Section
  getBillingFirstName() {
    return cy.get('#input-payment-firstname');
  }

  getBillingLastName() {
    return cy.get('#input-payment-lastname');
  }

  getBillingCompany() {
    return cy.get('#input-payment-company');
  }

  getBillingAddress1() {
    return cy.get('#input-payment-address-1');
  }

  getBillingAddress2() {
    return cy.get('#input-payment-address-2');
  }

  getBillingCity() {
    return cy.get('#input-payment-city');
  }

  getBillingPostcode() {
    return cy.get('#input-payment-postcode');
  }

  getBillingCountry() {
    return cy.get('#input-payment-country');
  }

  getBillingZone() {
    return cy.get('#input-payment-zone');
  }

  // Delivery Details Section
  getDeliveryFirstName() {
    return cy.get('#input-shipping-firstname');
  }

  getDeliveryLastName() {
    return cy.get('#input-shipping-lastname');
  }

  getDeliveryCompany() {
    return cy.get('#input-shipping-company');
  }

  getDeliveryAddress1() {
    return cy.get('#input-shipping-address-1');
  }

  getDeliveryAddress2() {
    return cy.get('#input-shipping-address-2');
  }

  getDeliveryCity() {
    return cy.get('#input-shipping-city');
  }

  getDeliveryPostcode() {
    return cy.get('#input-shipping-postcode');
  }

  getDeliveryCountry() {
    return cy.get('#input-shipping-country');
  }

  getDeliveryZone() {
    return cy.get('#input-shipping-zone');
  }

  // Checkout Options
  getGuestCheckoutRadio() {
    return cy.get('input[value="guest"]');
  }

  getRegisterAccountRadio() {
    return cy.get('input[value="register"]');
  }

  getExistingCustomerRadio() {
    return cy.get('input[value="login"]');
  }

  getSameAddressCheckbox() {
    return cy.get('input[name="shipping_address"][value="1"]');
  }

  getDifferentAddressCheckbox() {
    return cy.get('input[name="shipping_address"][value="0"]');
  }

  // Continue Buttons
  getBillingContinueButton() {
    return cy.get('#button-payment-address');
  }

  getDeliveryContinueButton() {
    return cy.get('#button-shipping-address');
  }

  getDeliveryMethodContinueButton() {
    return cy.get('#button-shipping-method');
  }

  getPaymentMethodContinueButton() {
    return cy.get('#button-payment-method');
  }

  getConfirmOrderButton() {
    return cy.get('#button-confirm');
  }

  // Payment and Delivery Methods
  getDeliveryMethods() {
    return cy.get('input[name="shipping_method"]');
  }

  getPaymentMethods() {
    return cy.get('input[name="payment_method"]');
  }

  getTermsCheckbox() {
    return cy.get('input[name="agree"]');
  }

  getDeliveryMethodComments() {
    return cy.get('textarea[name="comment"]');
  }

  // Order Summary
  getOrderSummaryTable() {
    return cy.get('.table-responsive table');
  }

  getTotalAmount() {
    return cy.get('tr').contains('Total').find('td').last();
  }

  getSubTotal() {
    return cy.get('tr').contains('Sub-Total').find('td').last();
  }

  getShippingCost() {
    return cy.get('tr').contains('Flat Shipping Rate').find('td').last();
  }

  // Error Messages
  getErrorMessages() {
    return cy.get('.alert-danger');
  }

  getFieldError(fieldId) {
    return cy.get(`#${fieldId}`).parent().find('.text-danger');
  }

  // Helper Methods
  fillBillingDetails(billingData) {
    this.getBillingFirstName().clear().type(billingData.firstName);
    this.getBillingLastName().clear().type(billingData.lastName);
    
    if (billingData.company) {
      this.getBillingCompany().clear().type(billingData.company);
    }
    
    this.getBillingAddress1().clear().type(billingData.address1);
    
    if (billingData.address2) {
      this.getBillingAddress2().clear().type(billingData.address2);
    }
    
    this.getBillingCity().clear().type(billingData.city);
    this.getBillingPostcode().clear().type(billingData.postcode);
    this.getBillingCountry().select(billingData.country);
    
    cy.wait(1000); // Wait for zones to load
    this.getBillingZone().select(billingData.zone);
  }

  fillDeliveryDetails(deliveryData) {
    this.getDeliveryFirstName().clear().type(deliveryData.firstName);
    this.getDeliveryLastName().clear().type(deliveryData.lastName);
    
    if (deliveryData.company) {
      this.getDeliveryCompany().clear().type(deliveryData.company);
    }
    
    this.getDeliveryAddress1().clear().type(deliveryData.address1);
    
    if (deliveryData.address2) {
      this.getDeliveryAddress2().clear().type(deliveryData.address2);
    }
    
    this.getDeliveryCity().clear().type(deliveryData.city);
    this.getDeliveryPostcode().clear().type(deliveryData.postcode);
    this.getDeliveryCountry().select(deliveryData.country);
    
    cy.wait(1000);
    this.getDeliveryZone().select(deliveryData.zone);
  }

  selectDeliveryMethod(method) {
    this.getDeliveryMethods().check(method);
  }

  selectPaymentMethod(method) {
    this.getPaymentMethods().check(method);
  }

  proceedAsGuest() {
    this.getGuestCheckoutRadio().check();
    this.getBillingContinueButton().click();
  }

  proceedWithRegistration() {
    this.getRegisterAccountRadio().check();
    this.getBillingContinueButton().click();
  }

  useSameAddressForDelivery() {
    this.getSameAddressCheckbox().check();
  }

  useDifferentAddressForDelivery() {
    this.getDifferentAddressCheckbox().check();
  }
}
```

## cypress/e2e/utils/CheckoutUtils.js
```javascript
export class CheckoutUtils {
  static getValidBillingData() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      company: 'Test Company Ltd',
      address1: '123 Test Street',
      address2: 'Apt 4B',
      city: 'Test City',
      postcode: '12345',
      country: 'United States',
      zone: 'Alabama'
    };
  }

  static getValidDeliveryData() {
    return {
      firstName: 'Jane',
      lastName: 'Smith',
      company: 'Delivery Company Inc',
      address1: '456 Delivery Avenue',
      address2: 'Suite 200',
      city: 'Delivery City',
      postcode: '67890',
      country: 'United States',
      zone: 'California'
    };
  }

  static getInvalidBillingData() {
    return {
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      postcode: '',
      country: '',
      zone: ''
    };
  }

  static generateRandomPostcode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  static validatePostcode(postcode, country) {
    if (country === 'United States') {
      return /^\d{5}(-\d{4})?$/.test(postcode);
    }
    if (country === 'United Kingdom') {
      return /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(postcode);
    }
    return postcode.length >= 3;
  }

  static calculateExpectedTotal(subtotal, shipping, tax = 0) {
    return parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax);
  }

  static extractAmountFromText(text) {
    const match = text.match(/\$?([\d,]+\.?\d*)/);
    return match ? parseFloat(match[1].replace(',', '')) : 0;
  }

  static getTestPaymentMethods() {
    return [
      'cod', // Cash on Delivery
      'bank_transfer', // Bank Transfer
      'cheque' // Cheque
    ];
  }

  static getTestShippingMethods() {
    return [
      'flat.flat', // Flat Rate
      'free.free' // Free Shipping
    ];
  }
}
```

## cypress/e2e/tests/TC_04_checkout.cy.js
```javascript
import { HomePage } from '../pages/HomePage.js';
import { ProductPage } from '../pages/ProductPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { CheckoutUtils } from '../utils/CheckoutUtils.js';

describe('TC_04 - Checkout Process Functionality', () => {
  const homePage = new HomePage();
  const productPage = new ProductPage();
  const cartPage = new CartPage();
  const checkoutPage = new CheckoutPage();
  const loginPage = new LoginPage();

  beforeEach(() => {
    // Add a product to cart before each test
    cy.visit('/');
    homePage.search('MacBook');
    cy.get('.product-thumb').first().find('a').first().click();
    productPage.addToCart();
    cartPage.visit();
    cartPage.getCheckoutButton().click();
  });

  it('TC_04_001 - Should complete checkout as guest user', () => {
    const billingData = CheckoutUtils.getValidBillingData();
    
    checkoutPage.proceedAsGuest();
    checkoutPage.fillBillingDetails(billingData);
    checkoutPage.useSameAddressForDelivery();
    checkoutPage.getBillingContinueButton().click();
    
    checkoutPage.getDeliveryContinueButton().click();
    
    checkoutPage.selectDeliveryMethod('flat.flat');
    checkoutPage.getDeliveryMethodContinueButton().click();
    
    checkoutPage.selectPaymentMethod('cod');
    checkoutPage.getTermsCheckbox().check();
    checkoutPage.getPaymentMethodContinueButton().click();
    
    checkoutPage.getConfirmOrderButton().click();
    
    cy.url().should('include', 'success');
    cy.contains('Your order has been placed!').should('be.visible');
  });

  it('TC_04_002 - Should show validation errors for empty billing details', () => {
    checkoutPage.proceedAsGuest();
    checkoutPage.getBillingContinueButton().click();
    
    checkoutPage.getFieldError('input-payment-firstname')
      .should('contain', 'First Name must be between 1 and 32 characters!');
    checkoutPage.getFieldError('input-payment-lastname')
      .should('contain', 'Last Name must be between 1 and 32 characters!');
    checkoutPage.getFieldError('input-payment-address-1')
      .should('contain', 'Address 1 must be between 3 and 128 characters!');
    checkoutPage.getFieldError('input-payment-city')
      .should('contain', 'City must be between 2 and 128 characters!');
  });

  it('TC_04_003 - Should complete checkout with different delivery address', () => {
    const billingData = CheckoutUtils.getValidBillingData();
    const deliveryData = CheckoutUtils.getValidDeliveryData();
    
    checkoutPage.proceedAsGuest();
    checkoutPage.fillBillingDetails(billingData);
    checkoutPage.useDifferentAddressForDelivery();
    checkoutPage.getBillingContinueButton().click();
    
    checkoutPage.fillDeliveryDetails(deliveryData);
    checkoutPage.getDeliveryContinueButton().click();
    
    checkoutPage.selectDeliveryMethod('flat.flat');
    checkoutPage.getDeliveryMethodContinueButton().click();
    
    checkoutPage.selectPaymentMethod('cod');
    checkoutPage.getTermsCheckbox().check();
    checkoutPage.getPaymentMethodContinueButton().click();
    
    checkoutPage.getConfirmOrderButton().click();
    
    cy.url().should('include', 'success');
  });

  it('TC_04_004 - Should select different delivery methods', () => {
    const billingData = CheckoutUtils.getValidBillingData();
    
    checkoutPage.proceedAsGuest();
    checkoutPage.fillBillingDetails(billingData);
    checkoutPage.useSameAddressForDelivery();
    checkoutPage.getBillingContinueButton().click();
    checkoutPage.getDeliveryContinueButton().click();
    
    checkoutPage.getDeliveryMethods().should('have.length.greaterThan', 0);
    
    checkoutPage.selectDeliveryMethod('free.free');
    checkoutPage.getDeliveryMethodContinueButton().click();
    
    cy.get('input[name="shipping_method"]:checked').should('have.value', 'free.free');
  });

  it('TC_04_005 - Should select different payment methods', () => {
    const billingData = CheckoutUtils.getValidBillingData();
    
    checkoutPage.proceedAsGuest();
    checkoutPage.fillBillingDetails(billingData);
    checkoutPage.useSameAddressForDelivery();
    checkoutPage.getBillingContinueButton().click();
    checkoutPage.getDeliveryContinueButton().click();
    
    checkoutPage.selectDeliveryMethod('flat.flat');
    checkoutPage.getDeliveryMethodContinueButton().click();
    
    checkoutPage.getPaymentMethods().should('have.length.greaterThan', 0);
    
    checkoutPage.selectPaymentMethod('bank_transfer');
    checkoutPage.getTermsCheckbox().check();
    checkoutPage.getPaymentMethodContinueButton().click();
    
    cy.get('input[name="payment_method"]:checked').should('have.value', 'bank_transfer');
  });

  it('TC_04_006 - Should show error when terms not accepted', () => {
    const billingData = CheckoutUtils.getValidBillingData();
    
    checkoutPage.proceedAsGuest();
    checkoutPage.fillBillingDetails(billingData);
    checkoutPage.useSameAddressForDelivery();
    checkoutPage.getBillingContinueButton().click();
    checkoutPage.getDeliveryContinueButton().click();
    
    checkoutPage.selectDeliveryMethod('flat.flat');
    checkoutPage.getDeliveryMethodContinueButton().click();
    
    checkoutPage.selectPaymentMethod('cod');
    checkoutPage.getPaymentMethodContinueButton().click();
    
    checkoutPage.getErrorMessages().should('contain', 'Warning: You must agree to the Terms & Conditions!');
  });

  it('TC_04_007 - Should display correct order summary', () => {
    const billingData = CheckoutUtils.getValidBillingData();
    
    checkoutPage.proceedAsGuest();
    checkoutPage.fillBillingDetails(billingData);
    checkoutPage.useSameAddressForDelivery();
    checkoutPage.getBillingContinueButton().click();
    checkoutPage.getDeliveryContinueButton().click();
    
    checkoutPage.selectDeliveryMethod('flat.flat');
    checkoutPage.getDeliveryMethodContinueButton().click();
    
    checkoutPage.selectPaymentMethod('cod');
    checkoutPage.getTermsCheckbox().check();
    checkoutPage.getPaymentMethodContinueButton().click();
    
    checkoutPage.getOrderSummaryTable().should('be.visible');
    checkoutPage.getSubTotal().should('be.visible');
    checkoutPage.getTotalAmount().should('be.visible');
  });

  it('TC_04_008 - Should validate postcode format', () => {
    const billingData = CheckoutUtils.getValidBillingData();
    billingData.postcode = '123'; // Invalid postcode
    
    checkoutPage.proceedAsGuest();
    checkoutPage.fillBillingDetails(billingData);
    checkoutPage.getBillingContinueButton().click();
    
    checkoutPage.getFieldError('input-payment-postcode')
      .should('contain', 'Postcode must be between 2 and 10 characters!');
  });

  it('TC_04_009 - Should complete checkout with registration', () => {
    const billingData = CheckoutUtils.getValidBillingData();
    
    checkoutPage.getRegisterAccountRadio().check();
    checkoutPage.fillBillingDetails(billingData);
    
    // Fill additional registration fields
    cy.get('#input-payment-email').type('newuser@example.com');
    cy.get('#input-payment-telephone').type('1234567890');
    cy.get('#input-payment-password').type('password123');
    cy.get('#input-payment-confirm').type('password123');
    
    checkoutPage.useSameAddressForDelivery();
    checkoutPage.getBillingContinueButton().click();
    
    checkoutPage.getDeliveryContinueButton().click();
    
    checkoutPage.selectDeliveryMethod('flat.flat');
    checkoutPage.getDeliveryMethodContinueButton().click();
    
    checkoutPage.selectPaymentMethod('cod');
    checkoutPage.getTermsCheckbox().check();
    checkoutPage.getPaymentMethodContinueButton().click();
    
    checkoutPage.getConfirmOrderButton().click();
    
    cy.url().should('include', 'success');
  });

  it('TC_04_010 - Should add delivery comments', () => {
    const billingData = CheckoutUtils.getValidBillingData();
    const deliveryComment = 'Please deliver between 9 AM and 5 PM';
    
    checkoutPage.proceedAsGuest();
    checkoutPage.fillBillingDetails(billingData);
    checkoutPage.useSameAddressForDelivery();
    checkoutPage.getBillingContinueButton().click();
    checkoutPage.getDeliveryContinueButton().click();
    
    checkoutPage.selectDeliveryMethod('flat.flat');
    checkoutPage.getDeliveryMethodComments().type(deliveryComment);
    checkoutPage.getDeliveryMethodContinueButton().click();
    
    cy.get('textarea[name="comment"]').should('have.value', deliveryComment);
  });

  it('TC_04_011 - Should calculate shipping cost correctly', () => {
    const billingData = CheckoutUtils.getValidBillingData();
    
    checkoutPage.proceedAsGuest();
    checkoutPage.fillBillingDetails(billingData);
    checkoutPage.useSameAddressForDelivery();
    checkoutPage.getBillingContinueButton().click();
    checkoutPage.getDeliveryContinueButton().click();
    
    // Test flat rate shipping
    checkoutPage.selectDeliveryMethod('flat.flat');
    checkoutPage.getDeliveryMethodContinueButton().click();
    
    checkoutPage.selectPaymentMethod('cod');
    checkoutPage.getTermsCheckbox().check();
    checkoutPage.getPaymentMethodContinueButton().click();
    
    checkoutPage.getShippingCost().should('contain', '$');
    
    let subtotal, shipping, total;
    checkoutPage.getSubTotal().invoke('text').then((subtotalText) => {
      subtotal = CheckoutUtils.extractAmountFromText(subtotalText);
      
      checkoutPage.getShippingCost().invoke('text').then((shippingText) => {
        shipping = CheckoutUtils.extractAmountFromText(shippingText);
        
        checkoutPage.getTotalAmount().invoke('text').then((totalText) => {
          total = CheckoutUtils.extractAmountFromText(totalText);
          
          const expectedTotal = CheckoutUtils.calculateExpectedTotal(subtotal, shipping);
          expect(total).to.be.closeTo(expectedTotal, 0.01);
        });
      });
    });
  });
});
```
