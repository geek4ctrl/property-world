'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyGrid from '@/components/property/PropertyGrid';
import PropertySearch from '@/components/property/PropertySearch';
import { PropertyErrorBoundary, SearchErrorBoundary } from '@/components/ui/SpecializedErrorBoundaries';
import { SearchFilters, Property, PropertyType, ListingType } from '@/types';
import { sampleProperties } from '@/data/sampleProperties';
import { filterProperties, sortProperties } from '@/lib/utils';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const propertiesPerPage = 12;

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
    }, 300);
  }, [sortBy]);

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlFilters: SearchFilters = {};
    
    if (searchParams.get('type')) {
      urlFilters.propertyType = [searchParams.get('type') as PropertyType];
    }
    if (searchParams.get('listing')) {
      urlFilters.listingType = searchParams.get('listing') === 'sale' ? ListingType.FOR_SALE : ListingType.TO_RENT;
    }
    if (searchParams.get('location')) {
      urlFilters.location = searchParams.get('location')!;
    }
    
    setFilters(urlFilters);
    handleSearch(urlFilters);
  }, [searchParams, handleSearch]);

  const handleSort = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
    const sorted = sortProperties(filteredProperties, newSortBy);
    setFilteredProperties(sorted);
  }, [filteredProperties]);

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const currentProperties = filteredProperties.slice(startIndex, endIndex);
    
    return { totalPages, startIndex, endIndex, currentProperties };
  }, [filteredProperties, currentPage, propertiesPerPage]);

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
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Quick Filters */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Listing Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="listingType"
                      value=""
                      checked={!filters.listingType}
                      onChange={() => handleSearch({ ...filters, listingType: undefined })}
                      className="h-5 w-5 text-blue-700 border-2 border-gray-500 focus:ring-blue-600 focus:ring-2 focus:outline-none hover:border-gray-600 bg-white"
                    />
                    <span className="ml-2 text-sm text-gray-700">All</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="listingType"
                      value="sale"
                      checked={filters.listingType === ListingType.FOR_SALE}
                      onChange={() => handleSearch({ ...filters, listingType: ListingType.FOR_SALE })}
                      className="h-5 w-5 text-blue-700 border-2 border-gray-500 focus:ring-blue-600 focus:ring-2 focus:outline-none hover:border-gray-600 bg-white"
                    />
                    <span className="ml-2 text-sm text-gray-700">For Sale</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="listingType"
                      value="rent"
                      checked={filters.listingType === ListingType.TO_RENT}
                      onChange={() => handleSearch({ ...filters, listingType: ListingType.TO_RENT })}
                      className="h-5 w-5 text-blue-700 border-2 border-gray-500 focus:ring-blue-600 focus:ring-2 focus:outline-none hover:border-gray-600 bg-white"
                    />
                    <span className="ml-2 text-sm text-gray-700">To Rent</span>
                  </label>
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Property Type</h4>
                <div className="space-y-2">
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
                        className="h-5 w-5 text-blue-700 border-2 border-gray-500 rounded focus:ring-blue-600 focus:ring-2 focus:outline-none hover:border-gray-600 bg-white"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {type.toLowerCase().replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
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
                      className="w-full px-3 py-2 border-2 border-gray-400 rounded-md text-sm bg-white text-gray-900 placeholder-gray-600 focus:ring-blue-600 focus:border-blue-600 focus:outline-none hover:border-gray-500"
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
                      className="w-full px-3 py-2 border-2 border-gray-400 rounded-md text-sm bg-white text-gray-900 placeholder-gray-600 focus:ring-blue-600 focus:border-blue-600 focus:outline-none hover:border-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="bedrooms-select" className="block text-sm font-medium text-gray-900 mb-2">Bedrooms</label>
                  <select
                    id="bedrooms-select"
                    value={filters.bedrooms || ''}
                    onChange={(e) => handleSearch({ 
                      ...filters, 
                      bedrooms: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border-2 border-gray-400 rounded-md text-sm bg-white text-gray-900 focus:ring-blue-600 focus:border-blue-600 focus:outline-none hover:border-gray-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
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
                    className="w-full px-3 py-2 border-2 border-gray-400 rounded-md text-sm bg-white text-gray-900 focus:ring-blue-600 focus:border-blue-600 focus:outline-none hover:border-gray-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setFilters({});
                  handleSearch({});
                }}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
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

                  {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

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