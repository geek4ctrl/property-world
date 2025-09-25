'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Property, PropertyType, ListingType } from '@/types';
import { useTranslation, formatPrice as formatPriceI18n, formatPropertyType } from '@/i18n/translation';
import { useComparison } from '@/contexts/ComparisonContext';
import { generateSmartAvatar } from '@/lib/avatarUtils';

interface PropertyCardProps {
  readonly property: Property;
  readonly className?: string;
  readonly variant?: 'default' | 'compact' | 'featured';
}

export default function PropertyCard({ property, className = '', variant = 'default' }: PropertyCardProps) {
  const { t, locale } = useTranslation();
  const { addToComparison, removeFromComparison, isInComparison, maxReached } = useComparison();
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

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

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
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
      className={`group bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        isFeatured 
          ? 'shadow-xl border-2 border-yellow-200' 
          : 'shadow-md'
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative overflow-hidden">
          {/* Property Image */}
          <div className={`relative bg-gray-200 overflow-hidden ${
            isCompact ? 'aspect-[3/2]' : 'aspect-[4/3]'
          }`}>
            {imageLoading && (
              <div className="absolute inset-0 loading-skeleton flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400 animate-pulse-slow" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <Image
              src={currentImage?.url || '/placeholder-property.jpg'}
              alt={currentImage?.alt || property.title}
              fill
              className={`object-cover transition-transform duration-500 ${
                isHovered ? 'scale-105' : 'scale-100'
              } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setImageLoading(false)}
            />
            
            {/* Image overlay gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`} />
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm ${
              property.listingType === ListingType.FOR_SALE 
                ? 'bg-green-600/90 text-white' 
                : 'bg-blue-600/90 text-white'
            }`}>
              {getListingTypeLabel(property.listingType)}
            </span>
            {property.isFeatured && (
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1.5 text-xs font-bold rounded-full shadow-lg">
                ✨ Featured
              </span>
            )}
            {property.isNew && (
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 text-xs font-bold rounded-full shadow-lg">
                New
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex space-x-2 z-10">
            {/* Compare Button */}
            <button 
              onClick={handleCompareClick}
              disabled={maxReached && !isInCompare}
              className={`p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 hover:scale-105 ${getCompareButtonClass()}`}
              title={isInCompare ? 'Remove from comparison' : 'Add to comparison'}
            >
              <svg 
                className="w-5 h-5 transition-colors duration-200" 
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

            {/* Save Button */}
            <button 
              onClick={handleFavoriteClick}
              className={`p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 hover:scale-105 ${
                isFavorited ? 'text-red-500 bg-red-50/90' : 'text-gray-600 hover:bg-white'
              }`}
            >
              <svg 
                className={`w-5 h-5 transition-colors duration-200 ${
                  isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'
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
            </button>
          </div>

          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={(e) => handleImageNavigation(e, 'prev')}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 z-10"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => handleImageNavigation(e, 'next')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 z-10"
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

        {/* Property Details */}
        <div className={`p-5 ${isCompact ? 'p-4' : 'p-5'}`}>
          {/* Price */}
          <div className="mb-3">
            <p className={`font-bold text-gray-900 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              {formatPrice(property.price, property.currency)}
              {property.listingType === ListingType.TO_RENT && (
                <span className="text-sm font-normal text-gray-600 ml-1">/{t('common.month')}</span>
              )}
            </p>
          </div>

          {/* Title */}
          <h3 className={`font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 ${
            isCompact ? 'text-base' : 'text-lg'
          }`}>
            {property.title}
          </h3>

          {/* Location */}
          <p className="text-gray-600 mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{property.address.suburb}, {property.address.city}</span>
          </p>

          {/* Property Details */}
          <div className="flex items-center text-sm text-gray-600 mb-4 gap-4">
            {property.bedrooms > 0 && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                </svg>
                <span className="font-medium">{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span className="font-medium">{property.bathrooms}</span>
              </div>
            )}
            {property.garages > 0 && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8v8m0-8h2m-2 8h2m8-8v8m0-8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m0-8v8" />
                </svg>
                <span className="font-medium">{property.garages}</span>
              </div>
            )}
          </div>

          {/* Square Meters & Property Type */}
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="font-medium">{property.squareMeters}m²</span>
            </span>
            <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-full text-xs">
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