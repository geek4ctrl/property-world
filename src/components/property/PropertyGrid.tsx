import { Property } from '@/types';
import PropertyCard from './PropertyCard';
import { memo, useMemo } from 'react';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  emptyMessage?: string;
}

const SkeletonCard = memo(function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-300"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded mb-3 w-1/2"></div>
        <div className="flex gap-4 mb-3">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="flex items-center pt-3 border-t border-gray-200">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
});

const PropertyGrid = memo(function PropertyGrid({ 
  properties, 
  loading = false, 
  emptyMessage = "No properties found" 
}: PropertyGridProps) {
  const skeletonItems = useMemo(() => 
    Array.from({ length: 6 }, (_, index) => (
      <SkeletonCard key={`skeleton-${index}`} />
    )), []
  );

  const renderedProperties = useMemo(() => 
    properties.map((property) => (
      <PropertyCard 
        key={property.id} 
        property={property} 
        className="h-full"
      />
    )), [properties]
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonItems}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600">Try adjusting your search criteria or browse all properties.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {renderedProperties}
    </div>
  );
});

export default PropertyGrid;