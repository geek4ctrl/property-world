'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchFilters, PropertyType, ListingType } from '@/types';

interface AdvancedFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClose?: () => void;
  className?: string;
}

const PRICE_RANGES = [
  { label: 'Any Price', min: undefined, max: undefined },
  { label: 'Under R500K', min: undefined, max: 500000 },
  { label: 'R500K - R1M', min: 500000, max: 1000000 },
  { label: 'R1M - R2M', min: 1000000, max: 2000000 },
  { label: 'R2M - R5M', min: 2000000, max: 5000000 },
  { label: 'R5M - R10M', min: 5000000, max: 10000000 },
  { label: 'Over R10M', min: 10000000, max: undefined },
];

const PROPERTY_FEATURES = [
  'Swimming Pool',
  'Garden',
  'Garage',
  'Security',
  'Air Conditioning',
  'Fireplace',
  'Balcony',
  'Study Room',
  'Guest Cottage',
  'Solar Power',
  'Alarm System',
  'Electric Fence',
  'Fiber Internet',
  'Generator',
  'Water Tank',
  'Borehole',
  'Tennis Court',
  'Gym',
  'Sauna',
  'Wine Cellar',
];

const POPULAR_LOCATIONS = [
  'Sandton, Johannesburg',
  'Camps Bay, Cape Town',
  'Waterfront, Cape Town',
  'Umhlanga, Durban',
  'Stellenbosch, Western Cape',
  'Pretoria East, Pretoria',
  'Ballito, KwaZulu-Natal',
  'Somerset West, Western Cape',
  'Centurion, Gauteng',
  'Rosebank, Johannesburg',
];

export default function AdvancedFilters({ 
  filters, 
  onFiltersChange, 
  onClose, 
  className = '' 
}: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationQuery, setLocationQuery] = useState(filters.location || '');
  const locationInputRef = useRef<HTMLInputElement>(null);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleLocationSelect = (location: string) => {
    setLocationQuery(location);
    updateFilters({ location });
    setShowLocationSuggestions(false);
  };

  const filteredLocations = POPULAR_LOCATIONS.filter(location =>
    location.toLowerCase().includes(locationQuery.toLowerCase())
  );

  const handleReset = () => {
    setLocalFilters({});
    setLocationQuery('');
    onFiltersChange({});
  };

  const selectedPriceRange = PRICE_RANGES.find(range => 
    range.min === localFilters.minPrice && range.max === localFilters.maxPrice
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Advanced Filters
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Location with Autocomplete */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
          <div className="relative" ref={locationInputRef}>
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                updateFilters({ location: e.target.value });
                setShowLocationSuggestions(true);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              placeholder="City, suburb, or area..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            
            {showLocationSuggestions && filteredLocations.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredLocations.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">{location}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Listing Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Listing Type</label>
          <div className="flex gap-3">
            {[
              { value: undefined, label: 'All', color: 'gray' },
              { value: ListingType.FOR_SALE, label: 'For Sale', color: 'green' },
              { value: ListingType.TO_RENT, label: 'To Rent', color: 'blue' },
            ].map(({ value, label, color }) => (
              <button
                key={label}
                onClick={() => updateFilters({ listingType: value })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  localFilters.listingType === value
                    ? `bg-${color}-100 text-${color}-800 ring-2 ring-${color}-500`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Property Types */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Property Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.values(PropertyType).map((type) => {
              const isSelected = localFilters.propertyType?.includes(type) || false;
              return (
                <button
                  key={type}
                  onClick={() => {
                    const currentTypes = localFilters.propertyType || [];
                    const newTypes = isSelected
                      ? currentTypes.filter(t => t !== type)
                      : [...currentTypes, type];
                    updateFilters({ propertyType: newTypes.length > 0 ? newTypes : undefined });
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Price Range</label>
          <div className="space-y-2">
            {PRICE_RANGES.map((range, index) => (
              <button
                key={index}
                onClick={() => updateFilters({ minPrice: range.min, maxPrice: range.max })}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  selectedPriceRange === range
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          {/* Custom Price Range */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min Price (R)</label>
              <input
                type="number"
                placeholder="0"
                value={localFilters.minPrice || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  updateFilters({ minPrice: value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Price (R)</label>
              <input
                type="number"
                placeholder="No limit"
                value={localFilters.maxPrice || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  updateFilters({ maxPrice: value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Min Bedrooms</label>
            <select
              value={localFilters.bedrooms || ''}
              onChange={(e) => updateFilters({ 
                bedrooms: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}+</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Min Bathrooms</label>
            <select
              value={localFilters.bathrooms || ''}
              onChange={(e) => updateFilters({ 
                bathrooms: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}+</option>
              ))}
            </select>
          </div>
        </div>

        {/* Property Size */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Property Size (m²)</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                placeholder="Min size"
                value={localFilters.minSquareMeters || ''}
                onChange={(e) => updateFilters({ 
                  minSquareMeters: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max size"
                value={localFilters.maxSquareMeters || ''}
                onChange={(e) => updateFilters({ 
                  maxSquareMeters: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Features</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {PROPERTY_FEATURES.map((feature) => {
              const isSelected = localFilters.features?.includes(feature) || false;
              return (
                <button
                  key={feature}
                  onClick={() => {
                    const currentFeatures = localFilters.features || [];
                    const newFeatures = isSelected
                      ? currentFeatures.filter(f => f !== feature)
                      : [...currentFeatures, feature];
                    updateFilters({ features: newFeatures.length > 0 ? newFeatures : undefined });
                  }}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {feature}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Clear All
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}