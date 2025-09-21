export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: PropertyType;
  listingType: ListingType;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  squareMeters: number;
  erfSize?: number; // Land size in square meters
  address: Address;
  images: PropertyImage[];
  features: string[];
  agent: Agent;
  dateAdded: Date;
  dateUpdated: Date;
  isActive: boolean;
  isFeatured: boolean;
  isNew?: boolean;
  views: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Address {
  street: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  agency: string;
  profileImage?: string;
  bio?: string;
  licenseNumber?: string;
}

export interface SearchFilters {
  query?: string;
  propertyType?: PropertyType[];
  listingType?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  minSquareMeters?: number;
  maxSquareMeters?: number;
  features?: string[];
}

export interface SearchResult {
  properties: Property[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  TOWNHOUSE = 'townhouse',
  FLAT = 'flat',
  VACANT_LAND = 'vacant_land',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  FARM = 'farm',
  OFFICE = 'office',
  RETAIL = 'retail'
}

export enum ListingType {
  FOR_SALE = 'for_sale',
  TO_RENT = 'to_rent',
  SOLD = 'sold',
  RENTED = 'rented'
}

export enum PriceRange {
  UNDER_500K = 'under_500k',
  RANGE_500K_1M = '500k_1m',
  RANGE_1M_2M = '1m_2m',
  RANGE_2M_5M = '2m_5m',
  OVER_5M = 'over_5m'
}