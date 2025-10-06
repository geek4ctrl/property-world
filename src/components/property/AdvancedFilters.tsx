'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchFilters, PropertyType, ListingType } from '@/types';

interface AdvancedFiltersProps {
  readonly filters: SearchFilters;
  readonly onFiltersChange: (filters: SearchFilters) => void;
  readonly onClose?: () => void;
  readonly className?: string;
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
    <div className={`bg-white/90 backdrop-blur-sm/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <svg className="w-6 h-6 mr-3 text-blue-600 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Advanced Filters
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Location with Autocomplete */}
        <div>
          <label htmlFor="location-autocomplete" className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
          <div className="relative" ref={locationInputRef}>
            <input
              id="location-autocomplete"
              type="text"
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                updateFilters({ location: e.target.value });
                setShowLocationSuggestions(true);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              placeholder="City, suburb, or area..."
              className="w-full px-4 py-4 border-2 border-black rounded-xl bg-white/90 backdrop-blur-sm/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none hover:border-gray-800 hover:bg-white/90 backdrop-blur-sm hover:shadow-md transition-all duration-300"
            />
            <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            
            {showLocationSuggestions && filteredLocations.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white/90 backdrop-blur-sm/95 backdrop-blur-lg border border-gray-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                {filteredLocations.map((location, index) => (
                  <button
                    key={`location-${location}-${index}`}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-4 py-4 hover:bg-blue-50 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl hover:scale-[1.02] transform"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="text-sm text-gray-800">{location}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Listing Type */}
        <div>
          <span className="block text-sm font-semibold text-gray-900 mb-3">Listing Type</span>
          <div className="flex gap-3">
            {[
              { value: undefined, label: 'All', color: 'gray' },
              { value: ListingType.FOR_SALE, label: 'For Sale', color: 'green' },
              { value: ListingType.TO_RENT, label: 'To Rent', color: 'blue' },
            ].map(({ value, label, color }) => (
              <button
                key={label}
                onClick={() => updateFilters({ listingType: value })}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  localFilters.listingType === value
                    ? `bg-${color}-100 text-${color}-800 ring-2 ring-${color}-500`
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Property Types */}
        <div>
          <span className="block text-sm font-semibold text-gray-900 mb-3">Property Type</span>
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
                  className={`px-4 py-3 text-sm font-medium rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50'
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
          <span className="block text-sm font-semibold text-gray-900 mb-3">Price Range</span>
          <div className="space-y-2">
            {PRICE_RANGES.map((range, index) => (
              <button
                key={`price-range-${range.min}-${range.max}-${index}`}
                onClick={() => updateFilters({ minPrice: range.min, maxPrice: range.max })}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  selectedPriceRange === range
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          {/* Custom Price Range */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="min-price-advanced" className="block text-xs text-gray-800 mb-1">Min Price (R)</label>
              <input
                id="min-price-advanced"
                type="number"
                placeholder="0"
                value={localFilters.minPrice || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  updateFilters({ minPrice: value });
                }}
                className="w-full px-4 py-3 border-2 border-black rounded-xl text-sm bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none hover:border-gray-800 hover:bg-white hover:shadow-md transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="max-price-advanced" className="block text-xs text-gray-800 mb-1">Max Price (R)</label>
              <input
                id="max-price-advanced"
                type="number"
                placeholder="No limit"
                value={localFilters.maxPrice || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  updateFilters({ maxPrice: value });
                }}
                className="w-full px-4 py-3 border-2 border-black rounded-xl text-sm bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none hover:border-gray-800 hover:bg-white hover:shadow-md transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="bedrooms-advanced" className="block text-sm font-semibold text-gray-900 mb-2">Min Bedrooms</label>
            <select
              id="bedrooms-advanced"
              value={localFilters.bedrooms || ''}
              onChange={(e) => updateFilters({ 
                bedrooms: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              className="w-full px-4 py-4 border-2 border-black rounded-xl bg-white text-gray-900 font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none hover:border-gray-800 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}+</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bathrooms-advanced" className="block text-sm font-semibold text-gray-900 mb-2">Min Bathrooms</label>
            <select
              id="bathrooms-advanced"
              value={localFilters.bathrooms || ''}
              onChange={(e) => updateFilters({ 
                bathrooms: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              className="w-full px-4 py-4 border-2 border-black rounded-xl bg-white text-gray-900 font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none hover:border-gray-800 hover:bg-white hover:shadow-md transition-all duration-300"
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
          <span className="block text-sm font-semibold text-gray-900 mb-3">Property Size (m²)</span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                placeholder="Min size"
                value={localFilters.minSquareMeters || ''}
                onChange={(e) => updateFilters({ 
                  minSquareMeters: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="w-full px-4 py-4 border-2 border-black rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none hover:border-gray-800 hover:bg-white hover:shadow-md transition-all duration-300"
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
                className="w-full px-4 py-4 border-2 border-black rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none hover:border-gray-800 hover:bg-white hover:shadow-md transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <span className="block text-sm font-semibold text-gray-900 mb-3">Features</span>
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
                  className={`px-4 py-3 text-xs font-medium rounded-xl border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50'
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
            className="flex-1 px-4 py-3 text-gray-800 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Clear All
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}