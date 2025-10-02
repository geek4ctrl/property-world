'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useUserProfile';
import { useTranslation } from '@/i18n';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { Property } from '@/types';
import { sampleProperties } from '@/data/sampleProperties';
import Link from 'next/link';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favorites, loading } = useFavorites(user);
  const { t } = useTranslation();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);

  // Filter sample properties to show only favorites
  useEffect(() => {
    const filteredProperties = sampleProperties.filter(property => 
      favorites.includes(property.id)
    );
    setFavoriteProperties(filteredProperties);
  }, [favorites]);

  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
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
        <Header />
        <main className="min-h-screen bg-gray-50">
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
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                {t('navigation.home')}
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">{t('favorites.title')}</span>
            </div>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('favorites.title')}</h1>
            <p className="text-gray-600">
              {favoriteProperties.length === 0 
                ? t('favorites.subtitle')
                : favoriteProperties.length === 1 
                  ? t('favorites.subtitle_with_count', { count: favoriteProperties.length })
                  : t('favorites.subtitle_with_count_plural', { count: favoriteProperties.length })
              }
            </p>
          </div>

          {/* Content */}
          {favoriteProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  className="h-full"
                />
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}