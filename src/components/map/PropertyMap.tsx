'use client';

import { useEffect, useRef } from 'react';
import { Property } from '@/types';

interface PropertyMapProps {
  property: Property;
  className?: string;
}

const PropertyMap = ({ property, className = '' }: PropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !property.coordinates) return;

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = (await import('leaflet')).default;
      
      // Fix for default markers in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Clear existing map if it exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Create the map - we know mapRef.current and coordinates exist due to early return
      const mapElement = mapRef.current!;
      const coords = property.coordinates!;
      
      const map = L.map(mapElement, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([coords.lat, coords.lng], 15);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Create custom marker icon
      const customIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#3b82f6"/>
            <circle cx="12.5" cy="12.5" r="6" fill="white"/>
            <circle cx="12.5" cy="12.5" r="3" fill="#3b82f6"/>
          </svg>
        `),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      // Add marker
      const marker = L.marker([coords.lat, coords.lng], {
        icon: customIcon
      }).addTo(map);

      // Add popup
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-gray-900">${property.title}</h3>
          <p class="text-sm text-gray-600">${property.address.street}, ${property.address.suburb}</p>
          <p class="text-sm font-medium text-primary-600">${property.currency === 'ZAR' ? 'R' : property.currency} ${property.price.toLocaleString()}</p>
        </div>
      `);

      mapInstanceRef.current = map;

      // Cleanup function
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }
      };
    };

    initMap();
  }, [property]);

  if (!property.coordinates) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Location information not available</p>
      </div>
    );
  }

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
        integrity="sha512-h9FcoyWjHcOcmEVkxOfTLnmZFWIH0iZhZT1H2TbOq55xssQGEJHEaIm+PgoUaZbRvQTNTluNOEfb1ZRy6D3BOw=="
        crossOrigin=""
      />
      <div 
        ref={mapRef} 
        className={`bg-gray-100 rounded-lg ${className}`}
        style={{ minHeight: '300px' }}
      />
    </>
  );
};

export default PropertyMap;