/// <reference types="cypress" />

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/#login');
  });

  it('should allow admin login via quick fill', () => {
    // Check Dev Ops panel exists
    cy.contains('DEV OPS ACCESS').should('be.visible');
    
    // Auto-fill
    cy.get('button').contains('Auto-fill').click();
    
    // Inputs should be filled
    cy.get('input[type="email"]').should('have.value', 'admin@legalph.com');
    
    // Login
    cy.get('button').contains('Sign In').click();
    
    // Should redirect to dashboard
    cy.contains('Admin Control Center').should('be.visible');
  });

  it('should show error on invalid credentials', () => {
    cy.get('input[type="email"]').type('wrong@test.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button').contains('Sign In').click();
    
    cy.contains('Invalid credentials').should('be.visible');
  });
});