// src/components/MapPicker.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapPicker = ({ onLocationSelect }) => {
  const mapRef = useRef(null); // Ref for map container
  const leafletMapRef = useRef(null); // Ref for Leaflet map instance
  const markerRef = useRef(null); // Ref for marker

  useEffect(() => {
    // Only initialize map once
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView([6.9271, 79.8612], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMapRef.current);

      leafletMapRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;

        // Remove old marker if exists
        if (markerRef.current) {
          leafletMapRef.current.removeLayer(markerRef.current);
        }

        markerRef.current = L.marker([lat, lng]).addTo(leafletMapRef.current);
        onLocationSelect(`${lat},${lng}`);
      });
    }

    // Cleanup on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.off();
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [onLocationSelect]);

  return <div ref={mapRef} style={{ height: '300px', width: '100%', marginBottom: '1rem' }} />;
};

export default MapPicker;
