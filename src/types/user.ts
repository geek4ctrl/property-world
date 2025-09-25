export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  preferences: UserPreferences;
  savedProperties: string[]; // Property IDs
  savedSearches: SavedSearch[];
  dateJoined: Date;
  lastLogin?: Date;
  isActive: boolean;
}

// Supabase-compatible user profile interface
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  role: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  priceAlerts: boolean;
  newListingAlerts: boolean;
  preferredCurrency: string;
  preferredLanguage: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: import('./property').SearchFilters;
  alertsEnabled: boolean;
  dateCreated: Date;
}

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  AGENT = 'agent',
  ADMIN = 'admin'
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isAuthenticated: boolean;
}