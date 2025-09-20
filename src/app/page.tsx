'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/layout/HeroSection';
import PropertyGrid from '@/components/property/PropertyGrid';
import { SearchFilters } from '@/types';
import { sampleProperties, featuredProperties, recentProperties } from '@/data/sampleProperties';

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<typeof sampleProperties | null>(null);

  const handleSearch = (filters: SearchFilters) => {
    // Simple search implementation - in real app this would call an API
    let filtered = sampleProperties;

    if (filters.listingType) {
      filtered = filtered.filter(p => p.listingType === filters.listingType);
    }

    if (filters.propertyType && filters.propertyType.length > 0) {
      filtered = filtered.filter(p => filters.propertyType!.includes(p.propertyType));
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.bedrooms !== undefined) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedrooms!);
    }

    if (filters.location) {
      filtered = filtered.filter(p => 
        p.address.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        p.address.suburb.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    setSearchResults(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <HeroSection onSearch={handleSearch} />

        {/* Search Results or Featured/Recent Properties */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {searchResults ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Search Results
                  </h2>
                  <p className="text-gray-600">
                    Found {searchResults.length} propert{searchResults.length !== 1 ? 'ies' : 'y'} matching your criteria
                  </p>
                </div>
                <PropertyGrid properties={searchResults} />
              </>
            ) : (
              <>
                {/* Featured Properties */}
                <div className="mb-16">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Featured Properties
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Discover our handpicked selection of premium properties across South Africa's most desirable locations.
                    </p>
                  </div>
                  <PropertyGrid properties={featuredProperties} />
                </div>

                {/* Recent Properties */}
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Recently Added
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Fresh listings from trusted agents and property owners.
                    </p>
                  </div>
                  <PropertyGrid properties={recentProperties} />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose PropertyWorld?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We make finding and selling properties simple, secure, and stress-free.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Search</h3>
                <p className="text-gray-600">Advanced filters to find exactly what you're looking for.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Listings</h3>
                <p className="text-gray-600">All properties are verified by our trusted agent network.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Agents</h3>
                <p className="text-gray-600">Connect with experienced professionals in your area.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Insights</h3>
                <p className="text-gray-600">Get property valuations and market trends data.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
