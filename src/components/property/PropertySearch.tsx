'use client';

import { useState } from 'react';
import { PropertyType, ListingType, SearchFilters } from '@/types';
import { useTranslation } from '@/i18n/translation';

interface PropertySearchProps {
  readonly onSearch: (filters: SearchFilters) => void;
  readonly className?: string;
  readonly variant?: 'hero' | 'compact';
  readonly loading?: boolean;
}

// Helper functions to reduce complexity
const getTabButtonClasses = (isActive: boolean, isCompact: boolean) => {
  const baseClasses = 'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors';
  if (isActive) {
    const activeClasses = isCompact ? 'bg-blue-600 text-white' : 'bg-white text-blue-600';
    return `${baseClasses} ${activeClasses} shadow-sm`;
  }
  return `${baseClasses} text-gray-600 hover:text-gray-900`;
};

const getInputClasses = (isCompact: boolean) => {
  const baseClasses = 'w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const sizeClasses = isCompact ? 'py-2 text-sm' : 'py-2';
  return `${baseClasses} ${sizeClasses}`;
};

const getLabelClasses = (isCompact: boolean) => {
  const baseClasses = 'block font-medium text-gray-700 mb-1';
  const sizeClasses = isCompact ? 'text-xs' : 'text-sm';
  return `${baseClasses} ${sizeClasses}`;
};

const getButtonClasses = (isCompact: boolean) => {
  const baseClasses = 'w-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg';
  const sizeClasses = isCompact ? 'py-2.5 px-4 text-sm' : 'py-3 px-6';
  return `${baseClasses} ${sizeClasses}`;
};

const getIconClasses = (isCompact: boolean) => {
  const baseClasses = 'inline mr-2';
  const sizeClasses = isCompact ? 'w-4 h-4' : 'w-5 h-5';
  return `${baseClasses} ${sizeClasses}`;
};

export default function PropertySearch({ 
  onSearch, 
  className = '', 
  variant = 'hero' 
}: PropertySearchProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    listingType: ListingType.FOR_SALE,
    propertyType: [],
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const priceRanges = [
    { label: t('search.any_price'), min: undefined, max: undefined },
    { label: t('search.under_500k'), min: undefined, max: 500000 },
    { label: t('search.500k_1m'), min: 500000, max: 1000000 },
    { label: t('search.1m_2m'), min: 1000000, max: 2000000 },
    { label: t('search.2m_5m'), min: 2000000, max: 5000000 },
    { label: t('search.over_5m'), min: 5000000, max: undefined },
  ];

  const bedroomOptions = [
    { label: t('search.any'), value: undefined },
    { label: '1+', value: 1 },
    { label: '2+', value: 2 },
    { label: '3+', value: 3 },
    { label: '4+', value: 4 },
    { label: '5+', value: 5 },
  ];

  const isCompact = variant === 'compact';

  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubmit} className={`${isCompact ? '' : 'bg-white rounded-lg shadow-lg p-6 border'}`}>
        {/* Listing Type Tabs */}
        <div className={`flex mb-4 ${isCompact ? 'bg-gray-50' : 'bg-gray-100'} rounded-lg p-1`}>
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, listingType: ListingType.FOR_SALE }))}
            className={getTabButtonClasses(filters.listingType === ListingType.FOR_SALE, isCompact)}
          >
            {t('navigation.buy')}
          </button>
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, listingType: ListingType.TO_RENT }))}
            className={getTabButtonClasses(filters.listingType === ListingType.TO_RENT, isCompact)}
          >
            {t('navigation.rent')}
          </button>
        </div>

        {/* Search Fields */}
        <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          {/* Location */}
          <div>
            <label htmlFor="location-input" className={getLabelClasses(isCompact)}>
              {t('common.location')}
            </label>
            <input
              id="location-input"
              type="text"
              placeholder={t('search.city_suburb_area')}
              value={filters.location || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className={getInputClasses(isCompact)}
            />
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="property-type-select" className={getLabelClasses(isCompact)}>
              {t('common.property_type')}
            </label>
            <select
              id="property-type-select"
              value={filters.propertyType?.[0] || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                propertyType: e.target.value ? [e.target.value as PropertyType] : []
              }))}
              className={getInputClasses(isCompact)}
            >
              <option value="">{t('search.any_type')}</option>
              <option value={PropertyType.HOUSE}>{t('property.house')}</option>
              <option value={PropertyType.APARTMENT}>{t('property.apartment')}</option>
              <option value={PropertyType.TOWNHOUSE}>{t('property.townhouse')}</option>
              <option value={PropertyType.FLAT}>{t('property.flat')}</option>
              <option value={PropertyType.COMMERCIAL}>{t('property.commercial')}</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label htmlFor="price-range-select" className={getLabelClasses(isCompact)}>
              {t('common.price')}
            </label>
            <select
              id="price-range-select"
              onChange={(e) => {
                const selectedRange = priceRanges[parseInt(e.target.value)];
                setFilters(prev => ({
                  ...prev,
                  minPrice: selectedRange.min,
                  maxPrice: selectedRange.max
                }));
              }}
              className={getInputClasses(isCompact)}
            >
              {priceRanges.map((range, index) => (
                <option key={`price-range-${range.label}`} value={index}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label htmlFor="bedrooms-select" className={getLabelClasses(isCompact)}>
              {t('common.bedrooms')}
            </label>
            <select
              id="bedrooms-select"
              value={filters.bedrooms || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                bedrooms: e.target.value ? parseInt(e.target.value) : undefined
              }))}
              className={getInputClasses(isCompact)}
            >
              {bedroomOptions.map((option) => (
                <option key={`bedroom-${option.label}`} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className={isCompact ? 'mt-4' : 'mt-6'}>
          <button
            type="submit"
            className={getButtonClasses(isCompact)}
          >
            <svg className={getIconClasses(isCompact)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {isCompact ? t('common.search') : t('search.search_properties')}
          </button>
        </div>
      </form>
    </div>
  );
}