'use client';

import dynamic from 'next/dynamic';
import { Property } from '@/types';
import { MapBounds } from './PropertyMapGrid';

// Dynamically import the map component with SSR disabled
const PropertyMapGrid = dynamic(() => import('./PropertyMapGrid'), {
  ssr: false,
  loading: () => (
    <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl animate-pulse" style={{ minHeight: '600px', height: '70vh' }}>
        <div className="p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-top-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Preparing map...</p>
              <p className="text-gray-500 text-sm">Loading map components</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
});

interface LazyPropertyMapGridProps {
  properties: Property[];
  className?: string;
  onPropertySelect?: (property: Property) => void;
  onMapBoundsChange?: (bounds: MapBounds) => void;
  onMapMoved?: () => void;
  showSearchButton?: boolean;
}



const LazyPropertyMapGrid = ({ 
  properties, 
  className = '', 
  onPropertySelect,
  onMapBoundsChange,
  onMapMoved,
  showSearchButton
}: LazyPropertyMapGridProps) => {
  return (
    <PropertyMapGrid 
      properties={properties} 
      className={className} 
      onPropertySelect={onPropertySelect}
      onBoundsChange={onMapBoundsChange}
    />
  );
};

export default LazyPropertyMapGrid;