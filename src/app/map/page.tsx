'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LazyPropertyMapGrid from '@/components/map/LazyPropertyMapGrid';
import PropertySearch from '@/components/property/PropertySearch';
import { MapErrorBoundary, SearchErrorBoundary, PropertyErrorBoundary } from '@/components/ui/SpecializedErrorBoundaries';
import { SearchFilters, Property, ListingType } from '@/types';
import { sampleProperties } from '@/data/sampleProperties';
import { filterProperties, formatListingType } from '@/lib/utils';
import { filterPropertiesByBounds } from '@/lib/mapUtils';
import type { MapBounds } from '@/components/map/PropertyMapGrid_fixed';
import { useTranslation } from '@/i18n/translation';

export default function MapViewPage() {
  const [searchResults, setSearchResults] = useState<Property[]>(sampleProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);
  const [mapSearchActive, setMapSearchActive] = useState(false);
  const { t } = useTranslation();

  const handleSearch = (filters: SearchFilters) => {
    setLoading(true);
    setCurrentFilters(filters);
    setMapSearchActive(false); // Reset map search when doing filter search
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = filterProperties(sampleProperties, filters);
      setSearchResults(filtered);
      setLoading(false);
    }, 500);
  };

  const handleMapBoundsChange = (bounds: MapBounds) => {
    setLoading(true);
    setMapSearchActive(true);
    
    // Simulate API delay
    setTimeout(() => {
      // First apply existing filters if any
      let filteredProperties = currentFilters 
        ? filterProperties(sampleProperties, currentFilters)
        : sampleProperties;
      
      // Then filter by map bounds
      const boundsFiltered = filterPropertiesByBounds(filteredProperties, bounds);
      setSearchResults(boundsFiltered);
      setLoading(false);
    }, 300);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleClearMapSearch = () => {
    setMapSearchActive(false);
    setSearchResults(currentFilters ? filterProperties(sampleProperties, currentFilters) : sampleProperties);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
      <link rel="dns-prefetch" href="//basemaps.cartocdn.com" />
      <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="" />
      <link rel="preconnect" href="https://basemaps.cartocdn.com" crossOrigin="" />
      
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Map View</h1>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-gray-600">
                  Explore {searchResults.length} properties on the interactive map
                </p>
                {mapSearchActive && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 713 16.382V5.618a1 1 0 811.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                      </svg>
                      Map Area Search Active
                    </div>
                    <button
                      onClick={handleClearMapSearch}
                      className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          
          {/* Search Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            {/* Mobile Toggle Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Search Panel */}
            <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
              <SearchErrorBoundary>
                <PropertySearch onSearch={handleSearch} />
              </SearchErrorBoundary>
            </div>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            {/* Stats Bar */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {searchResults.length}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Total Properties
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {searchResults.filter(p => p.listingType === ListingType.FOR_SALE).length}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    For Sale
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {searchResults.filter(p => p.listingType === ListingType.TO_RENT).length}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    To Rent
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {loading ? '...' : searchResults.length > 0 ? '🇿🇦' : '0'}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    South Africa
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <MapErrorBoundary>
                <LazyPropertyMapGrid 
                  properties={searchResults}
                  onPropertySelect={handlePropertySelect}
                  onMapBoundsChange={handleMapBoundsChange}
                  showSearchButton={true}
                  className="w-full"
                />
              </MapErrorBoundary>
            </div>

            {/* Selected Property Sidebar */}
            {selectedProperty && (
              <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 transform transition-transform duration-300">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto">
                  <PropertyErrorBoundary>
                    <div className="space-y-4">
                      <Image 
                        src={selectedProperty.images[0]?.url || '/placeholder-property.jpg'} 
                        alt={selectedProperty.images[0]?.alt || selectedProperty.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {selectedProperty.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {selectedProperty.address.street}, {selectedProperty.address.suburb}
                        </p>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-2xl font-bold text-green-600">
                            {selectedProperty.currency === 'ZAR' ? 'R' : selectedProperty.currency} {selectedProperty.price.toLocaleString()}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {formatListingType(selectedProperty.listingType, t)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="font-semibold text-gray-900">{selectedProperty.bedrooms}</div>
                            <div className="text-sm text-gray-600">Bedrooms</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="font-semibold text-gray-900">{selectedProperty.bathrooms}</div>
                            <div className="text-sm text-gray-600">Bathrooms</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="font-semibold text-gray-900">{selectedProperty.squareMeters}</div>
                            <div className="text-sm text-gray-600">m²</div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {selectedProperty.description}
                        </p>
                      </div>
                    </div>
                  </PropertyErrorBoundary>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}