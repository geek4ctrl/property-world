// File corrupted - using redirect to working implementation
export { default } from './PropertyMapGrid_fixed';
export type { MapBounds } from './PropertyMapGrid_fixed';

// Helper function to get marker color based on property type
const getMarkerColor = (propertyType: string) => {
  switch (propertyType) {
    case 'house': return '#10b981'; // green
    case 'apartment': return '#3b82f6'; // blue
    case 'townhouse': return '#f59e0b'; // amber
    case 'office': return '#8b5cf6'; // purple
    case 'student': return '#ef4444'; // red
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
  const boundsChangeTimeoutRef = useRef<NodeJS.Timeout>();

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
    default: return 'O';
  }
};

// Helper function to handle marker click
const handleMarkerClick = (property: Property, onPropertySelect?: (property: Property) => void) => {
  if (onPropertySelect) {
    onPropertySelect(property);
  }
};

// Helper function to create a marker for a property
const createPropertyMarker = (L: any, property: Property, map: any, onPropertySelect?: (property: Property) => void) => {
  if (!property.coordinates) return null;

  const color = getMarkerColor(property.propertyType);
  
  const customIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="36" height="54" viewBox="0 0 36 54" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="black" flood-opacity="0.3"/>
          </filter>
        </defs>
        <path d="M18 0C8.1 0 0 8.1 0 18c0 18 18 36 18 36s18-18 18-36C36 8.1 27.9 0 18 0z" 
              fill="${color}" 
              stroke="white" 
              stroke-width="2"
              filter="url(#shadow)"/>
        <circle cx="18" cy="18" r="10" fill="white" stroke="${color}" stroke-width="2"/>
        <circle cx="18" cy="18" r="6" fill="${color}"/>
        <text x="18" y="22" text-anchor="middle" fill="white" font-size="8" font-weight="bold" font-family="Arial">
          ${getPropertyTypeIcon(property.propertyType)}
        </text>
      </svg>
    `),
    iconSize: [36, 54],
    iconAnchor: [18, 54],
    popupAnchor: [0, -54],
  });

  // Add marker
  const marker = L.marker([property.coordinates.lat, property.coordinates.lng], {
    icon: customIcon
  }).addTo(map);

  // Add hover effects
  marker.on('mouseover', function(this: any) {
    this.setZIndexOffset(1000);
  });
  
  marker.on('mouseout', function(this: any) {
    this.setZIndexOffset(0);
  });

  // Create popup content
  const popupContent = `
    <div class="p-4 min-w-72 max-w-80 bg-white rounded-lg shadow-lg">
      <div class="flex items-start space-x-4">
        <img src="${property.images[0]?.url || '/placeholder-property.jpg'}" 
             alt="${property.title}" 
             class="w-24 h-20 object-cover rounded-lg shadow-sm flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-gray-900 text-base mb-2 leading-tight">${property.title}</h3>
          <p class="text-sm text-gray-600 mb-3 flex items-center">
            <svg class="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
            ${property.address.suburb}, ${property.address.city}
          </p>
          <p class="text-lg font-bold text-blue-600 mb-3">
            ${property.currency === 'ZAR' ? 'R' : property.currency} ${property.price.toLocaleString()}
            ${property.listingType === ListingType.TO_RENT ? '<span class="text-sm font-normal text-gray-500">/month</span>' : ''}
          </p>
          <div class="flex items-center space-x-3 text-sm text-gray-600 mb-4">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              ${property.bedrooms} beds
            </span>
            <span class="text-gray-300">•</span>
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
              ${property.bathrooms} baths
            </span>
            <span class="text-gray-300">•</span>
            <span>${property.squareMeters}m²</span>
          </div>
        </div>
      </div>
      <a href="/properties/${property.id}" 
         class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors duration-200 shadow-sm">
        View Full Details
      </a>
    </div>
  `;

  marker.bindPopup(popupContent, {
    maxWidth: 320,
    className: 'property-popup',
    closeButton: true,
    autoPan: true
  });

  // Handle marker click
  marker.on('click', () => handleMarkerClick(property, onPropertySelect));

  return marker;
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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Initializing map...');
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [mapHasMoved, setMapHasMoved] = useState(false);

  // Memoize properties with coordinates to avoid recalculation
  const propertiesWithCoords = useMemo(() => 
    properties.filter((p: Property) => p.coordinates), 
    [properties]
  );

  // Memoize the property selection handler
  const handlePropertySelection = useCallback((property: Property) => {
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  }, [onPropertySelect]);

  useEffect(() => {
    if (!mapRef.current || propertiesWithCoords.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingStage('Loading map library...');

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        setLoadingProgress(20);
        setLoadingStage('Setting up map configuration...');
        setLoadingStage('Setting up map configuration...');
        
        // Fix for default markers in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        setLoadingProgress(40);
        setLoadingStage('Creating map instance...');

        // Clear existing map if it exists
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Filter properties with coordinates
        if (propertiesWithCoords.length === 0) {
          setIsLoading(false);
          return;
        }

        setLoadingProgress(60);
        setLoadingStage('Calculating optimal view...');

        // Calculate bounds for all properties
        const bounds = L.latLngBounds(
          propertiesWithCoords.map((p: Property) => [p.coordinates!.lat, p.coordinates!.lng])
        );

        // Create the map
        const mapElement = mapRef.current!;
        const map = L.map(mapElement, {
          zoomControl: false, // We'll add custom controls
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true,
          attributionControl: true,
          maxZoom: 18,
          minZoom: 3,
          zoomAnimation: true,
          fadeAnimation: true,
          markerZoomAnimation: true,
          preferCanvas: false,
        }).fitBounds(bounds, { 
          padding: [30, 30],
          animate: true,
          duration: 1.0
        });

        setLoadingProgress(70);
        setLoadingStage('Loading map tiles...');

        // Add custom zoom control
        L.control.zoom({
          position: 'topright'
        }).addTo(map);

        // Add tile layer with better styling and loading events
        const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
          tileSize: 256,
          zoomOffset: 0,
          detectRetina: true,
          updateWhenIdle: false,
          updateWhenZooming: false,
          keepBuffer: 2,
          maxNativeZoom: 18
        });

        // Track tile loading
        let tilesLoaded = 0;
        let totalTiles = 0;

        tileLayer.on('loading', () => {
          totalTiles = 0;
          tilesLoaded = 0;
        });

        tileLayer.on('tileloadstart', () => {
          totalTiles++;
        });

        tileLayer.on('tileload', () => {
          tilesLoaded++;
          if (totalTiles > 0) {
            const tileProgress = Math.min((tilesLoaded / totalTiles) * 20, 20);
            setLoadingProgress(70 + tileProgress);
          }
        });

        tileLayer.on('load', () => {
          setLoadingProgress(90);
          setLoadingStage('Adding property markers...');
        });

        tileLayer.addTo(map);

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Create markers for each property
        propertiesWithCoords.forEach((property: Property) => {
          const marker = createPropertyMarker(L, property, map, handlePropertySelection);
          if (marker) {
            markersRef.current.push(marker);
          }
        });

        setLoadingProgress(100);
        setLoadingStage('Map ready!');

        mapInstanceRef.current = map;

        // Add map bounds change event listeners
        if (onMapBoundsChange || onMapMoved) {
          let moveTimeout: NodeJS.Timeout;
          
          const handleMapMove = () => {
            if (!showSearchButton) return;
            
            setMapHasMoved(true);
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
            }, 500); // Wait 500ms after user stops moving
          };
          
          map.on('moveend', handleMapMove);
          map.on('zoomend', handleMapMove);
        }
        
        // Small delay to show completion
        setTimeout(() => {
          setIsLoading(false);
        }, 300);

      } catch (error) {
        console.error('Error loading map:', error);
        setLoadingStage('Error loading map');
        setIsLoading(false);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [propertiesWithCoords, handlePropertySelection]);

  return (
    <>
      {/* Preload critical resources */}
      <link
        rel="preload"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
        as="style"
      />
      <link
        rel="preload"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png"
        as="image"
      />
      <link
        rel="preload"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
        as="image"
      />
      
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
        integrity="sha512-h9FcoyWjHcOcmEVkxOfTLnmZFWIH0iZhZT1H2TbOq55xssQGEJHEaIm+PgoUaZbRvQTNTluNOEfb1ZRy6D3BOw=="
        crossOrigin=""
      />
      
      {/* Leaflet JavaScript */}
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"
        integrity="sha512-BwHfrr+c3rBMiGJwOA4MZsw7JYQMK6/9zl1zBdO7JqDR7AkC3LKzxC6FwPD0ZnD98MgPW5xHvCIUpb25Hn4p5w=="
        crossOrigin=""
        async
      />
      
      {/* Map container with loading overlay */}
      <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200">
        {/* Skeleton loader for initial render */}
        {isLoading && loadingProgress === 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl animate-pulse" style={{ minHeight: '600px', height: '70vh' }}>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className={`bg-gradient-to-br from-blue-50 to-indigo-100 ${className} ${!isLoading ? 'map-container-loaded' : ''}`}
          style={{ minHeight: '600px', height: '70vh', display: isLoading && loadingProgress === 0 ? 'none' : 'block' }}
        />
        
        {/* Search This Area Button */}
        {showSearchButton && showSearchArea && !isLoading && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <button
              onClick={() => {
                setShowSearchArea(false);
                setMapHasMoved(false);
                // Trigger immediate search
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
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 animate-slide-down"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search This Area</span>
              </div>
            </button>
          </div>
        )}
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="map-loading-overlay rounded-xl">
            <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-sm mx-auto">
              <div className="map-loading-spinner mx-auto mb-6"></div>
              <p className="text-gray-700 font-medium text-lg mb-2">Loading interactive map...</p>
              <p className="text-gray-500 text-sm mb-4">{loadingStage}</p>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              
              <div className="text-xs text-gray-400">
                {loadingProgress}% complete
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Map Legend */}
      <div className="mt-6 bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-gray-800 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Property Types
          </h4>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {properties.length} properties
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
            <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm border-2 border-white"></div>
            <div>
              <span className="text-sm font-medium text-gray-700">Houses</span>
              <div className="text-xs text-gray-500">Residential homes</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
            <div className="w-4 h-4 rounded-full bg-blue-500 shadow-sm border-2 border-white"></div>
            <div>
              <span className="text-sm font-medium text-gray-700">Apartments</span>
              <div className="text-xs text-gray-500">Multi-unit buildings</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
            <div className="w-4 h-4 rounded-full bg-amber-500 shadow-sm border-2 border-white"></div>
            <div>
              <span className="text-sm font-medium text-gray-700">Townhouses</span>
              <div className="text-xs text-gray-500">Connected homes</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
            <div className="w-4 h-4 rounded-full bg-purple-500 shadow-sm border-2 border-white"></div>
            <div>
              <span className="text-sm font-medium text-gray-700">Offices</span>
              <div className="text-xs text-gray-500">Commercial spaces</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyMapGrid;