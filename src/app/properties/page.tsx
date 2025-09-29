'use client';

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyGrid from '@/components/property/PropertyGrid';
import PropertySearch from '@/components/property/PropertySearch';
import { PropertyErrorBoundary, SearchErrorBoundary } from '@/components/ui/SpecializedErrorBoundaries';
import { SearchFilters, Property, PropertyType, ListingType } from '@/types';
import { sampleProperties } from '@/data/sampleProperties';
import { filterProperties, sortProperties } from '@/lib/utils';

// Constants to reduce duplication and improve maintainability
const CSS_CLASSES = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
  flexLayout: 'flex flex-col lg:flex-row gap-8',
  pageHeader: 'bg-white border-b border-gray-200',
  filterContainer: 'bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-8 backdrop-blur-sm',
  sectionHeader: 'text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider',
  inputField: 'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-gray-400 transition-all',
  selectField: 'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-gray-400 transition-all cursor-pointer',
  checkboxRadio: 'h-5 w-5 bg-white border-2 border-black text-black focus:ring-gray-500 focus:ring-2 focus:outline-none hover:bg-gray-50 checked:bg-white checked:border-black'
} as const;

const PROPERTIES_PER_PAGE = 12;
const SEARCH_DELAY = 300;

// Select options for better maintainability
const BEDROOM_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
] as const;

const BATHROOM_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
] as const;

// Component that uses useSearchParams
function PropertiesContent() {
  const searchParams = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Using constant for consistency

  const handleSearch = useCallback((searchFilters: SearchFilters) => {
    setLoading(true);
    setFilters(searchFilters);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = filterProperties(sampleProperties, searchFilters);
      const sorted = sortProperties(filtered, sortBy);
      setFilteredProperties(sorted);
      setCurrentPage(1);
      setLoading(false);
    }, SEARCH_DELAY);
  }, [sortBy]);

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
    
    return urlFilters;
  }, []);

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlFilters = parseUrlFilters(searchParams);
    setFilters(urlFilters);
    handleSearch(urlFilters);
  }, [searchParams, handleSearch, parseUrlFilters]);

  const handleSort = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
    const sorted = sortProperties(filteredProperties, newSortBy);
    setFilteredProperties(sorted);
  }, [filteredProperties]);

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredProperties.length / PROPERTIES_PER_PAGE);
    const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE;
    const endIndex = startIndex + PROPERTIES_PER_PAGE;
    const currentProperties = filteredProperties.slice(startIndex, endIndex);
    
    return { totalPages, startIndex, endIndex, currentProperties };
  }, [filteredProperties, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
            
            {/* Search Bar */}
            <div className="lg:w-1/3">
              <SearchErrorBoundary>
                <PropertySearch 
                  onSearch={handleSearch}
                  variant="compact"
                  className="w-full"
                />
              </SearchErrorBoundary>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={CSS_CLASSES.flexLayout}>
          
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className={CSS_CLASSES.filterContainer}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Listing Type */}
              <div className="mb-8">
                <h4 className={CSS_CLASSES.sectionHeader}>Listing Type</h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="listingType"
                      value=""
                      checked={!filters.listingType}
                      onChange={() => handleSearch({ ...filters, listingType: undefined })}
                      className="h-5 w-5 bg-white border-2 border-black text-black focus:ring-gray-500 focus:ring-2 focus:outline-none hover:bg-gray-50 checked:bg-white checked:border-black"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 select-none">All</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="listingType"
                      value="sale"
                      checked={filters.listingType === ListingType.FOR_SALE}
                      onChange={() => handleSearch({ ...filters, listingType: ListingType.FOR_SALE })}
                      className={CSS_CLASSES.checkboxRadio}
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 select-none">For Sale</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="listingType"
                      value="rent"
                      checked={filters.listingType === ListingType.TO_RENT}
                      onChange={() => handleSearch({ ...filters, listingType: ListingType.TO_RENT })}
                      className={CSS_CLASSES.checkboxRadio}
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 select-none">To Rent</span>
                  </label>
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-8">
                <h4 className={CSS_CLASSES.sectionHeader}>Property Type</h4>
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2">
                  {Object.values(PropertyType).map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.propertyType?.includes(type) || false}
                        onChange={(e) => {
                          const currentTypes = filters.propertyType || [];
                          const newTypes = e.target.checked
                            ? [...currentTypes, type]
                            : currentTypes.filter(t => t !== type);
                          handleSearch({ ...filters, propertyType: newTypes.length > 0 ? newTypes : undefined });
                        }}
                        className={CSS_CLASSES.checkboxRadio}
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700 capitalize select-none">
                        {type.toLowerCase().replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className={CSS_CLASSES.sectionHeader}>Price Range</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="min-price-input" className="block text-xs text-gray-600 mb-1">Min Price</label>
                    <input
                      id="min-price-input"
                      type="number"
                      placeholder="0"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleSearch({ 
                        ...filters, 
                        minPrice: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className={CSS_CLASSES.inputField}
                    />
                  </div>
                  <div>
                    <label htmlFor="max-price-input" className="block text-xs text-gray-600 mb-1">Max Price</label>
                    <input
                      id="max-price-input"
                      type="number"
                      placeholder="No limit"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleSearch({ 
                        ...filters, 
                        maxPrice: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className={CSS_CLASSES.inputField}
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="mb-8">
                <h4 className={CSS_CLASSES.sectionHeader}>Rooms</h4>
                <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bedrooms-select" className="block text-sm font-medium text-gray-900 mb-2">Bedrooms</label>
                  <select
                    id="bedrooms-select"
                    value={filters.bedrooms || ''}
                    onChange={(e) => handleSearch({ 
                      ...filters, 
                      bedrooms: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-gray-400 transition-all cursor-pointer"
                  >
                    {BEDROOM_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="bathrooms-select" className="block text-sm font-medium text-gray-900 mb-2">Bathrooms</label>
                  <select
                    id="bathrooms-select"
                    value={filters.bathrooms || ''}
                    onChange={(e) => handleSearch({ 
                      ...filters, 
                      bathrooms: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-gray-400 transition-all cursor-pointer"
                  >
                    {BATHROOM_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              </div>

              {/* Clear Filters */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setFilters({});
                    handleSearch({});
                  }}
                  className="w-full px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear All Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {paginationData.startIndex + 1}-{Math.min(paginationData.endIndex, filteredProperties.length)} of {filteredProperties.length} properties
                  </p>
                  
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    Filters
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="sort-select" className="text-sm text-gray-600">Sort by:</label>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => handleSort(e.target.value)}
                      className="px-3 py-2 border-2 border-gray-400 rounded-md text-sm bg-white text-gray-900 focus:ring-blue-600 focus:border-blue-600 focus:outline-none hover:border-gray-500"
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <PropertyErrorBoundary>
              <PropertyGrid 
                properties={paginationData.currentProperties}
                loading={loading}
                emptyMessage="No properties match your search criteria"
              />
            </PropertyErrorBoundary>

            {/* Pagination */}
            {paginationData.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1).map((page) => {
                    const isCurrentPage = page === currentPage;
                    const buttonClasses = `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      isCurrentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={buttonClasses}
                        aria-current={isCurrentPage ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === paginationData.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Loading fallback for Suspense
function PropertiesLoading() {
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
                Loading properties...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Main component with Suspense boundary
export default function PropertiesPage() {
  return (
    <Suspense fallback={<PropertiesLoading />}>
      <PropertiesContent />
    </Suspense>
  );
}