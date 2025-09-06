import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapPicker = ({ onLocationSelect, initialLocation }) => {
  const mapRef = useRef(null);         // DOM container
  const leafletMapRef = useRef(null);  // Leaflet instance
  const markerRef = useRef(null);      // Marker instance

  useEffect(() => {
    const defaultLat = 6.9271;
    const defaultLng = 79.8612;

    if (!leafletMapRef.current && mapRef.current) {
      // Initialize map
      leafletMapRef.current = L.map(mapRef.current).setView(
        [initialLocation?.lat ?? defaultLat, initialLocation?.lng ?? defaultLng],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(leafletMapRef.current);

      // Only create marker if valid location
      if (initialLocation?.lat && initialLocation?.lng) {
        markerRef.current = L.marker([initialLocation.lat, initialLocation.lng], {
          draggable: true,
        }).addTo(leafletMapRef.current);

        // Update location on drag
        markerRef.current.on("dragend", (e) => {
          const { lat, lng } = e.target.getLatLng();
          onLocationSelect({ lat, lng });
        });
      }

      // Map click to add/update marker
      leafletMapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(leafletMapRef.current);
          markerRef.current.on("dragend", (e) => {
            const { lat, lng } = e.target.getLatLng();
            onLocationSelect({ lat, lng });
          });
        }

        onLocationSelect({ lat, lng });
      });
    }

    // Cleanup
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.off();
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [initialLocation, onLocationSelect]);

  return <div ref={mapRef} style={{ height: "300px", width: "100%", marginBottom: "1rem" }} />;
};

export default MapPicker;
