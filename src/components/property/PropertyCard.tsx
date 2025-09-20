import Image from 'next/image';
import Link from 'next/link';
import { Property, PropertyType, ListingType } from '@/types';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export default function PropertyCard({ property, className = '' }: PropertyCardProps) {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'ZAR') {
      return `R ${price.toLocaleString()}`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };

  const getPropertyTypeLabel = (type: PropertyType) => {
    const labels = {
      [PropertyType.HOUSE]: 'House',
      [PropertyType.APARTMENT]: 'Apartment',
      [PropertyType.TOWNHOUSE]: 'Townhouse',
      [PropertyType.FLAT]: 'Flat',
      [PropertyType.VACANT_LAND]: 'Vacant Land',
      [PropertyType.COMMERCIAL]: 'Commercial',
      [PropertyType.INDUSTRIAL]: 'Industrial',
      [PropertyType.FARM]: 'Farm',
      [PropertyType.OFFICE]: 'Office',
      [PropertyType.RETAIL]: 'Retail'
    };
    return labels[type] || type;
  };

  const getListingTypeLabel = (type: ListingType) => {
    const labels = {
      [ListingType.FOR_SALE]: 'For Sale',
      [ListingType.TO_RENT]: 'To Rent',
      [ListingType.SOLD]: 'Sold',
      [ListingType.RENTED]: 'Rented'
    };
    return labels[type] || type;
  };

  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0];

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <Link href={`/properties/${property.id}`}>
        <div className="relative">
          {/* Property Image */}
          <div className="aspect-[4/3] relative bg-gray-200">
            <Image
              src={primaryImage?.url || '/placeholder-property.jpg'}
              alt={primaryImage?.alt || property.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded ${
              property.listingType === ListingType.FOR_SALE 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white'
            }`}>
              {getListingTypeLabel(property.listingType)}
            </span>
            {property.isFeatured && (
              <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded">
                Featured
              </span>
            )}
          </div>

          {/* Save Button */}
          <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Image Count */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 text-xs rounded flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {property.images.length}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(property.price, property.currency)}
              {property.listingType === ListingType.TO_RENT && (
                <span className="text-sm font-normal text-gray-600"> /month</span>
              )}
            </p>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <p className="text-gray-600 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.address.suburb}, {property.address.city}
          </p>

          {/* Property Details */}
          <div className="flex items-center text-sm text-gray-600 mb-3 gap-4">
            {property.bedrooms > 0 && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                </svg>
                {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
              </div>
            )}
            {property.garages > 0 && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8v8m0-8h2m-2 8h2m8-8v8m0-8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m0-8v8" />
                </svg>
                {property.garages} garage{property.garages !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Square Meters */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {property.squareMeters}m²
            </span>
            <span className="font-medium text-blue-600">
              {getPropertyTypeLabel(property.propertyType)}
            </span>
          </div>

          {/* Agent Info */}
          <div className="flex items-center pt-3 border-t border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 overflow-hidden">
              {property.agent.profileImage ? (
                <Image
                  src={property.agent.profileImage}
                  alt={property.agent.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-xs">
                  {property.agent.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{property.agent.name}</p>
              <p className="text-xs text-gray-600">{property.agent.agency}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}