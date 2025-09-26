import { Property } from '@/types';
import PropertyCard from './PropertyCard';
import PropertyGridSkeleton from '@/components/ui/PropertyGridSkeleton';
import { memo, useMemo } from 'react';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  emptyMessage?: string;
}

const PropertyGrid = memo(function PropertyGrid({ 
  properties, 
  loading = false, 
  emptyMessage = "No properties found" 
}: PropertyGridProps) {
  const renderedProperties = useMemo(() => 
    properties.map((property) => (
      <div key={property.id} className="fade-in">
        <PropertyCard 
          property={property} 
          className="h-full"
        />
      </div>
    )), [properties]
  );

  if (loading) {
    return <PropertyGridSkeleton count={6} />;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 fade-in">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600">Try adjusting your search criteria or browse all properties.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {renderedProperties}
    </div>
  );
});

PropertyGrid.displayName = 'PropertyGrid';

export default PropertyGrid;