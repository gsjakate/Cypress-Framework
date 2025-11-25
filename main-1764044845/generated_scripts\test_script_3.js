## cypress/e2e/pages/RegisterPage.js
```javascript
export class RegisterPage {
  visit() {
    cy.visit('?route=account/register');
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

  getPrivacyPolicyCheckbox() {
    return cy.get('input[name="agree"]');
  }

  getContinueButton() {
    return cy.get('input[value="Continue"]');
  }

  getNewsletterYesRadio() {
    return cy.get('input[name="newsletter"][value="1"]');
  }

  getNewsletterNoRadio() {
    return cy.get('input[name="newsletter"][value="0"]');
  }

  getErrorMessage() {
    return cy.get('.alert-danger');
  }

  getFieldError(fieldName) {
    return cy.get(`#input-${fieldName}`).parent().find('.text-danger');
  }

  fillRegistrationForm(userData) {
    this.getFirstNameInput().type(userData.firstName);
    this.getLastNameInput().type(userData.lastName);
    this.getEmailInput().type(userData.email);
    this.getTelephoneInput().type(userData.telephone);
    this.getPasswordInput().type(userData.password);
    this.getConfirmPasswordInput().type(userData.confirmPassword);
    
    if (userData.newsletter) {
      this.getNewsletterYesRadio().check();
    }
    
    this.getPrivacyPolicyCheckbox().check();
  }

  submitRegistration() {
    this.getContinueButton().click();
  }
}
```

## cypress/e2e/utils/RegistrationUtils.js
```javascript
export class RegistrationUtils {
  static generateUniqueEmail() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `testuser${timestamp}${random}@example.com`;
  }

  static generateValidUserData() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: this.generateUniqueEmail(),
      telephone: '1234567890',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      newsletter: true
    };
  }

  static generateInvalidUserData() {
    return {
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      telephone: '123',
      password: '123',
      confirmPassword: '456',
      newsletter: false
    };
  }

  static validatePasswordStrength(password) {
    const minLength = 4;
    const maxLength = 20;
    return password.length >= minLength && password.length <= maxLength;
  }

  static validatePhoneNumber(phone) {
    const phoneRegex = /^\d{3,15}$/;
    return phoneRegex.test(phone);
  }
}
```

## cypress/e2e/tests/TC_02_registration.cy.js
```javascript
import { RegisterPage } from '../pages/RegisterPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { AccountPage } from '../pages/AccountPage.js';
import { RegistrationUtils } from '../utils/RegistrationUtils.js';

describe('TC_02 - User Registration Functionality', () => {
  const registerPage = new RegisterPage();
  const loginPage = new LoginPage();
  const accountPage = new AccountPage();

  beforeEach(() => {
    registerPage.visit();
  });

  it('TC_02_001 - Should register successfully with valid data', () => {
    const userData = RegistrationUtils.generateValidUserData();
    
    registerPage.fillRegistrationForm(userData);
    registerPage.submitRegistration();
    
    cy.url().should('include', 'success');
    cy.contains('Your Account Has Been Created!').should('be.visible');
  });

  it('TC_02_002 - Should show error for empty required fields', () => {
    registerPage.getContinueButton().click();
    
    registerPage.getFieldError('firstname').should('contain', 'First Name must be between 1 and 32 characters!');
    registerPage.getFieldError('lastname').should('contain', 'Last Name must be between 1 and 32 characters!');
    registerPage.getFieldError('email').should('contain', 'E-Mail Address does not appear to be valid!');
    registerPage.getFieldError('telephone').should('contain', 'Telephone must be between 3 and 32 characters!');
  });

  it('TC_02_003 - Should show error for invalid email format', () => {
    const userData = RegistrationUtils.generateValidUserData();
    userData.email = 'invalid-email-format';
    
    registerPage.fillRegistrationForm(userData);
    registerPage.submitRegistration();
    
    registerPage.getFieldError('email').should('contain', 'E-Mail Address does not appear to be valid!');
  });

  it('TC_02_004 - Should show error for password mismatch', () => {
    const userData = RegistrationUtils.generateValidUserData();
    userData.confirmPassword = 'DifferentPassword123!';
    
    registerPage.fillRegistrationForm(userData);
    registerPage.submitRegistration();
    
    registerPage.getFieldError('confirm').should('contain', 'Password confirmation does not match password!');
  });

  it('TC_02_005 - Should show error for short password', () => {
    const userData = RegistrationUtils.generateValidUserData();
    userData.password = '123';
    userData.confirmPassword = '123';
    
    registerPage.fillRegistrationForm(userData);
    registerPage.submitRegistration();
    
    registerPage.getFieldError('password').should('contain', 'Password must be between 4 and 20 characters!');
  });

  it('TC_02_006 - Should show error when privacy policy not accepted', () => {
    const userData = RegistrationUtils.generateValidUserData();
    
    registerPage.getFirstNameInput().type(userData.firstName);
    registerPage.getLastNameInput().type(userData.lastName);
    registerPage.getEmailInput().type(userData.email);
    registerPage.getTelephoneInput().type(userData.telephone);
    registerPage.getPasswordInput().type(userData.password);
    registerPage.getConfirmPasswordInput().type(userData.confirmPassword);
    
    registerPage.submitRegistration();
    
    registerPage.getErrorMessage().should('contain', 'Warning: You must agree to the Privacy Policy!');
  });

  it('TC_02_007 - Should show error for duplicate email registration', () => {
    const userData = RegistrationUtils.generateValidUserData();
    userData.email = 'existing@example.com';
    
    registerPage.fillRegistrationForm(userData);
    registerPage.submitRegistration();
    
    registerPage.getErrorMessage().should('contain', 'Warning: E-Mail Address is already registered!');
  });

  it('TC_02_008 - Should validate telephone number length', () => {
    const userData = RegistrationUtils.generateValidUserData();
    userData.telephone = '12';
    
    registerPage.fillRegistrationForm(userData);
    registerPage.submitRegistration();
    
    registerPage.getFieldError('telephone').should('contain', 'Telephone must be between 3 and 32 characters!');
  });

  it('TC_02_009 - Should register with newsletter subscription', () => {
    const userData = RegistrationUtils.generateValidUserData();
    userData.newsletter = true;
    
    registerPage.fillRegistrationForm(userData);
    registerPage.getNewsletterYesRadio().should('be.checked');
    registerPage.submitRegistration();
    
    cy.url().should('include', 'success');
  });

  it('TC_02_010 - Should register without newsletter subscription', () => {
    const userData = RegistrationUtils.generateValidUserData();
    userData.newsletter = false;
    
    registerPage.fillRegistrationForm(userData);
    registerPage.getNewsletterNoRadio().check();
    registerPage.getNewsletterNoRadio().should('be.checked');
    registerPage.submitRegistration();
    
    cy.url().should('include', 'success');
  });
});
```
