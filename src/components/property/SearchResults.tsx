'use client';

import { useState, useMemo } from 'react';
import { Property, SearchFilters } from '@/types';
// import { useTranslation } from '@/i18n/translation';
import PropertyGrid from './PropertyGrid';

interface SearchResultsProps {
  properties: Property[];
  filters: SearchFilters;
  loading: boolean;
  totalCount?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

type SortOption = 'date-desc' | 'date-asc' | 'price-asc' | 'price-desc' | 'size-desc' | 'size-asc' | 'relevance';
type ViewMode = 'grid' | 'list' | 'map';

export default function SearchResults({
  properties,
  filters,
  loading,
  totalCount,
  onLoadMore,
  hasMore = false,
  className = ''
}: SearchResultsProps) {

  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Sort options with labels
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant', icon: '🎯' },
    { value: 'date-desc', label: 'Newest First', icon: '📅' },
    { value: 'date-asc', label: 'Oldest First', icon: '📅' },
    { value: 'price-asc', label: 'Price: Low to High', icon: '💰' },
    { value: 'price-desc', label: 'Price: High to Low', icon: '💰' },
    { value: 'size-desc', label: 'Size: Largest First', icon: '📐' },
    { value: 'size-asc', label: 'Size: Smallest First', icon: '📐' },
  ] as const;

  // Sort properties based on selected option
  const sortedProperties = useMemo(() => {
    if (!properties.length) return properties;

    const sorted = [...properties];

    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
      
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
      
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      
      case 'size-desc':
        return sorted.sort((a, b) => (b.squareMeters || 0) - (a.squareMeters || 0));
      
      case 'size-asc':
        return sorted.sort((a, b) => (a.squareMeters || 0) - (b.squareMeters || 0));
      
      case 'relevance':
      default:
        // For relevance, we could implement a scoring system based on how well the property matches the search filters
        return sorted.sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;

          // Score based on location match
          if (filters.location) {
            const location = filters.location.toLowerCase();
            if (a.address.city.toLowerCase().includes(location) || a.address.suburb.toLowerCase().includes(location)) scoreA += 10;
            if (b.address.city.toLowerCase().includes(location) || b.address.suburb.toLowerCase().includes(location)) scoreB += 10;
          }

          // Score based on property type match
          if (filters.propertyType?.includes(a.propertyType)) scoreA += 5;
          if (filters.propertyType?.includes(b.propertyType)) scoreB += 5;

          // Score based on price range
          if (filters.minPrice && filters.maxPrice) {
            const priceRangeA = Math.abs(a.price - ((filters.minPrice + filters.maxPrice) / 2));
            const priceRangeB = Math.abs(b.price - ((filters.minPrice + filters.maxPrice) / 2));
            if (priceRangeA < priceRangeB) scoreA += 3;
            if (priceRangeB < priceRangeA) scoreB += 3;
          }

          return scoreB - scoreA;
        });
    }
  }, [properties, sortBy, filters]);

  // Get active filters summary
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.propertyType?.length) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.minSquareMeters || filters.maxSquareMeters) count++;
    return count;
  };

  // Format search summary
  const getSearchSummary = () => {
    const total = totalCount ?? properties.length;
    if (total === 0) return 'No properties found';
    if (total === properties.length) return `${total.toLocaleString()} properties found`;
    return `Showing ${properties.length.toLocaleString()} of ${total.toLocaleString()} properties`;
  };

  const currentSortOption = sortOptions.find(option => option.value === sortBy);

  if (loading && properties.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Results Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search Summary */}
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {getSearchSummary()}
            </h2>
            {getActiveFiltersCount() > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getActiveFiltersCount()} filters applied
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
              >
                <span className="text-sm">{currentSortOption?.icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  Sort: {currentSortOption?.label}
                </span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Sort Dropdown Menu */}
              {showSortDropdown && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                        sortBy === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Grid view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="List view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Map view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Content */}
      {sortedProperties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any properties matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Try removing some filters</p>
            <p>• Search in a broader area</p>
            <p>• Check your spelling</p>
          </div>
        </div>
      ) : (
        <>
          {/* Property Display */}
          {viewMode === 'grid' && (
            <PropertyGrid 
              properties={sortedProperties}
              loading={loading}
            />
          )}
          
          {viewMode === 'list' && (
            <div className="space-y-4">
              <PropertyGrid 
                properties={sortedProperties}
                loading={loading}
              />
            </div>
          )}

          {viewMode === 'map' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <svg className="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
              <p className="text-gray-600">Interactive map view coming soon!</p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={onLoadMore}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Load More Properties'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Click outside to close sort dropdown */}
      {showSortDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSortDropdown(false)}
        />
      )}
    </div>
  );
}