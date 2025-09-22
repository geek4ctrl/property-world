import { Property, PropertyType, ListingType, SearchFilters } from '@/types';

export const formatPrice = (price: number, currency: string = 'ZAR'): string => {
  if (currency === 'ZAR') {
    return `R ${price.toLocaleString()}`;
  }
  return `${currency} ${price.toLocaleString()}`;
};

// Note: These functions now accept a t function to support translations
export const formatPropertyType = (type: PropertyType, t?: (key: string) => string): string => {
  if (!t) {
    // Fallback to English if no translation function provided
    const typeMap: Record<PropertyType, string> = {
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
    return typeMap[type] || type;
  }

  const typeMap: Record<PropertyType, string> = {
    [PropertyType.HOUSE]: t('property.house'),
    [PropertyType.APARTMENT]: t('property.apartment'),
    [PropertyType.TOWNHOUSE]: t('property.townhouse'),
    [PropertyType.FLAT]: t('property.flat'),
    [PropertyType.VACANT_LAND]: t('property.vacant_land'),
    [PropertyType.COMMERCIAL]: t('property.commercial'),
    [PropertyType.INDUSTRIAL]: t('property.commercial'), // Using commercial as fallback
    [PropertyType.FARM]: t('property.vacant_land'), // Using vacant_land as fallback
    [PropertyType.OFFICE]: t('property.commercial'), // Using commercial as fallback
    [PropertyType.RETAIL]: t('property.commercial') // Using commercial as fallback
  };
  return typeMap[type] || type;
};

export const formatListingType = (type: ListingType, t?: (key: string) => string): string => {
  if (!t) {
    // Fallback to English if no translation function provided
    const typeMap: Record<ListingType, string> = {
      [ListingType.FOR_SALE]: 'For Sale',
      [ListingType.TO_RENT]: 'To Rent',
      [ListingType.SOLD]: 'Sold',
      [ListingType.RENTED]: 'Rented'
    };
    return typeMap[type] || type;
  }

  const typeMap: Record<ListingType, string> = {
    [ListingType.FOR_SALE]: t('property.for_sale'),
    [ListingType.TO_RENT]: t('property.to_rent'),
    [ListingType.SOLD]: t('property.sold'),
    [ListingType.RENTED]: t('property.rented')
  };
  return typeMap[type] || type;
};

export const formatDate = (date: Date, locale: string = 'en'): string => {
  const localeCode = locale === 'fr' ? 'fr-FR' : 'en-ZA';
  return date.toLocaleDateString(localeCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatArea = (squareMeters: number): string => {
  return `${squareMeters.toLocaleString()}m²`;
};

export const generatePropertyUrl = (property: Property): string => {
  const title = property.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  return `/properties/${property.id}/${title}`;
};

export const filterProperties = (properties: Property[], filters: SearchFilters): Property[] => {
  return properties.filter(property => {
    return (
      matchesListingType(property, filters.listingType) &&
      matchesPropertyType(property, filters.propertyType) &&
      matchesPriceRange(property, filters.minPrice, filters.maxPrice) &&
      matchesBedrooms(property, filters.bedrooms) &&
      matchesBathrooms(property, filters.bathrooms) &&
      matchesLocation(property, filters.location) &&
      matchesFeatures(property, filters.features)
    );
  });
};

const matchesListingType = (property: Property, listingType?: ListingType): boolean => {
  return !listingType || property.listingType === listingType;
};

const matchesPropertyType = (property: Property, propertyTypes?: PropertyType[]): boolean => {
  return !propertyTypes || propertyTypes.length === 0 || propertyTypes.includes(property.propertyType);
};

const matchesPriceRange = (property: Property, minPrice?: number, maxPrice?: number): boolean => {
  const matchesMin = minPrice === undefined || property.price >= minPrice;
  const matchesMax = maxPrice === undefined || property.price <= maxPrice;
  return matchesMin && matchesMax;
};

const matchesBedrooms = (property: Property, bedrooms?: number): boolean => {
  return bedrooms === undefined || property.bedrooms >= bedrooms;
};

const matchesBathrooms = (property: Property, bathrooms?: number): boolean => {
  return bathrooms === undefined || property.bathrooms >= bathrooms;
};

const matchesLocation = (property: Property, location?: string): boolean => {
  if (!location) return true;
  
  const searchLocation = location.toLowerCase();
  return (
    property.address.city.toLowerCase().includes(searchLocation) ||
    property.address.suburb.toLowerCase().includes(searchLocation) ||
    property.address.province.toLowerCase().includes(searchLocation) ||
    property.title.toLowerCase().includes(searchLocation)
  );
};

const matchesFeatures = (property: Property, features?: string[]): boolean => {
  if (!features || features.length === 0) return true;
  
  return features.every((feature: string) => 
    property.features.some(propertyFeature => 
      propertyFeature.toLowerCase().includes(feature.toLowerCase())
    )
  );
};

export const sortProperties = (properties: Property[], sortBy: string): Property[] => {
  const sorted = [...properties];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'date-desc':
      return sorted.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
    case 'date-asc':
      return sorted.sort((a, b) => a.dateAdded.getTime() - b.dateAdded.getTime());
    case 'views-desc':
      return sorted.sort((a, b) => b.views - a.views);
    default:
      return sorted;
  }
};