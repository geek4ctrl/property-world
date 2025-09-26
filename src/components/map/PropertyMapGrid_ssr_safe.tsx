'use client';

import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Property, ListingType, PropertyType } from '@/types';

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

const PropertyMapGrid = ({ 
  properties, 
  className = '', 
  onPropertySelect,
  onMapBoundsChange,
  onMapMoved,
  showSearchButton = false
}: PropertyMapGridProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [isClient, setIsClient] = useState(false);

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
    
    // Zoom levels
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
    if (mapInstanceRef.current && onMapBoundsChange) {
      const map = mapInstanceRef.current;
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

  // Initialize map only on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || propertiesWithCoords.length === 0) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const initializeMap = async () => {
      try {
        // Dynamic imports for client-side only
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        if (!isMounted) return;

        // Fix for default markers in Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Clear existing map if it exists
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Create map
        const map = L.map(mapRef.current!, {
          center: mapConfig.center as [number, number],
          zoom: mapConfig.zoom,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true,
          zoomControl: true,
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Clear existing markers
        markersRef.current.forEach(marker => map.removeLayer(marker));
        markersRef.current = [];

        // Add markers for each property
        propertiesWithCoords.forEach((property) => {
          const coords = property.coordinates;
          if (!coords) return;
          
          const markerColor = getMarkerColor(property.propertyType);
          
          // Create custom icon
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                background-color: ${markerColor};
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
          
          const marker = L.marker([coords.lat, coords.lng], {
            icon: customIcon
          }).addTo(map);

          // Add popup
          const popupContent = `
            <div style="max-width: 250px;">
              <div style="font-weight: bold; color: #1f2937; margin-bottom: 8px;">
                ${property.title}
              </div>
              <div style="margin-bottom: 4px;">
                <div style="font-size: 14px; color: #6b7280;">
                  📍 ${property.address.street}, ${property.address.suburb}
                </div>
                <div style="font-size: 14px; margin-top: 4px;">
                  <span style="font-weight: 600; color: #059669;">
                    ${formatPrice(property.price, property.currency)}
                  </span>
                  <span style="color: #6b7280; margin-left: 8px;">
                    • ${formatListingType(property.listingType)}
                  </span>
                </div>
                <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">
                  🏠 ${property.bedrooms} bed • ${property.bathrooms} bath • ${property.squareMeters}m²
                </div>
              </div>
              <button 
                onclick="window.selectProperty?.('${property.id}')"
                style="
                  margin-top: 12px; 
                  width: 100%; 
                  padding: 8px 12px; 
                  background-color: #2563eb; 
                  color: white; 
                  font-size: 14px; 
                  font-weight: 500; 
                  border-radius: 6px; 
                  border: none; 
                  cursor: pointer;
                  transition: background-color 0.2s;
                "
                onmouseover="this.style.backgroundColor='#1d4ed8'"
                onmouseout="this.style.backgroundColor='#2563eb'"
              >
                View Details
              </button>
            </div>
          `;

          marker.bindPopup(popupContent);
          
          // Handle marker click
          marker.on('click', () => handlePropertySelection(property));
          
          markersRef.current.push(marker);
        });

        // Store map instance
        mapInstanceRef.current = map;

        // Set up property selection callback
        (window as any).selectProperty = (propertyId: string) => {
          const property = propertiesWithCoords.find(p => p.id === propertyId);
          if (property) {
            handlePropertySelection(property);
          }
        };

        // Add map event listeners for bounds change
        if (onMapBoundsChange || onMapMoved) {
          let moveTimeout: NodeJS.Timeout;
          
          const handleMapMove = () => {
            if (!showSearchButton) return;
            
            setShowSearchArea(true);
            
            // Clear existing timeout
            if (moveTimeout) clearTimeout(moveTimeout);
            
            // Set new timeout to notify parent after user stops moving
            moveTimeout = setTimeout(() => {
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
              
              if (onMapBoundsChange) {
                onMapBoundsChange(mapBounds);
              }
              
              if (onMapMoved) {
                onMapMoved({ lat: center.lat, lng: center.lng }, zoom);
              }
            }, 500);
          };
          
          map.on('moveend', handleMapMove);
          map.on('zoomend', handleMapMove);
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading map:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      // Clean up global callback
      if ((window as any).selectProperty) {
        delete (window as any).selectProperty;
      }
    };
  }, [isClient, propertiesWithCoords, mapConfig, handlePropertySelection, onMapBoundsChange, onMapMoved, showSearchButton]);

  if (!isClient) {
    return (
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
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200">
      <div 
        ref={mapRef} 
        className={`${className} bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl`}
        style={{ height: '70vh', minHeight: '600px', width: '100%' }}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 rounded-xl">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-top-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading map...</p>
            <p className="text-gray-500 text-sm">Setting up interactive map</p>
          </div>
        </div>
      )}
      
      {/* Search This Area Button */}
      {showSearchButton && showSearchArea && !isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1 border border-gray-200">
            <button
              onClick={handleSearchThisArea}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
      {!isLoading && (
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
      )}
    </div>
  );
};

export default PropertyMapGrid;