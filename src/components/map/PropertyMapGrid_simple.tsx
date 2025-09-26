'use client';

import React from 'react';
import { Property } from '@/types';

// Map bounds type
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Props interface for PropertyMapGrid component
interface PropertyMapGridProps {
  properties: Property[];
  className?: string;
  onPropertySelect?: (property: Property) => void;
  onMapBoundsChange?: (bounds: MapBounds) => void;
  onMapMoved?: () => void;
  showSearchButton?: boolean;
}

// Temporary stub component for PropertyMapGrid
const PropertyMapGrid: React.FC<PropertyMapGridProps> = ({ 
  properties, 
  className = '', 
  onPropertySelect 
}) => {
  return (
    <div className={`w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="text-gray-600 mb-2">🗺️ Map View</div>
        <div className="text-sm text-gray-500">
          Showing {properties.length} properties
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Map component temporarily disabled for build
        </div>
      </div>
    </div>
  );
};

export default PropertyMapGrid;