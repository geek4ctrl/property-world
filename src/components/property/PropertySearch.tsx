'use client';

import { useState } from 'react';
import { PropertyType, ListingType, SearchFilters } from '@/types';
import { useTranslation } from '@/i18n/translation';
import { Button, Input, Select } from '@/components/ui/FormComponents';

interface PropertySearchProps {
  readonly onSearch: (filters: SearchFilters) => void;
  readonly className?: string;
  readonly variant?: 'hero' | 'compact' | 'vertical';
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
  const baseClasses = 'w-full px-3 border-2 border-gray-500 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:border-gray-600';
  const sizeClasses = isCompact ? 'py-2 text-sm' : 'py-2';
  return `${baseClasses} ${sizeClasses}`;
};

const getLabelClasses = (isCompact: boolean) => {
  const baseClasses = 'block font-medium text-gray-900 mb-1';
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
  const isVertical = variant === 'vertical';
  const isHero = variant === 'hero';

  // Dynamic container classes based on variant
  const getContainerClasses = () => {
    if (isVertical) return 'w-full max-w-3xl mx-auto';
    if (isHero) return 'w-full max-w-5xl mx-auto';
    return 'w-full max-w-4xl mx-auto';
  };

  const getFormClasses = () => {
    if (isCompact) return 'w-full space-y-4';
    if (isVertical) return 'w-full p-6';
    return 'bg-white rounded-lg shadow-lg p-8 border w-full';
  };

  const getFieldsLayout = () => {
    if (isVertical) return 'space-y-5';
    if (isCompact) return 'space-y-4';
    return 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      <form onSubmit={handleSubmit} className={getFormClasses()}>
        {/* Listing Type Tabs */}
        <div className={`flex justify-center ${isVertical ? 'mb-6' : 'mb-4'} ${isCompact ? 'bg-gray-50' : 'bg-gray-100'} rounded-lg p-1 max-w-md mx-auto`}>
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, listingType: ListingType.FOR_SALE }))}
            className={`${getTabButtonClasses(filters.listingType === ListingType.FOR_SALE, isCompact)} btn-animated hover-scale`}
          >
            {t('navigation.buy')}
          </button>
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, listingType: ListingType.TO_RENT }))}
            className={`${getTabButtonClasses(filters.listingType === ListingType.TO_RENT, isCompact)} btn-animated hover-scale`}
          >
            {t('navigation.rent')}
          </button>
        </div>

        {/* Search Fields */}
        <div className={getFieldsLayout()}>
          {/* Location */}
          <Input
            label={t('common.location')}
            placeholder={t('search.city_suburb_area')}
            value={filters.location || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />

          {/* Property Type */}
          <Select
            label={t('common.property_type')}
            value={filters.propertyType?.[0] || ''}
            placeholder={t('search.any_type')}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              propertyType: e.target.value ? [e.target.value as PropertyType] : []
            }))}
            options={[
              { value: '', label: t('search.any_type') },
              { value: PropertyType.HOUSE, label: t('property.house') },
              { value: PropertyType.APARTMENT, label: t('property.apartment') },
              { value: PropertyType.TOWNHOUSE, label: t('property.townhouse') },
              { value: PropertyType.FLAT, label: t('property.flat') },
              { value: PropertyType.COMMERCIAL, label: t('property.commercial') }
            ]}
          />

          {/* Price Range */}
          <Select
            label={t('common.price')}
            placeholder={t('search.any_price')}
            onChange={(e) => {
              const selectedRange = priceRanges[parseInt(e.target.value)];
              setFilters(prev => ({
                ...prev,
                minPrice: selectedRange.min,
                maxPrice: selectedRange.max
              }));
            }}
            options={priceRanges.map((range, index) => ({
              value: index.toString(),
              label: range.label
            }))}
          />

          {/* Bedrooms */}
          <Select
            label={t('common.bedrooms')}
            value={filters.bedrooms?.toString() || ''}
            placeholder={t('search.any')}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              bedrooms: e.target.value ? parseInt(e.target.value) : undefined
            }))}
            options={bedroomOptions.map((option) => ({
              value: option.value?.toString() || '',
              label: option.label
            }))}
          />
        </div>

        {/* Search Button */}
        <div className={`${isCompact ? 'mt-4' : isVertical ? 'mt-8' : 'mt-6'} flex justify-center`}>
          <Button
            type="submit"
            className={`${isCompact ? 'w-full' : isVertical ? 'w-full max-w-md' : 'w-full sm:w-auto px-8'}`}
            size={isCompact ? 'md' : 'lg'}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          >
            {isCompact ? t('common.search') : t('search.search_properties')}
          </Button>
        </div>
      </form>
    </div>
  );
}