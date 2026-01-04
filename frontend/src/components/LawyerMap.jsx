import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import {
  MapPin,
  CheckCircle,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Navigation,
} from 'lucide-react';

// Custom marker icons
const createCustomIcon = (color, isSelected = false) => {
  const size = isSelected ? 40 : 32;
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        ${isSelected ? 'animation: pulse 1.5s infinite;' : ''}
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: ${isSelected ? '14px' : '12px'};
        ">⚖️</div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// Cluster icon
const createClusterCustomIcon = (cluster) => {
  const count = cluster.getChildCount();
  let size = 40;
  let bgColor = '#0070c7';
  
  if (count > 10) {
    size = 50;
    bgColor = '#0159a1';
  }
  if (count > 25) {
    size = 60;
    bgColor = '#1a365d';
  }

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${bgColor};
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${count > 99 ? '12px' : '14px'};
        font-family: 'Source Sans 3', sans-serif;
      ">
        ${count}
      </div>
    `,
    className: 'marker-cluster-custom',
    iconSize: [size, size],
  });
};

// Map event handler component
const MapEventHandler = ({ onMove, onBoundsChange }) => {
  const map = useMapEvents({
    moveend: () => {
      onMove?.();
      const bounds = map.getBounds();
      onBoundsChange?.({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
  });
  return null;
};

// Fly to location component
const FlyToLocation = ({ center, zoom, selectedId }) => {
  const map = useMap();
  const prevSelectedRef = useRef(selectedId);

  useEffect(() => {
    if (center && selectedId !== prevSelectedRef.current) {
      map.flyTo([center.lat, center.lng], zoom || 15, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
      prevSelectedRef.current = selectedId;
    }
  }, [center, zoom, selectedId, map]);

  return null;
};

// Lawyer popup content
const LawyerPopup = ({ lawyer }) => {
  const {
    name,
    firm,
    title,
    location,
    state,
    practiceArea,
    experienceYears,
    successRate,
    hourlyRate,
    verified,
    website,
    email,
    phone,
    avatarColor,
  } = lawyer;

  return (
    <div className="p-4 min-w-[280px]">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: avatarColor || '#0070c7' }}
        >
          {name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800">{name}</h3>
            {verified && <CheckCircle size={14} className="text-green-600" />}
          </div>
          <p className="text-sm text-slate-600">{title || firm}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
        <MapPin size={14} />
        <span>{location}, {state}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
          {practiceArea}
        </span>
        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
          {experienceYears} years
        </span>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          {successRate}% success
        </span>
      </div>

      <div className="text-sm text-slate-600 mb-3">
        <strong>${hourlyRate}</strong>/hour
      </div>

      <div className="flex gap-2 pt-3 border-t border-slate-100">
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1.5 bg-primary-50 text-primary-700 rounded text-xs font-medium hover:bg-primary-100 transition-colors"
          >
            <Globe size={12} />
            Website
            <ExternalLink size={10} />
          </a>
        ) : email ? (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1 px-2 py-1.5 bg-primary-50 text-primary-700 rounded text-xs font-medium hover:bg-primary-100 transition-colors"
          >
            <Mail size={12} />
            Contact
          </a>
        ) : null}

        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 text-slate-700 rounded text-xs font-medium hover:bg-slate-200 transition-colors"
          >
            <Phone size={12} />
            Call
          </a>
        )}
      </div>
    </div>
  );
};

const LawyerMap = ({
  lawyers = [],
  selectedLawyer = null,
  onLawyerSelect,
  onBoundsChange,
  className = '',
  enableClustering = true,
  showOnlyInBounds = false,
}) => {
  const mapRef = useRef(null);
  
  // Default center: Parramatta, Sydney
  const DEFAULT_CENTER = { lat: -33.8170, lng: 151.0034 };
  const DEFAULT_ZOOM = 13;

  // Filter lawyers with valid coordinates
  const validLawyers = useMemo(() => {
    return lawyers.filter((l) => l.lat && l.lng && !isNaN(l.lat) && !isNaN(l.lng));
  }, [lawyers]);

  // Get selected center
  const flyToCenter = useMemo(() => {
    if (selectedLawyer?.lat && selectedLawyer?.lng) {
      return { lat: selectedLawyer.lat, lng: selectedLawyer.lng };
    }
    return null;
  }, [selectedLawyer]);

  const handleMarkerClick = useCallback((lawyer) => {
    onLawyerSelect?.(lawyer);
  }, [onLawyerSelect]);

  const handleMapMove = useCallback(() => {
    // Map move handler
  }, []);

  if (validLawyers.length === 0) {
    return (
      <div className={`bg-slate-100 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <Navigation size={48} className="mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Locations Available</h3>
          <p className="text-slate-500">Lawyer locations will appear here when available.</p>
        </div>
      </div>
    );
  }

  const markers = validLawyers.map((lawyer) => {
    const isSelected = selectedLawyer?.id === lawyer.id;
    const icon = createCustomIcon(lawyer.avatarColor || '#0070c7', isSelected);

    return (
      <Marker
        key={lawyer.id}
        position={[lawyer.lat, lawyer.lng]}
        icon={icon}
        eventHandlers={{
          click: () => handleMarkerClick(lawyer),
        }}
      >
        <Popup>
          <LawyerPopup lawyer={lawyer} />
        </Popup>
      </Marker>
    );
  });

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        ref={mapRef}
        center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full rounded-2xl"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEventHandler
          onMove={handleMapMove}
          onBoundsChange={onBoundsChange}
        />

        {flyToCenter && (
          <FlyToLocation
            center={flyToCenter}
            zoom={15}
            selectedId={selectedLawyer?.id}
          />
        )}

        {enableClustering ? (
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={60}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
          >
            {markers}
          </MarkerClusterGroup>
        ) : (
          markers
        )}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <div className="text-xs font-semibold text-slate-700 mb-2">Legend</div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="w-4 h-4 bg-primary-600 rounded-full border-2 border-white shadow" />
          <span>Lawyer Office</span>
        </div>
        {selectedLawyer && (
          <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
            <div className="w-5 h-5 bg-primary-700 rounded-full border-2 border-white shadow animate-pulse" />
            <span>Selected</span>
          </div>
        )}
      </div>

      {/* Lawyers count */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-[1000]">
        <div className="text-sm font-semibold text-slate-700">
          {validLawyers.length} Lawyer{validLawyers.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default LawyerMap;

