'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useUserProfile';
import { useTranslation } from '@/i18n/translation';
import PropertyCard from '@/components/property/PropertyCard';
import { PropertyType } from '@/types/property';
import { sampleProperties } from '@/data/sampleProperties';
import Link from 'next/link';

interface FavoritesManagerProps {
  className?: string;
}

type SortOption = 'newest' | 'oldest' | 'price-high' | 'price-low' | 'alphabetical';
type FilterOption = 'all' | PropertyType;

export default function FavoritesManager({ className = '' }: FavoritesManagerProps) {
  const { user } = useAuth();
  const { 
    favorites, 
    loading, 
    error, 
    isDatabaseAvailable, 
    clearAllFavorites, 
    favoriteCount,
    refreshFavorites 
  } = useFavorites(user);
  const { t } = useTranslation();
  
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  // Get favorite properties with sorting and filtering
  const favoriteProperties = useMemo(() => {
    let filtered = sampleProperties.filter(property => 
      favorites.includes(property.id)
    );

    // Apply property type filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(property => property.propertyType === filterBy);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.dateAdded.getTime() - a.dateAdded.getTime();
        case 'oldest':
          return a.dateAdded.getTime() - b.dateAdded.getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [favorites, filterBy, sortBy]);

  // Get property type counts
  const propertyTypeCounts = useMemo(() => {
    const allFavoriteProperties = sampleProperties.filter(property => 
      favorites.includes(property.id)
    );
    
    const counts: Record<string, number> = { all: allFavoriteProperties.length };
    
    allFavoriteProperties.forEach(property => {
      counts[property.propertyType] = (counts[property.propertyType] || 0) + 1;
    });
    
    return counts;
  }, [favorites]);

  const handleClearAll = async () => {
    setClearingAll(true);
    try {
      await clearAllFavorites();
      setShowConfirmClear(false);
    } catch (err) {
      console.error('Error clearing favorites:', err);
    } finally {
      setClearingAll(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshFavorites();
    } catch (err) {
      console.error('Error refreshing favorites:', err);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={`skeleton-${i + 1}`} className="bg-gray-200 rounded-xl h-96"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {t('favorites.title')} ({favoriteCount})
            </h2>
            <p className="text-gray-600">
              {favoriteCount === 0 
                ? t('favorites.no_favorites_message')
                : (() => {
                    const propertyWord = favoriteCount !== 1 ? 'ies' : 'y';
                    return `You have ${favoriteCount} favorite propert${propertyWord}`;
                  })()
              }
              {!isDatabaseAvailable && (
                <span className="ml-2 text-orange-600 text-sm">
                  ⚠️ Using local storage
                </span>
              )}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              <svg className={`w-4 h-4 inline mr-1 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            
            {favoriteCount > 0 && (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">Error: {error}</p>
          </div>
        )}
      </div>

      {favoriteCount > 0 && (
        <>
          {/* Filters and Sorting */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Property Type Filter */}
              <div className="flex-1">
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Type
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterBy('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterBy === 'all'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All ({propertyTypeCounts.all || 0})
                  </button>
                  {Object.entries(PropertyType).map(([key, value]) => {
                    const count = propertyTypeCounts[value] || 0;
                    if (count === 0) return null;
                    
                    return (
                      <button
                        key={key}
                        onClick={() => setFilterBy(value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          filterBy === value
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {key.replace('_', ' ')} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex-1">
                <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Recently Added</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property}
                className="h-full"
              />
            ))}
          </div>

          {favoriteProperties.length === 0 && filterBy !== 'all' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {filterBy.replace('_', ' ')} properties
              </h3>
              <p className="text-gray-500 mb-4">
                You don't have any {filterBy.replace('_', ' ')} properties in your favorites.
              </p>
              <button
                onClick={() => setFilterBy('all')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Favorites
              </button>
            </div>
          )}
        </>
      )}

      {favoriteCount === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
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
      )}

      {/* Clear All Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Clear All Favorites?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all {favoriteCount} properties from your favorites? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                disabled={clearingAll}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearingAll}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {clearingAll ? (
                  <>
                    <svg className="w-4 h-4 animate-spin inline mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Clearing...
                  </>
                ) : (
                  'Clear All'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}