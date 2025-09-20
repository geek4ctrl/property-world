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