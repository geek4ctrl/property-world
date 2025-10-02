'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdvancedSearch from '@/components/property/AdvancedSearch';
import SearchResults from '@/components/property/SearchResults';
import SavedSearchesManager from '@/components/property/SavedSearchesManager';
import { PropertyErrorBoundary, SearchErrorBoundary } from '@/components/ui/SpecializedErrorBoundaries';
import { SearchFilters, Property, PropertyType, ListingType } from '@/types';
import { sampleProperties } from '@/data/sampleProperties';
import { filterProperties } from '@/lib/utils';

const SEARCH_DELAY = 300;

// Component that uses useSearchParams
function PropertiesContent() {
  const searchParams = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showSavedSearches, setShowSavedSearches] = useState(false);

  const handleSearch = useCallback((searchFilters: SearchFilters) => {
    setLoading(true);
    setFilters(searchFilters);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = filterProperties(sampleProperties, searchFilters);
      setFilteredProperties(filtered);
      setLoading(false);
    }, SEARCH_DELAY);
  }, []);

  // Helper function to parse URL parameters
  const parseUrlFilters = useCallback((params: URLSearchParams): SearchFilters => {
    const urlFilters: SearchFilters = {};
    
    const typeParam = params.get('type');
    if (typeParam) {
      urlFilters.propertyType = [typeParam as PropertyType];
    }
    
    const listingParam = params.get('listing');
    if (listingParam) {
      urlFilters.listingType = listingParam === 'sale' ? ListingType.FOR_SALE : ListingType.TO_RENT;
    }
    
    const locationParam = params.get('location');
    if (locationParam) {
      urlFilters.location = locationParam;
    }
    
    const queryParam = params.get('q');
    if (queryParam) {
      urlFilters.query = queryParam;
    }
    
    return urlFilters;
  }, []);

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlFilters = parseUrlFilters(searchParams);
    setFilters(urlFilters);
    handleSearch(urlFilters);
  }, [searchParams, handleSearch, parseUrlFilters]);

  // Handle loading saved search
  const handleLoadSavedSearch = useCallback((savedFilters: SearchFilters) => {
    handleSearch(savedFilters);
    setShowSavedSearches(false);
  }, [handleSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Properties for Sale & Rent
              </h1>
              <p className="text-gray-600">
                Discover your perfect property from our extensive collection across South Africa
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSavedSearches(!showSavedSearches)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="text-sm font-medium">Saved Searches</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Advanced Search */}
          <SearchErrorBoundary>
            <AdvancedSearch 
              onSearch={handleSearch}
              initialFilters={filters}
              showSaveSearch={true}
            />
          </SearchErrorBoundary>

          {/* Saved Searches Panel */}
          {showSavedSearches && (
            <SavedSearchesManager
              onLoadSearch={handleLoadSavedSearch}
            />
          )}

          {/* Search Results */}
          <PropertyErrorBoundary>
            <SearchResults
              properties={filteredProperties}
              filters={filters}
              loading={loading}
              totalCount={filteredProperties.length}
            />
          </PropertyErrorBoundary>

        </div>
      </div>

      <Footer />
    </div>
  );
}