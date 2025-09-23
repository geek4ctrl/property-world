import { Property } from '@/types';
import { MapBounds } from '@/components/map/PropertyMapGrid';

/**
 * Filters properties based on map bounds
 */
export function filterPropertiesByBounds(properties: Property[], bounds: MapBounds): Property[] {
  return properties.filter(property => {
    if (!property.coordinates) return false;
    
    const { lat, lng } = property.coordinates;
    
    return (
      lat >= bounds.south &&
      lat <= bounds.north &&
      lng >= bounds.west &&
      lng <= bounds.east
    );
  });
}

/**
 * Filters properties within a radius of a center point
 */
export function filterPropertiesByRadius(
  properties: Property[], 
  center: { lat: number; lng: number }, 
  radiusKm: number
): Property[] {
  return properties.filter(property => {
    if (!property.coordinates) return false;
    
    const distance = calculateDistance(center, property.coordinates);
    return distance <= radiusKm;
  });
}

/**
 * Calculates distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Converts degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Gets the center point and appropriate zoom level for an array of properties
 */
export function getMapBoundsForProperties(properties: Property[]): {
  center: { lat: number; lng: number };
  zoom: number;
  bounds: MapBounds;
} | null {
  const propertiesWithCoords = properties.filter(p => p.coordinates);
  
  if (propertiesWithCoords.length === 0) return null;
  
  if (propertiesWithCoords.length === 1) {
    const coord = propertiesWithCoords[0].coordinates!;
    return {
      center: coord,
      zoom: 15,
      bounds: {
        north: coord.lat + 0.01,
        south: coord.lat - 0.01,
        east: coord.lng + 0.01,
        west: coord.lng - 0.01,
        center: coord,
        zoom: 15
      }
    };
  }
  
  const lats = propertiesWithCoords.map(p => p.coordinates!.lat);
  const lngs = propertiesWithCoords.map(p => p.coordinates!.lng);
  
  const north = Math.max(...lats);
  const south = Math.min(...lats);
  const east = Math.max(...lngs);
  const west = Math.min(...lngs);
  
  const center = {
    lat: (north + south) / 2,
    lng: (east + west) / 2
  };
  
  // Calculate zoom level based on bounds span
  const latSpan = north - south;
  const lngSpan = east - west;
  const maxSpan = Math.max(latSpan, lngSpan);
  
  let zoom = 15;
  if (maxSpan > 0.5) zoom = 10;
  else if (maxSpan > 0.1) zoom = 12;
  else if (maxSpan > 0.05) zoom = 13;
  else if (maxSpan > 0.01) zoom = 14;
  
  return {
    center,
    zoom,
    bounds: {
      north,
      south,
      east,
      west,
      center,
      zoom
    }
  };
}

/**
 * Checks if a point is within map bounds
 */
export function isPointInBounds(
  point: { lat: number; lng: number },
  bounds: MapBounds
): boolean {
  return (
    point.lat >= bounds.south &&
    point.lat <= bounds.north &&
    point.lng >= bounds.west &&
    point.lng <= bounds.east
  );
}

/**
 * Expands map bounds by a percentage
 */
export function expandBounds(bounds: MapBounds, percentage: number = 10): MapBounds {
  const latSpan = bounds.north - bounds.south;
  const lngSpan = bounds.east - bounds.west;
  
  const latExpansion = (latSpan * percentage) / 100 / 2;
  const lngExpansion = (lngSpan * percentage) / 100 / 2;
  
  return {
    north: bounds.north + latExpansion,
    south: bounds.south - latExpansion,
    east: bounds.east + lngExpansion,
    west: bounds.west - lngExpansion,
    center: bounds.center,
    zoom: bounds.zoom
  };
}