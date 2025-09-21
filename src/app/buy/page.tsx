'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyGrid from '@/components/property/PropertyGrid';
import PropertySearch from '@/components/property/PropertySearch';
import { SearchFilters, ListingType } from '@/types';
import { sampleProperties } from '@/data/sampleProperties';
import Link from 'next/link';

export default function BuyPage() {
  const [showMortgageCalc, setShowMortgageCalc] = useState(false);

  const handleSearch = (filters: SearchFilters) => {
    // This would typically update results, but for demo purposes we'll just log
    console.log('Search filters:', filters);
  };

  const featuredForSale = sampleProperties
    .filter(p => p.listingType === ListingType.FOR_SALE && p.isFeatured)
    .slice(0, 6);

  const affordableHomes = sampleProperties
    .filter(p => p.listingType === ListingType.FOR_SALE && p.price <= 1500000)
    .slice(0, 6);

  const luxuryHomes = sampleProperties
    .filter(p => p.listingType === ListingType.FOR_SALE && p.price >= 3000000)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 py-20">
        <div 
          className="absolute inset-0 bg-black/40"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1920")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Buy Your Dream Home
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Discover the perfect property for your next chapter. From starter homes to luxury estates, 
              we have properties to match every budget and lifestyle.
            </p>
            
            {/* Key Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {sampleProperties.filter(p => p.listingType === ListingType.FOR_SALE).length}+
                </div>
                <div className="text-green-200">Properties for Sale</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">R500K+</div>
                <div className="text-green-200">Starting Price</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">30+</div>
                <div className="text-green-200">Areas Covered</div>
              </div>
            </div>
          </div>

          {/* Enhanced Search Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-6 border-2 border-green-200">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Properties for Sale</h3>
                <p className="text-gray-600">Search our extensive database of properties for sale</p>
              </div>
              <PropertySearch 
                onSearch={handleSearch}
                variant="compact"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tools Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Buying Tools & Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to make informed property purchase decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Mortgage Calculator */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mortgage Calculator</h3>
              <p className="text-gray-600 mb-4 text-sm">Calculate monthly payments and affordability</p>
              <button
                onClick={() => setShowMortgageCalc(true)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Calculate Now
              </button>
            </div>

            {/* Property Comparison */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Compare Properties</h3>
              <p className="text-gray-600 mb-4 text-sm">Side-by-side property comparisons</p>
              <Link
                href="/buy/compare"
                className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium text-center"
              >
                Start Comparing
              </Link>
            </div>

            {/* Buying Guide */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Buying Guide</h3>
              <p className="text-gray-600 mb-4 text-sm">Step-by-step home buying process</p>
              <Link
                href="/buy/guide"
                className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium text-center"
              >
                Learn More
              </Link>
            </div>

            {/* Saved Searches */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Saved Searches</h3>
              <p className="text-gray-600 mb-4 text-sm">Get alerts for new matching properties</p>
              <Link
                href="/buy/alerts"
                className="block w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium text-center"
              >
                Set Up Alerts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties for Sale */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties for Sale</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked premium properties from our most trusted agents
            </p>
          </div>
          <PropertyGrid properties={featuredForSale} />
          <div className="text-center mt-8">
            <Link
              href="/properties?listing=sale&featured=true"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              View All Featured Properties
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Price Range</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find properties that match your budget and requirements
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Affordable Homes */}
            <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Starter Homes</h3>
                  <p className="text-blue-600 font-semibold">Under R1.5M</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Perfect for first-time buyers and young families</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {affordableHomes.slice(0, 4).map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="font-semibold text-gray-900 text-sm">{property.title}</div>
                    <div className="text-blue-600 font-bold">R{property.price.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">{property.address.suburb}</div>
                  </Link>
                ))}
              </div>
              <Link
                href="/properties?listing=sale&max_price=1500000"
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All Starter Homes
              </Link>
            </div>

            {/* Luxury Homes */}
            <div className="bg-purple-50 rounded-xl p-8 border border-purple-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Luxury Properties</h3>
                  <p className="text-purple-600 font-semibold">R3M+</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Premium homes with exceptional features and locations</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {luxuryHomes.slice(0, 4).map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="font-semibold text-gray-900 text-sm">{property.title}</div>
                    <div className="text-purple-600 font-bold">R{property.price.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">{property.address.suburb}</div>
                  </Link>
                ))}
              </div>
              <Link
                href="/properties?listing=sale&min_price=3000000"
                className="block w-full text-center bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                View All Luxury Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Home Buying Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow our simple step-by-step process to find and purchase your dream home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Get Pre-Approved",
                description: "Determine your budget with mortgage pre-approval",
                icon: "calculator",
                color: "blue"
              },
              {
                step: 2,
                title: "Search Properties",
                description: "Browse and shortlist properties that match your criteria",
                icon: "search",
                color: "green"
              },
              {
                step: 3,
                title: "View & Compare",
                description: "Schedule viewings and compare your favorite properties",
                icon: "eye",
                color: "purple"
              },
              {
                step: 4,
                title: "Make an Offer",
                description: "Submit an offer and finalize the purchase",
                icon: "document",
                color: "orange"
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`w-16 h-16 bg-${item.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/buy/guide"
              className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Get the Complete Buying Guide
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Home Search?</h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of successful home buyers who found their perfect property with PropertyWorld
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties?listing=sale"
              className="inline-flex items-center px-8 py-3 bg-white text-green-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse All Properties
            </Link>
            <button
              onClick={() => setShowMortgageCalc(true)}
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Calculate Affordability
            </button>
          </div>
        </div>
      </section>

      {/* Simple Mortgage Calculator Modal */}
      {showMortgageCalc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Quick Mortgage Calculator</h3>
              <button
                onClick={() => setShowMortgageCalc(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Price</label>
                <input type="number" placeholder="e.g. 2,000,000" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (%)</label>
                <input type="number" placeholder="e.g. 10" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                <input type="number" step="0.1" placeholder="e.g. 11.5" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="20">20 years</option>
                  <option value="25">25 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">R18,450</div>
                  <div className="text-sm text-gray-600">Estimated monthly payment</div>
                </div>
              </div>
              <Link
                href="/buy/calculator"
                className="block w-full text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Use Advanced Calculator
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}