
import React from 'react';

// Re-export new types
export * from './types/tool-type';
export * from './types/nav-item';

// Auth & User Types
export type Role = 'student' | 'attorney' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  subscription: 'free' | 'premium' | 'enterprise';
  quotaUsed: number;
  quotaLimit: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Keep existing interface definitions
export interface LegalDocument {
  id: string;
  title: string;
  type: any; 
  content: string;
  createdAt: number;
  tags: string[];
}

export interface MockBarConfig {
  difficulty: 'Easy' | 'Moderate' | 'Difficult';
  subject: string;
  type: 'Essay' | 'Issue-Spotting' | 'Situational';
}

export interface ContractConfig {
  type: 'Lease' | 'Sale' | 'Employment' | 'Service' | 'Custom';
  parties: string;
  terms: string;
  customClauses?: string;
}
