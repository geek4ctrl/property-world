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
import { useTranslation } from '@/i18n/translation';

export default function MapViewPage() {
  const [searchResults, setSearchResults] = useState<Property[]>(sampleProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSearch = (filters: SearchFilters) => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const filtered = filterProperties(sampleProperties, filters);
      setSearchResults(filtered);
      setLoading(false);
    }, 500);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
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
              <p className="text-gray-600 mt-2">
                Explore {searchResults.length} properties on the interactive map
              </p>
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
            
            <div className={`space-y-4 lg:space-y-6 lg:sticky lg:top-4 max-h-screen lg:overflow-y-auto ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
              {/* Search Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                  <h2 className="text-lg font-bold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    Search Properties
                  </h2>
                </div>
                <div className="p-4">
                  <SearchErrorBoundary>
                    <PropertySearch onSearch={handleSearch} variant="compact" />
                  </SearchErrorBoundary>
                </div>
              </div>
              
              {/* Results Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Search Results
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total Properties</span>
                      <span className="text-lg font-bold text-gray-900">{searchResults.length}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-lg font-bold text-green-700">
                          {searchResults.filter(p => p.listingType === ListingType.FOR_SALE).length}
                        </div>
                        <div className="text-xs text-green-600 font-medium">{t('property.for_sale')}</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-lg font-bold text-blue-700">
                          {searchResults.filter(p => p.listingType === ListingType.TO_RENT).length}
                        </div>
                        <div className="text-xs text-blue-600 font-medium">{t('property.to_rent')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Property Info */}
              {selectedProperty && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-green-500 px-4 py-3">
                    <h3 className="text-sm font-bold text-white flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Selected Property
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {/* Property Image */}
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                        <Image 
                          src={selectedProperty.images[0]?.url || '/placeholder-property.jpg'} 
                          alt={selectedProperty.title}
                          fill
                          className="object-cover"
                          sizes="320px"
                        />
                      </div>
                      
                      {/* Property Details */}
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
                          {selectedProperty.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-3 flex items-center">
                          <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {selectedProperty.address.suburb}, {selectedProperty.address.city}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-bold text-green-600">
                            {selectedProperty.currency === 'ZAR' ? 'R' : selectedProperty.currency}
                            {selectedProperty.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {formatListingType(selectedProperty.listingType, t)}
                          </span>
                        </div>
                        
                        {/* Property Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold text-gray-900">{selectedProperty.bedrooms}</div>
                            <div className="text-xs text-gray-600">{t('property.beds')}</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold text-gray-900">{selectedProperty.bathrooms}</div>
                            <div className="text-xs text-gray-600">{t('property.baths')}</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold text-gray-900">{selectedProperty.squareMeters}</div>
                            <div className="text-xs text-gray-600">m²</div>
                          </div>
                        </div>
                        
                        <a 
                          href={`/properties/${selectedProperty.id}`}
                          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 text-sm"
                        >
                          View Full Details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Interactive Properties Map
                  </h2>
                  <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm">
                    💡 Click markers for details
                  </div>
                </div>
                <p className="text-gray-600 mt-2">
                  Explore properties visually on the map below
                </p>
              </div>
              
              <MapErrorBoundary>
                <LazyPropertyMapGrid 
                  properties={searchResults}
                  onPropertySelect={handlePropertySelect}
                  className="w-full"
                />
              </MapErrorBoundary>
            </div>

            {/* Map Instructions */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-3 text-lg">How to use the interactive map</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Click and drag to navigate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Scroll to zoom in/out</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Click colored markers for details</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Use filters to refine search</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}