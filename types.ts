
import React from 'react';

// Re-export new types
export * from './types/tool-type';
export * from './types/nav-item';

// Auth & User Types
export type Role = 'student' | 'attorney' | 'admin';
export type SubscriptionTier = 'free' | 'premium' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  subscription: SubscriptionTier;
  quotaUsed: number;
  quotaLimit: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalGenerations: number;
  revenue: number;
  systemHealth: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  action: string;
  details: string;
}

export interface QueueJob {
  id: string;
  type: string;
  status: 'active' | 'completed' | 'failed' | 'waiting';
  progress: number;
  result?: any;
  error?: string;
}

// Legal Document Types
export interface LegalDocument {
  id: string;
  title: string;
  type: any; 
  content: string;
  createdAt: number;
  folderId?: string;
  tags: string[];
}

export interface LegalFolder {
  id: string;
  name: string;
  parentId?: string;
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
