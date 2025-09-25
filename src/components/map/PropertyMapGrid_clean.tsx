'use client';

import { useRef, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Property, ListingType } from '@/types';
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
const getMarkerColor = (propertyType: string) => {
  switch (propertyType) {
    case 'house': return '#10b981'; // green
    case 'apartment': return '#3b82f6'; // blue
    case 'townhouse': return '#f59e0b'; // amber
    case 'office': return '#8b5cf6'; // purple
    case 'student': return '#ef4444'; // red
    case 'flat': return '#06b6d4'; // cyan
    case 'commercial': return '#dc2626'; // red
    default: return '#6b7280'; // gray
  }
};

// Helper function to get property type icon
const getPropertyTypeIcon = (propertyType: string): string => {
  switch (propertyType) {
    case 'house': return 'H';
    case 'apartment': return 'A';
    case 'townhouse': return 'T';
    case 'office': return 'O';
    case 'student': return 'S';
    case 'flat': return 'F';
    case 'commercial': return 'C';
    default: return 'P';
  }
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
  // Note: selectedProperty state removed as it wasn't being used
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: -26.2041, lng: 28.0473 }); // Johannesburg
  const [mapZoom, setMapZoom] = useState(10);
  
  // Filter properties with coordinates
  const validProperties = useMemo(() => 
    properties.filter(p => p.coordinates), 
    [properties]
  );

  // Calculate map bounds to fit all properties
  const mapBounds = useMemo(() => {
    if (validProperties.length === 0) return null;
    
    const lats = validProperties.map(p => p.coordinates!.lat);
    const lngs = validProperties.map(p => p.coordinates!.lng);
    
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ] as [[number, number], [number, number]];
  }, [validProperties]);

  const handlePropertySelect = useCallback((property: Property) => {
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  }, [onPropertySelect]);

  const handleMapMoved = useCallback((center: { lat: number; lng: number }, zoom: number) => {
    setMapCenter(center);
    setMapZoom(zoom);
    if (onMapMoved) {
      onMapMoved(center, zoom);
    }
  }, [onMapMoved]);

  if (validProperties.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500 p-8">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-lg font-medium">No properties with locations found</p>
          <p className="text-sm">Properties need coordinates to be displayed on the map</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        bounds={mapBounds || undefined}
        className="h-full w-full rounded-lg z-0"
        scrollWheelZoom={true}
        touchZoom={true}
        doubleClickZoom={true}
        dragging={true}
        zoomControl={true}
        style={{ minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEventsHandler 
          onMapBoundsChange={onMapBoundsChange}
          onMapMoved={handleMapMoved}
          onSetShowSearchArea={setShowSearchArea}
        />

        {validProperties.map((property) => (
          <Marker
            key={property.id}
            position={[property.coordinates!.lat, property.coordinates!.lng]}
            eventHandlers={{
              click: () => handlePropertySelect(property),
            }}
          >
            <Popup>
              <div className="p-4 min-w-72 max-w-80">
                <div className="flex items-start space-x-4">
                  <img 
                    src={property.images[0]?.url || '/placeholder-property.jpg'} 
                    alt={property.title} 
                    className="w-24 h-20 object-cover rounded-lg shadow-sm flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base mb-2 leading-tight">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {property.address.suburb}, {property.address.city}
                    </p>
                    <p className="text-lg font-bold text-blue-600 mb-3">
                      {property.currency === 'ZAR' ? 'R' : property.currency} {property.price.toLocaleString()}
                      {property.listingType === ListingType.TO_RENT && (
                        <span className="text-sm font-normal text-gray-500">/month</span>
                      )}
                    </p>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                        </svg>
                        {property.bedrooms} beds
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                        </svg>
                        {property.bathrooms} baths
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>{property.squareMeters}m²</span>
                    </div>
                  </div>
                </div>
                <a 
                  href={`/properties/${property.id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
                >
                  View Full Details
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {showSearchButton && showSearchArea && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={() => {
              setShowSearchArea(false);
              // Trigger search in current area
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search This Area</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyMapGrid;