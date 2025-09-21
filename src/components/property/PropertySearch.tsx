'use client';

import { useState } from 'react';
import { PropertyType, ListingType, SearchFilters } from '@/types';

interface PropertySearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
  variant?: 'hero' | 'compact';
}

export default function PropertySearch({ 
  onSearch, 
  className = '', 
  variant = 'hero' 
}: PropertySearchProps) {
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
    { label: 'Any Price', min: undefined, max: undefined },
    { label: 'Under R500k', min: undefined, max: 500000 },
    { label: 'R500k - R1M', min: 500000, max: 1000000 },
    { label: 'R1M - R2M', min: 1000000, max: 2000000 },
    { label: 'R2M - R5M', min: 2000000, max: 5000000 },
    { label: 'Over R5M', min: 5000000, max: undefined },
  ];

  const bedroomOptions = [
    { label: 'Any', value: undefined },
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
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              filters.listingType === ListingType.FOR_SALE
                ? `${isCompact ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} shadow-sm`
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, listingType: ListingType.TO_RENT }))}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              filters.listingType === ListingType.TO_RENT
                ? `${isCompact ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} shadow-sm`
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rent
          </button>
        </div>

        {/* Search Fields */}
        <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          {/* Location */}
          <div>
            <label htmlFor="location-input" className={`block font-medium text-gray-700 mb-1 ${isCompact ? 'text-xs' : 'text-sm'}`}>
              Location
            </label>
            <input
              id="location-input"
              type="text"
              placeholder="City, suburb, or area"
              value={filters.location || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className={`w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isCompact ? 'py-2 text-sm' : 'py-2'}`}
            />
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="property-type-select" className={`block font-medium text-gray-700 mb-1 ${isCompact ? 'text-xs' : 'text-sm'}`}>
              Property Type
            </label>
            <select
              id="property-type-select"
              value={filters.propertyType?.[0] || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                propertyType: e.target.value ? [e.target.value as PropertyType] : []
              }))}
              className={`w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isCompact ? 'py-2 text-sm' : 'py-2'}`}
            >
              <option value="">Any Type</option>
              <option value={PropertyType.HOUSE}>House</option>
              <option value={PropertyType.APARTMENT}>Apartment</option>
              <option value={PropertyType.TOWNHOUSE}>Townhouse</option>
              <option value={PropertyType.FLAT}>Flat</option>
              <option value={PropertyType.COMMERCIAL}>Commercial</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label htmlFor="price-range-select" className={`block font-medium text-gray-700 mb-1 ${isCompact ? 'text-xs' : 'text-sm'}`}>
              Price Range
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
              className={`w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isCompact ? 'py-2 text-sm' : 'py-2'}`}
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
            <label htmlFor="bedrooms-select" className={`block font-medium text-gray-700 mb-1 ${isCompact ? 'text-xs' : 'text-sm'}`}>
              Bedrooms
            </label>
            <select
              id="bedrooms-select"
              value={filters.bedrooms || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                bedrooms: e.target.value ? parseInt(e.target.value) : undefined
              }))}
              className={`w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isCompact ? 'py-2 text-sm' : 'py-2'}`}
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
            className={`w-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg ${isCompact ? 'py-2.5 px-4 text-sm' : 'py-3 px-6'}`}
          >
            <svg className={`inline mr-2 ${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {isCompact ? 'Search' : 'Search Properties'}
          </button>
        </div>
      </form>
    </div>
  );
}