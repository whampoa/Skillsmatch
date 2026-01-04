import { useCallback, useRef, useState, useEffect } from 'react';

// Parramatta, Sydney default center
const DEFAULT_CENTER = { lat: -33.8170, lng: 151.0034 };
const DEFAULT_ZOOM = 13;
const FLY_TO_ZOOM = 15;

/**
 * Custom hook for map navigation and state management
 * @returns {Object} - Map state and navigation functions
 */
export function useMapNavigation() {
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [selectedLawyerId, setSelectedLawyerId] = useState(null);
  const [visibleBounds, setVisibleBounds] = useState(null);

  // Set the map reference
  const setMapInstance = useCallback((map) => {
    if (map) {
      mapRef.current = map;
    }
  }, []);

  // Fly to a specific lawyer location
  const flyToLawyer = useCallback((lawyer, options = {}) => {
    if (!mapRef.current || !lawyer?.lat || !lawyer?.lng) return;
    
    const { zoom = FLY_TO_ZOOM, duration = 1.5 } = options;
    
    mapRef.current.flyTo([lawyer.lat, lawyer.lng], zoom, {
      duration,
      easeLinearity: 0.25,
    });
    
    setSelectedLawyerId(lawyer.id);
    setMapCenter({ lat: lawyer.lat, lng: lawyer.lng });
    setMapZoom(zoom);
  }, []);

  // Fly to coordinates
  const flyToLocation = useCallback((lat, lng, options = {}) => {
    if (!mapRef.current) return;
    
    const { zoom = FLY_TO_ZOOM, duration = 1.5 } = options;
    
    mapRef.current.flyTo([lat, lng], zoom, {
      duration,
      easeLinearity: 0.25,
    });
    
    setMapCenter({ lat, lng });
    setMapZoom(zoom);
  }, []);

  // Reset to default view
  const resetView = useCallback(() => {
    if (!mapRef.current) return;
    
    mapRef.current.flyTo([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], DEFAULT_ZOOM, {
      duration: 1,
    });
    
    setSelectedLawyerId(null);
    setMapCenter(DEFAULT_CENTER);
    setMapZoom(DEFAULT_ZOOM);
  }, []);

  // Fit bounds to show multiple markers
  const fitBounds = useCallback((lawyers) => {
    if (!mapRef.current || !lawyers?.length) return;
    
    const bounds = lawyers.reduce((acc, lawyer) => {
      if (lawyer.lat && lawyer.lng) {
        acc.push([lawyer.lat, lawyer.lng]);
      }
      return acc;
    }, []);
    
    if (bounds.length > 0) {
      mapRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
      });
    }
  }, []);

  // Update visible bounds when map moves
  const handleMapMove = useCallback(() => {
    if (!mapRef.current) return;
    
    const bounds = mapRef.current.getBounds();
    setVisibleBounds({
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    });
    
    const center = mapRef.current.getCenter();
    setMapCenter({ lat: center.lat, lng: center.lng });
    setMapZoom(mapRef.current.getZoom());
  }, []);

  // Check if a lawyer is within visible bounds
  const isInBounds = useCallback((lawyer) => {
    if (!visibleBounds || !lawyer?.lat || !lawyer?.lng) return true;
    
    return (
      lawyer.lat >= visibleBounds.south &&
      lawyer.lat <= visibleBounds.north &&
      lawyer.lng >= visibleBounds.west &&
      lawyer.lng <= visibleBounds.east
    );
  }, [visibleBounds]);

  // Get visible lawyers
  const getVisibleLawyers = useCallback((lawyers) => {
    if (!visibleBounds || !lawyers) return lawyers;
    return lawyers.filter(isInBounds);
  }, [visibleBounds, isInBounds]);

  return {
    mapRef,
    mapCenter,
    mapZoom,
    selectedLawyerId,
    visibleBounds,
    setMapInstance,
    flyToLawyer,
    flyToLocation,
    resetView,
    fitBounds,
    handleMapMove,
    isInBounds,
    getVisibleLawyers,
    setSelectedLawyerId,
    DEFAULT_CENTER,
    DEFAULT_ZOOM,
  };
}

export default useMapNavigation;

