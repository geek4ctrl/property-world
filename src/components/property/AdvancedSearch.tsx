'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyType, ListingType, SearchFilters } from '@/types';
import { useTranslation } from '@/i18n/translation';
import { sampleProperties } from '@/data/sampleProperties';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
  showSaveSearch?: boolean;
  className?: string;
}

interface LocationSuggestion {
  id: string;
  name: string;
  type: 'city' | 'suburb' | 'area';
  province?: string;
  count?: number;
}

interface PriceRange {
  label: string;
  min?: number;
  max?: number;
}

export default function AdvancedSearch({ 
  onSearch, 
  initialFilters = {}, 
  showSaveSearch = false,
  className = '' 
}: AdvancedSearchProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [savedSearchName, setSavedSearchName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Price ranges for South African market
  const priceRanges: PriceRange[] = [
    { label: t('search.any_price'), min: undefined, max: undefined },
    { label: t('search.under_500k'), min: undefined, max: 500000 },
    { label: t('search.500k_750k'), min: 500000, max: 750000 },
    { label: t('search.750k_1m'), min: 750000, max: 1000000 },
    { label: t('search.1m_1_5m'), min: 1000000, max: 1500000 },
    { label: t('search.1_5m_2m'), min: 1500000, max: 2000000 },
    { label: t('search.2m_3m'), min: 2000000, max: 3000000 },
    { label: t('search.3m_5m'), min: 3000000, max: 5000000 },
    { label: t('search.5m_10m'), min: 5000000, max: 10000000 },
    { label: t('search.over_10m'), min: 10000000, max: undefined },
  ];

  // Property type options with icons
  const propertyTypes = [
    { value: PropertyType.HOUSE, label: t('property.house'), icon: '🏠' },
    { value: PropertyType.APARTMENT, label: t('property.apartment'), icon: '🏢' },
    { value: PropertyType.TOWNHOUSE, label: t('property.townhouse'), icon: '🏘️' },
    { value: PropertyType.FLAT, label: t('property.flat'), icon: '🏠' },
    { value: PropertyType.VACANT_LAND, label: t('property.vacant_land'), icon: '🌍' },
    { value: PropertyType.COMMERCIAL, label: t('property.commercial'), icon: '🏢' },
  ];

  // Generate location suggestions based on sample data
  const generateLocationSuggestions = useCallback((query: string): LocationSuggestion[] => {
    if (!query || query.length < 2) return [];

    const locations = new Map<string, LocationSuggestion>();
    
    sampleProperties.forEach(property => {
      const { city, suburb, province } = property.address;
      
      // Add city suggestions
      if (city.toLowerCase().includes(query.toLowerCase())) {
        const key = `${city}-${province}`;
        if (!locations.has(key)) {
          locations.set(key, {
            id: key,
            name: city,
            type: 'city',
            province,
            count: 1
          });
        } else {
          const existing = locations.get(key)!;
          existing.count = (existing.count || 0) + 1;
        }
      }

      // Add suburb suggestions
      if (suburb.toLowerCase().includes(query.toLowerCase())) {
        const key = `${suburb}-${city}`;
        if (!locations.has(key)) {
          locations.set(key, {
            id: key,
            name: `${suburb}, ${city}`,
            type: 'suburb',
            province,
            count: 1
          });
        } else {
          const existing = locations.get(key)!;
          existing.count = (existing.count || 0) + 1;
        }
      }
    });

    return Array.from(locations.values())
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 8);
  }, []);

  // Handle location input changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.location) {
        const suggestions = generateLocationSuggestions(filters.location);
        setLocationSuggestions(suggestions);
        setShowLocationDropdown(suggestions.length > 0);
      } else {
        setLocationSuggestions([]);
        setShowLocationDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters.location, generateLocationSuggestions]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Handle property type selection (multiple)
  const handlePropertyTypeToggle = useCallback((type: PropertyType) => {
    setFilters(prev => {
      const currentTypes = prev.propertyType || [];
      const updatedTypes = currentTypes.includes(type)
        ? currentTypes.filter(t => t !== type)
        : [...currentTypes, type];
      
      return {
        ...prev,
        propertyType: updatedTypes.length > 0 ? updatedTypes : undefined
      };
    });
  }, []);

  // Handle price range selection
  const handlePriceRangeChange = useCallback((range: PriceRange) => {
    setFilters(prev => ({
      ...prev,
      minPrice: range.min,
      maxPrice: range.max
    }));
  }, []);

  // Submit search
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.location) params.set('location', filters.location);
    if (filters.listingType) params.set('listing', filters.listingType);
    if (filters.propertyType && filters.propertyType.length > 0) {
      params.set('types', filters.propertyType.join(','));
    }
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms.toString());

    router.push(`/properties?${params.toString()}`, { scroll: false });
  }, [filters, onSearch, router]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      query: '',
      location: '',
      listingType: ListingType.FOR_SALE,
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
    router.push('/properties', { scroll: false });
  }, [onSearch, router]);

  // Save search functionality
  const handleSaveSearch = useCallback(() => {
    if (!savedSearchName.trim()) return;
    
    // In a real app, this would save to the backend
    const savedSearch = {
      name: savedSearchName,
      filters,
      createdAt: new Date().toISOString()
    };
    
    // For demo, save to localStorage
    if (typeof window !== 'undefined') {
      const existingSaved = JSON.parse(localStorage.getItem('savedSearches') || '[]');
      existingSaved.push(savedSearch);
      localStorage.setItem('savedSearches', JSON.stringify(existingSaved));
    }
    
    setShowSaveModal(false);
    setSavedSearchName('');
    
    // Show success message (you could use a toast here)
    alert('Search saved successfully!');
  }, [savedSearchName, filters]);

  // Get selected price range for display
  const getSelectedPriceRange = () => {
    return priceRanges.find(range => 
      range.min === filters.minPrice && range.max === filters.maxPrice
    );
  };

  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'query' || key === 'location') return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== '';
  }).length;

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      <form onSubmit={handleSubmit} className="p-6">
        {/* Main Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Query */}
          <div className="flex-1">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('search.search_properties')}
                value={filters.query || ''}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Location with Autocomplete */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={t('search.city_suburb_area')}
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              onFocus={() => setShowLocationDropdown(locationSuggestions.length > 0)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>

            {/* Location Suggestions Dropdown */}
            {showLocationDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {locationSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => {
                      handleFilterChange('location', suggestion.name);
                      setShowLocationDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{suggestion.name}</div>
                      {suggestion.province && (
                        <div className="text-sm text-gray-500">{suggestion.province}</div>
                      )}
                    </div>
                    {suggestion.count && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {suggestion.count} properties
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Listing Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleFilterChange('listingType', ListingType.FOR_SALE)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filters.listingType === ListingType.FOR_SALE
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {t('property.for_sale')}
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('listingType', ListingType.TO_RENT)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filters.listingType === ListingType.TO_RENT
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {t('property.to_rent')}
            </button>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('common.search')}
          </button>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <span>{t('search.advanced_filters')}</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                {activeFiltersCount}
              </span>
            )}
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {t('search.clear_all_filters')}
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t border-gray-200">
            {/* Property Types */}
            <fieldset>
              <legend className="block text-sm font-medium text-gray-900 mb-3">
                {t('common.property_type')}
              </legend>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {propertyTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handlePropertyTypeToggle(type.value)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      filters.propertyType?.includes(type.value)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-black text-gray-700'
                    }`}
                  >
                    <div className="text-lg mb-1">{type.icon}</div>
                    <div>{type.label}</div>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Price Range */}
            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-900 mb-3">
                  {t('common.price')} Range
                </legend>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={`price-${range.min || 0}-${range.max || 'max'}`}
                    type="button"
                    onClick={() => handlePriceRangeChange(range)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      getSelectedPriceRange() === range
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-black text-gray-700'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
                </div>
              </fieldset>
            </div>

            {/* Bedrooms and Bathrooms */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="bedrooms-select" className="block text-sm font-medium text-gray-900 mb-2">
                  {t('common.bedrooms')}
                </label>
                <select
                  id="bedrooms-select"
                  value={filters.bedrooms || ''}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('search.any')}</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div>
                <label htmlFor="bathrooms-select" className="block text-sm font-medium text-gray-900 mb-2">
                  {t('common.bathrooms')}
                </label>
                <select
                  id="bathrooms-select"
                  value={filters.bathrooms || ''}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('search.any')}</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            {/* Square Meters Range */}
            <fieldset className="animate-fadeInUp" style={{ animationDelay: '400ms' }}>
              <legend className="flex items-center space-x-2 text-lg font-bold text-gray-900 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full"></div>
                <span>{t('search.property_size_sqm')}</span>
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <input
                    type="number"
                    placeholder={t('search.min_size')}
                    value={filters.minSquareMeters || ''}
                    onChange={(e) => handleFilterChange('minSquareMeters', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="group">
                  <input
                    type="number"
                    placeholder={t('search.max_size')}
                    value={filters.maxSquareMeters || ''}
                    onChange={(e) => handleFilterChange('maxSquareMeters', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </fieldset>

            {/* Save Search */}
            {showSaveSearch && (
              <div className="pt-6 border-t border-gradient-to-r from-blue-200/30 to-purple-200/30 animate-fadeInUp" style={{ animationDelay: '500ms' }}>
                <button
                  type="button"
                  onClick={() => setShowSaveModal(true)}
                  className="group flex items-center space-x-3 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 text-amber-700 hover:text-amber-800 font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 hover:from-amber-100 hover:to-orange-100"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>{t('search.save_this_search')}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-card bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideDown border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-2xl"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <span>{t('search.save_search')}</span>
              </h3>
              <div className="mb-6">
                <label htmlFor="search-name-input" className="block text-lg font-semibold text-gray-700 mb-3">
                  {t('search.search_name')}
                </label>
                <input
                  id="search-name-input"
                  type="text"
                  value={savedSearchName}
                  onChange={(e) => setSavedSearchName(e.target.value)}
                  placeholder={t('search.search_name_placeholder')}
                  className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:shadow-md"
                >
                  {t('search.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleSaveSearch}
                  disabled={!savedSearchName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {t('search.save_search')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close location dropdown */}
      {showLocationDropdown && (
        <button
          className="fixed inset-0 z-40 bg-transparent border-none cursor-default"
          onClick={() => setShowLocationDropdown(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowLocationDropdown(false);
            }
          }}
          aria-label="Close location dropdown"
        />
      )}
    </div>
  );
}