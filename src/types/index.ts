// Export all types from a central location
export * from './property';
export * from './user';

// Common UI component props
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
}

export interface PropertyInquiry extends ContactForm {
  inquiryType: 'viewing' | 'information' | 'offer';
  preferredContactTime?: string;
}