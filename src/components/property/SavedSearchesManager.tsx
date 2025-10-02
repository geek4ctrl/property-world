'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchFilters, ListingType, PropertyType } from '@/types';
import { formatPrice } from '@/lib/utils';

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  lastUsed?: string;
  alertsEnabled: boolean;
}

interface SavedSearchesProps {
  onLoadSearch: (filters: SearchFilters) => void;
  className?: string;
}

export default function SavedSearchesManager({ onLoadSearch, className = '' }: SavedSearchesProps) {

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Load saved searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('savedSearches');
      if (stored) {
        try {
          const searches = JSON.parse(stored);
          setSavedSearches(searches.map((search: any, index: number) => ({
            ...search,
            id: search.id || `search-${index}`,
            alertsEnabled: search.alertsEnabled ?? false
          })));
        } catch (error) {
          console.error('Error loading saved searches:', error);
        }
      }
    }
  }, []);

  // Save searches to localStorage
  const saveToStorage = useCallback((searches: SavedSearch[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedSearches', JSON.stringify(searches));
    }
    setSavedSearches(searches);
  }, []);

  // Load a saved search
  const handleLoadSearch = useCallback((search: SavedSearch) => {
    const updatedSearches = savedSearches.map(s => 
      s.id === search.id 
        ? { ...s, lastUsed: new Date().toISOString() }
        : s
    );
    saveToStorage(updatedSearches);
    onLoadSearch(search.filters);
  }, [savedSearches, saveToStorage, onLoadSearch]);

  // Delete a saved search
  const handleDeleteSearch = useCallback((searchId: string) => {
    const updatedSearches = savedSearches.filter(s => s.id !== searchId);
    saveToStorage(updatedSearches);
    setShowDeleteConfirm(null);
  }, [savedSearches, saveToStorage]);

  // Toggle alerts for a search
  const handleToggleAlerts = useCallback((searchId: string) => {
    const updatedSearches = savedSearches.map(s =>
      s.id === searchId
        ? { ...s, alertsEnabled: !s.alertsEnabled }
        : s
    );
    saveToStorage(updatedSearches);
  }, [savedSearches, saveToStorage]);

  // Format search criteria for display
  const formatSearchCriteria = useCallback((filters: SearchFilters): string => {
    const criteria: string[] = [];

    if (filters.listingType) {
      criteria.push(filters.listingType === ListingType.FOR_SALE ? 'For Sale' : 'To Rent');
    }

    if (filters.propertyType && filters.propertyType.length > 0) {
      const types = filters.propertyType.map(type => {
        switch (type) {
          case PropertyType.HOUSE: return 'House';
          case PropertyType.APARTMENT: return 'Apartment';
          case PropertyType.TOWNHOUSE: return 'Townhouse';
          case PropertyType.FLAT: return 'Flat';
          default: return type;
        }
      });
      criteria.push(types.join(', '));
    }

    if (filters.location) {
      criteria.push(`in ${filters.location}`);
    }

    if (filters.bedrooms) {
      criteria.push(`${filters.bedrooms}+ beds`);
    }

    if (filters.bathrooms) {
      criteria.push(`${filters.bathrooms}+ baths`);
    }

    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice && filters.maxPrice) {
        criteria.push(`R${formatPrice(filters.minPrice, 'ZAR')} - R${formatPrice(filters.maxPrice, 'ZAR')}`);
      } else if (filters.minPrice) {
        criteria.push(`From R${formatPrice(filters.minPrice, 'ZAR')}`);
      } else if (filters.maxPrice) {
        criteria.push(`Up to R${formatPrice(filters.maxPrice, 'ZAR')}`);
      }
    }

    return criteria.length > 0 ? criteria.join(' • ') : 'All properties';
  }, []);

  if (savedSearches.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <svg className="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Searches</h3>
          <p className="text-gray-600 mb-4">
            Save your search criteria to quickly find similar properties in the future.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Saved Searches</h3>
          <span className="text-sm text-gray-500">{savedSearches.length} saved</span>
        </div>

        <div className="space-y-4">
          {savedSearches.map((search) => (
            <div key={search.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{search.name}</h4>
                <div className="flex items-center space-x-2">
                  {/* Alerts Toggle */}
                  <button
                    onClick={() => handleToggleAlerts(search.id)}
                    className={`p-1 rounded transition-colors ${
                      search.alertsEnabled
                        ? 'text-blue-600 hover:text-blue-700'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={search.alertsEnabled ? 'Alerts enabled' : 'Enable alerts'}
                  >
                    <svg className="w-4 h-4" fill={search.alertsEnabled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5.88.024a1.718 1.718 0 01-1.238-.518L8 12H5.5C4.01 12 3 10.99 3 9.5S4.01 7 5.5 7H8l4.88-4.506c.4-.4.9-.494 1.238-.018.337.476.337 1.058 0 1.534L9 9.5 14.12 15c.4.4.4 1.2 0 1.5z" />
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteConfirm(search.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete search"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {formatSearchCriteria(search.filters)}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Created {new Date(search.createdAt).toLocaleDateString()}</span>
                  {search.lastUsed && (
                    <span>Last used {new Date(search.lastUsed).toLocaleDateString()}</span>
                  )}
                </div>

                <button
                  onClick={() => handleLoadSearch(search)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Load Search
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.958-.833-2.728 0L4.186 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Delete Saved Search</h3>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSearch(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}