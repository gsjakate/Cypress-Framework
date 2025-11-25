## cypress/e2e/tests/TC_02.cy.js
```javascript
import '../support/commands';

describe('TC_02 - User Registration Test', () => {
  
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to registration page', () => {
    cy.get('.dropdown-toggle').contains('My Account').click();
    cy.get('a[href*="register"]').click();
    cy.url().should('include', 'register');
    cy.get('h1').should('contain.text', 'Register Account');
  });

  it('should fill registration form with valid data', () => {
    cy.get('.dropdown-toggle').contains('My Account').click();
    cy.get('a[href*="register"]').click();
    
    cy.get('#input-firstname').type('John');
    cy.get('#input-lastname').type('Doe');
    cy.get('#input-email').type('john.doe@example.com');
    cy.get('#input-telephone').type('1234567890');
    cy.get('#input-password').type('password123');
    cy.get('#input-confirm').type('password123');
    cy.get('input[name="agree"]').check();
    cy.get('input[type="submit"][value="Continue"]').click();
  });

  it('should validate required fields', () => {
    cy.get('.dropdown-toggle').contains('My Account').click();
    cy.get('a[href*="register"]').click();
    
    cy.get('input[type="submit"][value="Continue"]').click();
    cy.get('.text-danger').should('be.visible');
  });

});
```

## cypress/e2e/pages/RegistrationPage.js
```javascript
class RegistrationPage {
  elements = {
    firstNameInput: () => cy.get('#input-firstname'),
    lastNameInput: () => cy.get('#input-lastname'),
    emailInput: () => cy.get('#input-email'),
    telephoneInput: () => cy.get('#input-telephone'),
    passwordInput: () => cy.get('#input-password'),
    confirmPasswordInput: () => cy.get('#input-confirm'),
    agreeCheckbox: () => cy.get('input[name="agree"]'),
    continueButton: () => cy.get('input[type="submit"][value="Continue"]'),
    errorMessages: () => cy.get('.text-danger'),
    successMessage: () => cy.get('.alert-success'),
    pageTitle: () => cy.get('h1')
  }

  visit() {
    cy.visit('/index.php?route=account/register');
  }

  fillRegistrationForm(userData) {
    this.elements.firstNameInput().type(userData.firstName);
    this.elements.lastNameInput().type(userData.lastName);
    this.elements.emailInput().type(userData.email);
    this.elements.telephoneInput().type(userData.telephone);
    this.elements.passwordInput().type(userData.password);
    this.elements.confirmPasswordInput().type(userData.confirmPassword);
  }

  agreeToPolicy() {
    this.elements.agreeCheckbox().check();
  }

  submitForm() {
    this.elements.continueButton().click();
  }

  verifyRegistrationPage() {
    this.elements.pageTitle().should('contain.text', 'Register Account');
    this.elements.firstNameInput().should('be.visible');
    this.elements.emailInput().should('be.visible');
  }

  verifyValidationErrors() {
    this.elements.errorMessages().should('be.visible');
  }

  verifySuccessfulRegistration() {
    cy.url().should('include', 'success');
  }
}

export default RegistrationPage;
```

## cypress/e2e/utils/UserDataUtils.js
```javascript
export class UserDataUtils {
  static generateRandomUser() {
    const timestamp = Date.now();
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: `testuser${timestamp}@example.com`,
      telephone: '1234567890',
      password: 'password123',
      confirmPassword: 'password123'
    };
  }

  static getInvalidUserData() {
    return {
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      telephone: '123',
      password: '123',
      confirmPassword: '456'
    };
  }

  static getValidUserData() {
    return {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      telephone: '1234567890',
      password: 'validPassword123',
      confirmPassword: 'validPassword123'
    };
  }
}
```
