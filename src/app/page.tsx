'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/layout/HeroSection';
import PropertyGrid from '@/components/property/PropertyGrid';
import ContactForm from '@/components/forms/ContactForm';
import { PropertyErrorBoundary, SearchErrorBoundary } from '@/components/ui/SpecializedErrorBoundaries';
import { SearchFilters } from '@/types';
import { sampleProperties, featuredProperties, recentProperties } from '@/data/sampleProperties';
import { useTranslation } from '@/i18n/translation';

export default function HomePage() {
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      <div className="relative z-10">
        <Header />
      
      <main>
        {/* Hero Section */}
        <SearchErrorBoundary>
          <HeroSection onSearch={handleSearch} />
        </SearchErrorBoundary>

        {/* Search Results or Featured/Recent Properties */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {searchResults ? (
              <>
                <div className="mb-12 text-center animate-fadeInUp">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
                    {t('common.search_results')}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
                  <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                    {t('common.found_properties', { 
                      count: searchResults.length,
                      properties: searchResults.length !== 1 ? t('common.properties') : t('common.property')
                    })}
                  </p>
                </div>
                <PropertyErrorBoundary>
                  <PropertyGrid properties={searchResults} />
                </PropertyErrorBoundary>
              </>
            ) : (
              <>
                {/* Featured Properties */}
                <div className="mb-20 animate-fadeInUp">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
                      {t('homepage.featured_properties')}
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mb-8 rounded-full"></div>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      {t('homepage.featured_description')}
                    </p>
                  </div>
                  <PropertyErrorBoundary>
                    <PropertyGrid properties={featuredProperties} />
                  </PropertyErrorBoundary>
                </div>

                {/* Recent Properties */}
                <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-blue-800 bg-clip-text text-transparent mb-6">
                      {t('homepage.recently_added')}
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      {t('homepage.recent_description')}
                    </p>
                  </div>
                  <PropertyErrorBoundary>
                    <PropertyGrid properties={recentProperties} />
                  </PropertyErrorBoundary>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20 animate-fadeInUp">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
                {t('homepage.why_choose_title')}
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('homepage.why_choose_description')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group animate-fadeInUp hover:scale-105 transition-all duration-500" style={{ animationDelay: '100ms' }}>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 group-hover:rotate-3">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{t('homepage.smart_search')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('homepage.smart_search_desc')}</p>
              </div>

              <div className="text-center group animate-fadeInUp hover:scale-105 transition-all duration-500" style={{ animationDelay: '200ms' }}>
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl group-hover:shadow-green-500/25 transition-all duration-500 group-hover:rotate-3">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">{t('homepage.verified_listings')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('homepage.verified_listings_desc')}</p>
              </div>

              <div className="text-center group animate-fadeInUp hover:scale-105 transition-all duration-500" style={{ animationDelay: '300ms' }}>
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500 group-hover:rotate-3">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">{t('homepage.expert_agents')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('homepage.expert_agents_desc')}</p>
              </div>

              <div className="text-center group animate-fadeInUp hover:scale-105 transition-all duration-500" style={{ animationDelay: '400ms' }}>
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl group-hover:shadow-orange-500/25 transition-all duration-500 group-hover:rotate-3">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">{t('homepage.market_insights')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('homepage.market_insights_desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 animate-fadeInUp">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
                Get In Touch
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Have questions about our properties or need assistance finding your dream home? 
                We're here to help you every step of the way.
              </p>
            </div>
            
            <div className="glass-card bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 border border-white/20 animate-slideUp" style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-2xl"></div>
              <div className="relative">
                <ContactForm 
                  onSubmit={(data) => {
                    console.log('Contact form submitted:', data);
                    // Handle form submission - would typically send to API
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      </div>
    </div>
  );
}
