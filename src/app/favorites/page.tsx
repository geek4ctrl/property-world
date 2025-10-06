'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useUserProfile';
import { useTranslation } from '@/i18n/translation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { Property, PropertyType } from '@/types';
import { sampleProperties } from '@/data/sampleProperties';
import Link from 'next/link';

type SortOption = 'name' | 'price-low' | 'price-high' | 'area' | 'bedrooms';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favorites, loading, clearAllFavorites } = useFavorites(user);
  const { t } = useTranslation();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [filterType, setFilterType] = useState<PropertyType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showClearModal, setShowClearModal] = useState(false);

  // Filter sample properties to show only favorites
  useEffect(() => {
    const filteredProperties = sampleProperties.filter(property => 
      favorites.includes(property.id)
    );
    setFavoriteProperties(filteredProperties);
  }, [favorites]);

  // Filtered and sorted favorites
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = favoriteProperties;

    // Filter by property type
    if (filterType !== 'all') {
      filtered = filtered.filter(property => property.propertyType === filterType);
    }

    // Sort properties
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'area':
          return (b.squareMeters || 0) - (a.squareMeters || 0);
        case 'bedrooms':
          return (b.bedrooms || 0) - (a.bedrooms || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [favoriteProperties, filterType, sortBy]);

  const handleClearAll = async () => {
    try {
      await clearAllFavorites();
      setShowClearModal(false);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  if (!user) {
    return (
      <>
        <Header variant="solid" />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('favorites.sign_in_required')}</h1>
            <p className="text-gray-600 mb-8">{t('favorites.sign_in_message')}</p>
            <div className="space-y-3">
              <Link 
                href="/auth/login"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {t('favorites.sign_in')}
              </Link>
              <Link 
                href="/auth/register"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {t('favorites.create_account')}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header variant="solid" />
        <main className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">{t('favorites.loading')}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header variant="solid" />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('favorites.title')}</h1>
                <p className="text-gray-600">
                  {(() => {
                    if (favoriteProperties.length === 0) {
                      return t('favorites.subtitle');
                    } else if (favoriteProperties.length === 1) {
                      return t('favorites.subtitle_with_count', { count: favoriteProperties.length });
                    } else {
                      return t('favorites.subtitle_with_count_plural', { count: favoriteProperties.length });
                    }
                  })()}
                </p>
              </div>
              {favoriteProperties.length > 0 && (
                <button
                  onClick={() => setShowClearModal(true)}
                  className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {t('favorites.clear_all')}
                </button>
              )}
            </div>

            {/* Filters and Sort */}
            {favoriteProperties.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200">
                {/* Property Type Filter */}
                <div className="flex-1">
                  <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('favorites.property_type_filter')}
                  </label>
                  <select
                    id="type-filter"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as PropertyType | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="all">{t('favorites.all_types')}</option>
                    <option value="apartment">{t('favorites.apartment')}</option>
                    <option value="house">{t('favorites.house')}</option>
                    <option value="townhouse">{t('favorites.townhouse')}</option>
                    <option value="office">{t('favorites.office')}</option>
                    <option value="student">{t('favorites.student_housing')}</option>
                  </select>
                </div>

                {/* Sort Options */}
                <div className="flex-1">
                  <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('favorites.sort_by')}
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="name">{t('favorites.name_a_z')}</option>
                    <option value="price-low">{t('favorites.price_low_high')}</option>
                    <option value="price-high">{t('favorites.price_high_low')}</option>
                    <option value="area">{t('favorites.area_largest')}</option>
                    <option value="bedrooms">{t('favorites.bedrooms_most')}</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="text-sm text-gray-600 whitespace-nowrap">
                    {t('favorites.properties_count', { 
                      filtered: filteredAndSortedProperties.length, 
                      total: favoriteProperties.length 
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          {(() => {
            if (favoriteProperties.length === 0) {
              return (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('favorites.no_favorites')}</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {t('favorites.no_favorites_message')}
                  </p>
                  <Link 
                    href="/properties"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {t('favorites.start_browsing')}
                  </Link>
                </div>
              );
            } else if (filteredAndSortedProperties.length > 0) {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProperties.map((property) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property}
                      className="h-full"
                    />
                  ))}
                </div>
              );
            } else {
              return (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">No Properties Match Your Filter</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Try adjusting your filters to see more of your favorite properties.
                  </p>
                  <button 
                    onClick={() => {
                      setFilterType('all');
                      setSortBy('name');
                    }}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Filters
                  </button>
                </div>
              );
            }
          })()}
        </div>
      </main>
      <Footer />

      {/* Clear All Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t('favorites.clear_all_favorites')}</h3>
            </div>
            <p className="text-gray-600 mb-6">
              {t('favorites.clear_all_confirmation')}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('favorites.cancel')}
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('favorites.clear_all')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}