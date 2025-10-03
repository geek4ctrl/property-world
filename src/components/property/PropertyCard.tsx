'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Property, PropertyType, ListingType } from '@/types';
import { useTranslation, formatPrice as formatPriceI18n, formatPropertyType } from '@/i18n/translation';
import { useComparison } from '@/contexts/ComparisonContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useUserProfile';
import { useToastContext } from '@/contexts/ToastContext';
import { generateSmartAvatar } from '@/lib/avatarUtils';

interface PropertyCardProps {
  readonly property: Property;
  readonly className?: string;
  readonly variant?: 'default' | 'compact' | 'featured';
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function PropertyCard({ property, className = '', variant = 'default' }: PropertyCardProps) {
  const { t, locale } = useTranslation();
  const { addToComparison, removeFromComparison, isInComparison, maxReached } = useComparison();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, loading: favoritesLoading } = useFavorites(user);
  const { success, error } = useToastContext();
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [favoriteActionLoading, setFavoriteActionLoading] = useState(false);

  const isFavorited = isFavorite(property.id);

  const formatPrice = (price: number, currency: string) => {
    return formatPriceI18n(price, currency, locale);
  };

  const getPropertyTypeLabel = (type: PropertyType) => {
    return formatPropertyType(type, locale);
  };

  const getListingTypeLabel = (type: ListingType) => {
    const labels = {
      [ListingType.FOR_SALE]: t('property.for_sale'),
      [ListingType.TO_RENT]: t('property.to_rent'),
      [ListingType.SOLD]: t('property.sold'),
      [ListingType.RENTED]: t('property.rented')
    };
    return labels[type] || type;
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setFavoriteActionLoading(true);
    
    try {
      if (isFavorited) {
        const result = await removeFavorite(property.id);
        if (result && !result.success) {
          error(t('favorites.remove_error'));
        } else {
          success(t('favorites.remove_success'));
        }
      } else {
        const result = await addFavorite(property.id);
        if (result && !result.success) {
          error(t('favorites.add_error'));
        } else {
          success(t('favorites.add_success'));
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      error(t('favorites.generic_error'));
    } finally {
      setFavoriteActionLoading(false);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInComparison(property.id)) {
      removeFromComparison(property.id);
    } else {
      const added = addToComparison(property);
      if (!added && maxReached) {
        // Could show a toast notification here
        alert('You can only compare up to 3 properties at once.');
      }
    }
  };

  const isInCompare = isInComparison(property.id);

  const getCompareButtonClass = () => {
    if (isInCompare) {
      return 'text-blue-600 bg-blue-50/90';
    }
    if (maxReached) {
      return 'text-gray-400 bg-gray-50/90 cursor-not-allowed';
    }
    return 'text-gray-600 hover:bg-white hover:text-blue-600';
  };

  const getImageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      return currentImageIndex === property.images.length - 1 ? 0 : currentImageIndex + 1;
    }
    return currentImageIndex === 0 ? property.images.length - 1 : currentImageIndex - 1;
  };

  const handleImageNavigation = (e: React.MouseEvent, direction: 'prev' | 'next') => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(getImageNavigation(direction));
  };

  const currentImage = property.images[currentImageIndex] || property.images[0];
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <article 
      className={`group glass-card bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 hover:scale-[1.02] ${
        isFeatured 
          ? 'shadow-2xl border-2 border-gradient-to-r from-yellow-400 to-orange-400 ring-2 ring-yellow-400/20' 
          : 'shadow-lg hover:shadow-xl'
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative overflow-hidden">
          {/* Property Image */}
          <div className={`relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden ${
            isCompact ? 'aspect-[3/2]' : 'aspect-[4/3]'
          }`}>
            {imageLoading && (
              <div className="absolute inset-0 loading-skeleton flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <Image
              src={currentImage?.url || '/placeholder-property.jpg'}
              alt={currentImage?.alt || property.title}
              fill
              className={`object-cover transition-all duration-700 ease-out ${
                isHovered ? 'scale-110 rotate-1' : 'scale-100 rotate-0'
              } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setImageLoading(false)}
            />
            
            {/* Enhanced image overlay gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-40'
            }`} />
          </div>
          
          {/* Enhanced Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <span className={`px-4 py-2 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm border border-white/20 ${
              property.listingType === ListingType.FOR_SALE 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            }`}>
              {getListingTypeLabel(property.listingType)}
            </span>
            {property.isFeatured && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-xs font-bold rounded-full shadow-lg border border-white/20 backdrop-blur-sm flex items-center space-x-1">
                <span className="text-sm">✨</span>
                <span>Featured</span>
              </span>
            )}
            {property.isNew && (
              <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 text-xs font-bold rounded-full shadow-lg border border-white/20 backdrop-blur-sm animate-pulse">
                New
              </span>
            )}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
            {/* Compare Button */}
            <button 
              onClick={handleCompareClick}
              disabled={maxReached && !isInCompare}
              className={`group p-3 backdrop-blur-xl rounded-xl shadow-lg transition-all duration-300 hover:scale-110 border border-white/20 ${
                isInCompare 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/25' 
                  : maxReached 
                    ? 'bg-white/60 text-gray-400 cursor-not-allowed' 
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-xl'
              }`}
              title={isInCompare ? 'Remove from comparison' : 'Add to comparison'}
              aria-label={isInCompare ? 'Remove from comparison' : 'Add to comparison'}
            >
              <svg 
                className="w-5 h-5 transition-all duration-300 group-hover:scale-110" 
                fill={isInCompare ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                />
              </svg>
            </button>

            {/* Enhanced Save Button */}
            <button 
              onClick={handleFavoriteClick}
              disabled={favoriteActionLoading || favoritesLoading}
              className={`group p-3 backdrop-blur-xl rounded-xl shadow-lg transition-all duration-300 hover:scale-110 border border-white/20 disabled:cursor-not-allowed disabled:opacity-50 ${
                isFavorited 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-red-500/25' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 hover:shadow-xl'
              }`}
              aria-label={isFavorited ? t('favorites.heart_tooltip_remove') : t('favorites.heart_tooltip_add')}
              title={
                (() => {
                  if (!user) return t('favorites.sign_in_to_favorite');
                  return isFavorited ? t('favorites.heart_tooltip_remove') : t('favorites.heart_tooltip_add');
                })()
              }
            >
              {favoriteActionLoading ? (
                <svg 
                  className="w-5 h-5 animate-spin" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg 
                  className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${
                    isFavorited ? 'text-white fill-current' : 'text-gray-600'
                  }`} 
                  fill={isFavorited ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={(e) => handleImageNavigation(e, 'prev')}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 z-10"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => handleImageNavigation(e, 'next')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 z-10"
                aria-label="Next image"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Count */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 text-xs rounded-full flex items-center shadow-lg">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {currentImageIndex + 1}/{property.images.length}
            </div>
          )}

          {/* Image dots */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 left-3 flex gap-1">
              {property.images.map((image, index) => (
                <button
                  key={`image-${property.id}-${index}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-white shadow-lg scale-125' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Property Details */}
        <div className={`p-6 bg-gradient-to-br from-white to-gray-50/50 ${isCompact ? 'p-5' : 'p-6'}`}>
          {/* Price */}
          <div className="mb-4">
            <p className={`font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent ${isCompact ? 'text-xl' : 'text-2xl lg:text-3xl'}`}>
              {formatPrice(property.price, property.currency)}
              {property.listingType === ListingType.TO_RENT && (
                <span className="text-sm font-normal text-gray-500 ml-1">/{t('common.month')}</span>
              )}
            </p>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 ${isCompact ? 'text-base' : 'text-lg lg:text-xl'}`}>
            {property.title}
          </h3>

          {/* Location */}
          <p className="text-gray-600 mb-5 flex items-center group cursor-pointer">
            <div className="w-5 h-5 mr-3 p-1 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="truncate group-hover:text-blue-600 transition-colors duration-300 font-medium">
              {property.address.suburb}, {property.address.city}
            </span>
          </p>

          {/* Enhanced Property Details */}
          <div className="flex items-center text-sm text-gray-600 mb-5 gap-6">
            {property.bedrooms > 0 && (
              <div className="flex items-center group">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-blue-100 transition-colors duration-300">
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center group">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-purple-100 transition-colors duration-300">
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-purple-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">{property.bathrooms}</span>
              </div>
            )}
            {property.garages > 0 && (
              <div className="flex items-center group">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-green-100 transition-colors duration-300">
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8v8m0-8h2m-2 8h2m8-8v8m0-8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m0-8v8" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">{property.garages}</span>
              </div>
            )}
          </div>

          {/* Enhanced Square Meters & Property Type */}
          <div className="flex items-center justify-between text-sm mb-6">
            <span className="flex items-center text-gray-600 group">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-indigo-200 transition-colors duration-300">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <span className="font-semibold text-gray-700">{property.squareMeters}m²</span>
            </span>
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-4 py-2 rounded-full text-xs shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              {getPropertyTypeLabel(property.propertyType)}
            </span>
          </div>

          {/* Agent Info */}
          <div className="flex items-center pt-4 border-t border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden flex-shrink-0">
              {property.agent.profileImage && !avatarError ? (
                <Image
                  src={property.agent.profileImage}
                  alt={property.agent.name}
                  width={40}
                  height={40}
                  className="object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <Image
                  src={generateSmartAvatar(property.agent.name)}
                  alt={property.agent.name}
                  width={40}
                  height={40}
                  className="object-cover"
                  onError={(e) => {
                    // Final fallback to initials
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        ${property.agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    `;
                  }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{property.agent.name}</p>
              <p className="text-xs text-gray-500 truncate">{property.agent.agency}</p>
            </div>
            <button className="ml-2 p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}