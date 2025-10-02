'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property, ListingType } from '@/types';
import { useTranslation } from '@/i18n/translation';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useUserProfile';
import { useToastContext } from '@/contexts/ToastContext';
import { formatPrice, formatPropertyType, formatListingType, formatDate } from '@/lib/utils';

import { sampleProperties } from '@/data/sampleProperties';
import PropertyMap from '@/components/map/PropertyMap';
import PropertyGrid from '@/components/property/PropertyGrid';
import ImageGallery from '@/components/property/ImageGallery';
import ContactForm from '@/components/forms/ContactForm';
import MortgageCalculator from '@/components/property/MortgageCalculator';
import PropertySharing from '@/components/property/PropertySharing';
import ViewingScheduler from '@/components/property/ViewingScheduler';
import { PropertyErrorBoundary, MapErrorBoundary } from '@/components/ui/SpecializedErrorBoundaries';

interface PropertyDetailPageProps {
  property: Property;
}

export default function PropertyDetailPage({ property }: PropertyDetailPageProps) {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites(user);
  const { success, error } = useToastContext();
  
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMortgageCalc, setShowMortgageCalc] = useState(false);
  const [showSharing, setShowSharing] = useState(false);
  const [showViewingScheduler, setShowViewingScheduler] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const isPropertyFavorited = isFavorite(property.id);

  // Find similar properties
  const similarProperties = useMemo(() => {
    return sampleProperties
      .filter(p => 
        p.id !== property.id && 
        p.listingType === property.listingType &&
        p.propertyType === property.propertyType &&
        Math.abs(p.price - property.price) <= property.price * 0.3 // Within 30% price range
      )
      .slice(0, 3);
  }, [property]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      error(t('favorites.sign_in_to_favorite'));
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isPropertyFavorited) {
        await removeFavorite(property.id);
        success(t('favorites.remove_success'));
      } else {
        await addFavorite(property.id);
        success(t('favorites.add_success'));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      error(t('favorites.generic_error'));
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Native share failed:', err);
        // User cancelled share or not supported, show modal
        setShowSharing(true);
      }
    } else {
      // Show sharing modal
      setShowSharing(true);
    }
  };

  const handleViewingRequest = async (viewingData: any) => {
    try {
      // In a real app, this would send to your backend
      console.log('Viewing request submitted:', viewingData);
      success('Viewing request sent successfully! The agent will contact you soon.');
    } catch (err) {
      console.error('Error submitting viewing request:', err);
      error('Failed to submit viewing request. Please try again.');
    }
  };

  const formatPriceWithCurrency = (price: number) => {
    return formatPrice(price, property.currency);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 overflow-hidden">
            <Link href="/" className="hover:text-blue-600 transition-colors whitespace-nowrap">
              {t('navigation.home')}
            </Link>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/properties" className="hover:text-blue-600 transition-colors whitespace-nowrap">
              {t('navigation.properties')}
            </Link>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium truncate min-w-0">{property.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            <PropertyErrorBoundary>
              {/* Header Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                <div className="space-y-4 sm:space-y-0 sm:flex sm:items-start sm:justify-between mb-4">
                  <div className="flex-1 sm:pr-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2 sm:mb-4">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm sm:text-base">
                        {property.address.suburb}, {property.address.city}, {property.address.province}
                      </span>
                    </div>
                  </div>
                  
                  <div className="sm:text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                      {formatPriceWithCurrency(property.price)}
                      {property.listingType === ListingType.TO_RENT && (
                        <span className="text-base sm:text-lg font-normal text-gray-600 ml-1">
                          {t('property.per_month')}
                        </span>
                      )}
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      property.listingType === ListingType.FOR_SALE
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {formatListingType(property.listingType, t)}
                    </div>
                  </div>
                </div>

                {/* Key Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      {property.bedrooms}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">{t('property.bedrooms')}</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      {property.bathrooms}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">{t('property.bathrooms')}</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      {property.garages || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">{t('property.garages')}</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      {property.squareMeters}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">m²</div>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <ImageGallery 
                  images={property.images}
                  propertyTitle={property.title}
                  className="w-full"
                />
              </div>

              {/* Property Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('property.description')}
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="leading-relaxed">{property.description}</p>
                </div>
              </div>

              {/* Features & Amenities */}
              {property.features && property.features.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('property.features_amenities')}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={`feature-${index}-${feature.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('property.property_details')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('property.property_id')}</span>
                      <span className="font-medium text-gray-900">{property.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('common.property_type')}</span>
                      <span className="font-medium text-gray-900">{formatPropertyType(property.propertyType, t)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('property.listing_date')}</span>
                      <span className="font-medium text-gray-900">{formatDate(property.dateAdded, locale)}</span>
                    </div>
                    {property.erfSize && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{t('property.land_size')}</span>
                        <span className="font-medium text-gray-900">{property.erfSize}m²</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('common.bedrooms')}</span>
                      <span className="font-medium text-gray-900">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('common.bathrooms')}</span>
                      <span className="font-medium text-gray-900">{property.bathrooms}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('property.garages')}</span>
                      <span className="font-medium text-gray-900">{property.garages || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('search.property_size')}</span>
                      <span className="font-medium text-gray-900">{property.squareMeters}m²</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Map */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('property.location')}
                </h2>
                <div className="mb-6">
                  <div className="text-gray-700 space-y-1">
                    <p className="font-medium">{property.address.street}</p>
                    <p>{property.address.suburb}, {property.address.city}</p>
                    <p>{property.address.province} {property.address.postalCode}</p>
                    <p>{property.address.country}</p>
                  </div>
                </div>
                
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <MapErrorBoundary>
                    <PropertyMap 
                      property={property} 
                      className="w-full h-64"
                    />
                  </MapErrorBoundary>
                </div>
              </div>

              {/* Similar Properties */}
              {similarProperties.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {t('property.similar_properties')}
                    </h2>
                    <Link 
                      href="/properties" 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t('property.view_all_similar')} →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PropertyGrid 
                      properties={similarProperties}
                    />
                  </div>
                </div>
              )}
            </PropertyErrorBoundary>
          </div>

          {/* Right Column - Agent & Actions */}
          <div className="lg:col-span-1">
            <PropertyErrorBoundary>
              {/* Agent Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  {t('property.contact_agent')}
                </h3>

                <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                  {property.agent.profileImage && !avatarError ? (
                    <Image
                      src={property.agent.profileImage}
                      alt={property.agent.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-base sm:text-lg font-bold">
                      {property.agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">{property.agent.name}</h4>
                    <p className="text-gray-600 text-sm truncate">{property.agent.agency}</p>
                    {property.agent.licenseNumber && (
                      <p className="text-xs text-gray-500 truncate">License: {property.agent.licenseNumber}</p>
                    )}
                  </div>
                </div>

                {property.agent.bio && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {property.agent.bio}
                  </p>
                )}

                {/* Contact Actions */}
                <div className="space-y-3 mb-6">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center justify-center space-x-3 w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{property.agent.phone}</span>
                  </a>

                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center justify-center space-x-3 w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{property.agent.email}</span>
                  </a>

                  <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="w-full p-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    {t('property.send_message')}
                  </button>
                </div>

                {/* Contact Form */}
                {showContactForm && (
                  <div className="border-t border-gray-200 pt-6">
                    <ContactForm 
                      onSubmit={(data) => {
                        console.log('Contact form submitted:', data);
                        success('Message sent successfully!');
                        setShowContactForm(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  {t('property.quick_actions')}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <button 
                    onClick={handleFavoriteToggle}
                    disabled={favoriteLoading}
                    className={`w-full flex items-center justify-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg transition-colors font-medium text-sm sm:text-base ${
                      isPropertyFavorited
                        ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <svg 
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${favoriteLoading ? 'animate-pulse' : ''}`} 
                      fill={isPropertyFavorited ? 'currentColor' : 'none'} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>
                      {isPropertyFavorited ? 'Remove from Favorites' : t('property.save_to_favorites')}
                    </span>
                  </button>

                  <button 
                    onClick={handleShare}
                    className="w-full flex items-center justify-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>{t('property.share')}</span>
                  </button>

                  <button 
                    onClick={() => setShowMortgageCalc(!showMortgageCalc)}
                    className="w-full flex items-center justify-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>{t('property.mortgage_calculator')}</span>
                  </button>

                  <button 
                    onClick={() => setShowViewingScheduler(true)}
                    className="w-full flex items-center justify-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-blue-50 text-blue-600 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{t('property.schedule_viewing')}</span>
                  </button>

                  <button 
                    className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{t('property.schedule_viewing')}</span>
                  </button>
                </div>

                {/* Mortgage Calculator */}
                {showMortgageCalc && (
                  <div className="mt-6">
                    <MortgageCalculator 
                      propertyPrice={property.price}
                      className="shadow-none border-0 bg-gray-50"
                    />
                  </div>
                )}
              </div>
            </PropertyErrorBoundary>
          </div>
        </div>
      </div>

      {/* Sharing Modal */}
      {showSharing && (
        <PropertySharing 
          property={property} 
          onClose={() => setShowSharing(false)} 
        />
      )}

      {/* Viewing Scheduler Modal */}
      {showViewingScheduler && (
        <ViewingScheduler 
          property={property} 
          onClose={() => setShowViewingScheduler(false)}
          onSubmit={handleViewingRequest}
        />
      )}
    </div>
  );
}