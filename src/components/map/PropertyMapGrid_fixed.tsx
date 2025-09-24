'use client';

import { useRef, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Property, ListingType, PropertyType } from '@/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface PropertyMapGridProps {
  properties: Property[];
  className?: string;
  onPropertySelect?: (property: Property) => void;
  onMapBoundsChange?: (bounds: MapBounds) => void;
  onMapMoved?: (center: { lat: number; lng: number }, zoom: number) => void;
  showSearchButton?: boolean;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
  center: { lat: number; lng: number };
  zoom: number;
}

// Helper function to get marker color based on property type
const getMarkerColor = (propertyType: PropertyType) => {
  switch (propertyType) {
    case PropertyType.HOUSE: return '#10b981'; // green
    case PropertyType.APARTMENT: return '#3b82f6'; // blue
    case PropertyType.TOWNHOUSE: return '#f59e0b'; // amber
    case PropertyType.OFFICE: return '#8b5cf6'; // purple
    case PropertyType.FLAT: return '#06b6d4'; // cyan
    case PropertyType.COMMERCIAL: return '#dc2626'; // red
    default: return '#6b7280'; // gray
  }
};

// Helper function to format price
const formatPrice = (price: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price);
};

// Helper function to format listing type
const formatListingType = (type: ListingType) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Create custom colored markers
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
  });
};

// Component to handle map events
interface MapEventsHandlerProps {
  onMapBoundsChange?: (bounds: MapBounds) => void;
  onMapMoved?: (center: { lat: number; lng: number }, zoom: number) => void;
  onSetShowSearchArea?: (show: boolean) => void;
}

const MapEventsHandler = ({ onMapBoundsChange, onMapMoved, onSetShowSearchArea }: MapEventsHandlerProps) => {
  const map = useMap();
  const boundsChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      const center = map.getCenter();
      const zoom = map.getZoom();

      if (onMapMoved) {
        onMapMoved({ lat: center.lat, lng: center.lng }, zoom);
      }

      if (onSetShowSearchArea) {
        onSetShowSearchArea(true);
      }

      // Debounce bounds change events
      if (boundsChangeTimeoutRef.current) {
        clearTimeout(boundsChangeTimeoutRef.current);
      }
      
      boundsChangeTimeoutRef.current = setTimeout(() => {
        if (onMapBoundsChange) {
          const mapBounds: MapBounds = {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
            center: { lat: center.lat, lng: center.lng },
            zoom: zoom
          };
          onMapBoundsChange(mapBounds);
        }
      }, 500);
    },
  });

  return null;
};

const PropertyMapGrid = ({ 
  properties, 
  className = '', 
  onPropertySelect,
  onMapBoundsChange,
  onMapMoved,
  showSearchButton = false
}: PropertyMapGridProps) => {
  const [showSearchArea, setShowSearchArea] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Filter properties with valid coordinates
  const propertiesWithCoords = useMemo(() => {
    return properties.filter(property => 
      property.coordinates && 
      property.coordinates.lat !== 0 && 
      property.coordinates.lng !== 0
    );
  }, [properties]);

  // Calculate center point and zoom for all properties
  const mapConfig = useMemo(() => {
    if (propertiesWithCoords.length === 0) {
      return {
        center: [-29.0852, 26.1596], // Center of South Africa
        zoom: 6 // Country-wide view for South Africa
      };
    }

    // Calculate bounds of all properties
    const latitudes = propertiesWithCoords.map(prop => prop.coordinates?.lat || 0);
    const longitudes = propertiesWithCoords.map(prop => prop.coordinates?.lng || 0);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    // Calculate zoom based on the span of properties
    const latSpan = maxLat - minLat;
    const lngSpan = maxLng - minLng;
    const maxSpan = Math.max(latSpan, lngSpan);
    
    // Zoom levels: 
    // 0-1 degrees: zoom 10 (city level)
    // 1-3 degrees: zoom 8 (regional level) 
    // 3-8 degrees: zoom 6 (province level)
    // 8+ degrees: zoom 5 (country level)
    let zoom = 10;
    if (maxSpan > 1) zoom = 8;
    if (maxSpan > 3) zoom = 6;
    if (maxSpan > 8) zoom = 5;
    
    return {
      center: [centerLat, centerLng],
      zoom: zoom
    };
  }, [propertiesWithCoords]);

  // Handle property selection
  const handlePropertySelection = useCallback((property: Property) => {
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  }, [onPropertySelect]);

  // Handle search this area button
  const handleSearchThisArea = useCallback(() => {
    setShowSearchArea(false);
    if (mapRef.current && onMapBoundsChange) {
      const map = mapRef.current;
      const bounds = map.getBounds();
      const center = map.getCenter();
      const zoom = map.getZoom();
      
      const mapBounds: MapBounds = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
        center: { lat: center.lat, lng: center.lng },
        zoom: zoom
      };
      
      onMapBoundsChange(mapBounds);
    }
  }, [onMapBoundsChange]);

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200">
      <MapContainer
        center={mapConfig.center as [number, number]}
        zoom={mapConfig.zoom}
        style={{ height: '70vh', minHeight: '600px', width: '100%' }}
        className={`${className} rounded-xl`}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapEventsHandler 
          onMapBoundsChange={onMapBoundsChange}
          onMapMoved={onMapMoved}
          onSetShowSearchArea={setShowSearchArea}
        />
        
        {propertiesWithCoords.map((property) => {
          const coords = property.coordinates;
          if (!coords) return null;
          
          const markerColor = getMarkerColor(property.propertyType);
          const customIcon = createCustomIcon(markerColor);
          
          return (
            <Marker
              key={property.id}
              position={[coords.lat, coords.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => handlePropertySelection(property),
              }}
            >
              <Popup>
                <div className="max-w-xs">
                  <div className="font-bold text-gray-900 mb-2">
                    {property.title}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600">
                      📍 {property.address.street}, {property.address.suburb}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-green-600">
                        {formatPrice(property.price, property.currency)}
                      </span>
                      <span className="text-gray-500 ml-2">
                        • {formatListingType(property.listingType)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      🏠 {property.bedrooms} bed • {property.bathrooms} bath • {property.squareMeters}m²
                    </div>
                  </div>
                  <button
                    onClick={() => handlePropertySelection(property)}
                    className="mt-3 w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Search This Area Button */}
      {showSearchButton && showSearchArea && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1 border border-gray-200">
            <button
              onClick={handleSearchThisArea}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 animate-slide-down"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search This Area</span>
              </div>
            </button>
          </div>
        </div>
      )}
      
      {/* Property type legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-[1000] max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
            </svg>
            Property Types
          </h4>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {properties.length} properties
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-100">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
            <span className="text-xs font-medium text-gray-700">Houses</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-100">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
            <span className="text-xs font-medium text-gray-700">Apartments</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-100">
            <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm"></div>
            <span className="text-xs font-medium text-gray-700">Townhouses</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-100">
            <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-sm"></div>
            <span className="text-xs font-medium text-gray-700">Offices</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMapGrid;