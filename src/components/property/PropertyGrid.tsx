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
    properties.map((property, index) => (
      <div 
        key={property.id} 
        className="animate-fadeInUp hover:z-10 relative"
        style={{ 
          animationDelay: `${Math.min(index * 100, 800)}ms`,
          animationFillMode: 'both'
        }}
      >
        <PropertyCard 
          property={property} 
          className="h-full transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
        />
      </div>
    )), [properties]
  );

  if (loading) {
    return <PropertyGridSkeleton count={6} />;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-20 animate-fadeInUp">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{emptyMessage}</h3>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Try adjusting your search criteria or browse all properties.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Browse All Properties
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105">
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {renderedProperties}
    </div>
  );
});

PropertyGrid.displayName = 'PropertyGrid';

export default PropertyGrid;