import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { Seller } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Layers,
  MapPin,
  Navigation,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Star,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Store,
  Compass,
  X
} from 'lucide-react';

interface SingaporeLocationsMapProps {
  sellers: Seller[];
  onSelectSeller?: (seller: Seller) => void;
}

export const SingaporeLocationsMap: React.FC<SingaporeLocationsMapProps> = ({
  sellers,
  onSelectSeller,
}) => {
  const { setViewingSellerId } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(sellers[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number>(12);

  // Filter sellers shown based on search query
  const filteredSellers = useMemo(() => {
    if (!searchQuery.trim()) return sellers;
    const q = searchQuery.toLowerCase();
    return sellers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.neighborhood.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        (s.cuisineTags || []).some((t) => t.toLowerCase().includes(q)) ||
        s.postalCode.includes(q)
    );
  }, [sellers, searchQuery]);

  // Tile layer URLs for Google Maps format
  const getGoogleTileUrl = (type: 'roadmap' | 'satellite' | 'terrain') => {
    switch (type) {
      case 'satellite':
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'; // Satellite with labels
      case 'terrain':
        return 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'; // Terrain
      case 'roadmap':
      default:
        return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'; // Standard Google Map Roadmap
    }
  };

  // Initialize Leaflet Google Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Singapore Center & Bounds
    const sgCenter: L.LatLngExpression = [1.3521, 103.8198];

    const map = L.map(mapContainerRef.current, {
      center: sgCenter,
      zoom: 12,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false, // We use custom Google Maps styled zoom controls
      attributionControl: false, // We render authentic Google watermark
    });

    // Add Initial Google Roadmap Tiles
    const tileLayer = L.tileLayer(getGoogleTileUrl('roadmap'), {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    // Listen to zoom changes to dynamically adapt pin prominence
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when mapType changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(getGoogleTileUrl(mapType));
  }, [mapType]);

  // Create Google styled teardrop Pin marker with dynamic zoom-adaptive scale, wider layout & high visibility
  const createPinIcon = (seller: Seller, isSelected: boolean, zoom: number) => {
    const isHalal = seller.foodStatus === 'halal_certified' || seller.foodStatus === 'muslim_owned';
    const pinColor = isSelected ? '#d97706' : isHalal ? '#059669' : '#e11d48';
    const borderColor = isSelected ? '#fbbf24' : '#ffffff';

    // Level 3: Street & Neighborhood Level (Zoom >= 15) -> Extra wide, prominent visual card
    if (zoom >= 15) {
      return L.divIcon({
        className: 'google-map-pin-container',
        html: `
          <div style="
            position: relative;
            cursor: pointer;
            transform: translate(-50%, -100%);
            transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
            z-index: ${isSelected ? 9999 : 500};
          ">
            <!-- Pulsing Ground Radar Beacon Ring -->
            <div style="
              position: absolute;
              bottom: -5px;
              left: 50%;
              transform: translateX(-50%);
              width: 42px;
              height: 14px;
              background: ${pinColor};
              border-radius: 50%;
              opacity: 0.4;
              filter: blur(2px);
              animation: pulse 1.8s infinite;
            "></div>

            <!-- Grand Prominent Extra-Wide Pin Card -->
            <div style="
              background: #ffffff;
              border: 2.5px solid ${isSelected ? '#d97706' : pinColor};
              box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.45), 0 6px 12px -2px rgba(0, 0, 0, 0.25);
              border-radius: 18px;
              padding: 8px 14px 8px 8px;
              display: flex;
              align-items: center;
              gap: 10px;
              min-width: 230px;
              max-width: 320px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              ${isSelected ? 'transform: scale(1.08); box-shadow: 0 14px 32px rgba(217,119,6,0.6);' : ''}
            ">
              <!-- Large Photo Avatar with status badge -->
              <div style="position: relative; flex-shrink: 0;">
                <img 
                  src="${seller.avatar || seller.coverImage}" 
                  style="
                    width: 44px; 
                    height: 44px; 
                    border-radius: 12px; 
                    object-fit: cover; 
                    border: 2px solid #ffffff; 
                    box-shadow: 0 3px 8px rgba(0,0,0,0.25);
                    background: #f4f4f5;
                  " 
                />
                <span style="
                  position: absolute;
                  bottom: -3px;
                  right: -3px;
                  background: ${pinColor};
                  color: #ffffff;
                  font-size: 9px;
                  font-weight: 900;
                  padding: 1.5px 4px;
                  border-radius: 6px;
                  border: 1.5px solid #fff;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                ">★${seller.rating}</span>
              </div>

              <!-- Details & Tag (Wide layout) -->
              <div style="display: flex; flex-direction: column; overflow: hidden; flex: 1; min-width: 0; line-height: 1.25;">
                <div style="display: flex; items-center; justify-content: space-between; gap: 4px;">
                  <span style="font-weight: 800; font-size: 13px; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${seller.name}
                  </span>
                  ${isHalal ? `<span style="font-size: 9px; font-weight: 800; background: #ecfdf5; color: #047857; padding: 1px 4px; border-radius: 4px; border: 0.5px solid #a7f3d0; white-space: nowrap; shrink-0;">Halal</span>` : ''}
                </div>
                <div style="font-size: 11px; font-weight: 700; color: ${pinColor}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;">
                  📍 ${seller.neighborhood} • ${seller.mainCategory}
                </div>
                <div style="font-size: 10px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">
                  ${seller.tagline}
                </div>
              </div>
            </div>

            <!-- Pin Bottom Point Stem -->
            <div style="
              position: absolute;
              bottom: -9px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 10px solid transparent;
              border-right: 10px solid transparent;
              border-top: 10px solid ${isSelected ? '#d97706' : pinColor};
              filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, -64],
      });
    }

    // Level 2: District & Town Level (Zoom 13 - 14) -> Wide, high-visibility pill pin
    if (zoom >= 13) {
      return L.divIcon({
        className: 'google-map-pin-container',
        html: `
          <div style="
            position: relative;
            cursor: pointer;
            transform: translate(-50%, -100%);
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            z-index: ${isSelected ? 9999 : 400};
          ">
            <!-- Pulsing Ground Beacon -->
            <div style="
              position: absolute;
              bottom: -4px;
              left: 50%;
              transform: translateX(-50%);
              width: 30px;
              height: 10px;
              background: ${pinColor};
              border-radius: 50%;
              opacity: 0.45;
              filter: blur(1.5px);
            "></div>

            <!-- Wide Pill Pin -->
            <div style="
              background: ${pinColor};
              color: white;
              padding: 6px 12px 6px 6px;
              border-radius: 28px;
              box-shadow: 0 8px 20px rgba(0,0,0,0.42), 0 3px 6px rgba(0,0,0,0.2);
              border: 2.5px solid ${borderColor};
              font-weight: 800;
              font-size: 13px;
              display: flex;
              align-items: center;
              gap: 8px;
              min-width: 150px;
              max-width: 220px;
              white-space: nowrap;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              ${isSelected ? 'transform: scale(1.1); box-shadow: 0 10px 28px rgba(217,119,6,0.65);' : ''}
            ">
              <img 
                src="${seller.avatar || seller.coverImage}" 
                style="
                  width: 30px; 
                  height: 30px; 
                  border-radius: 50%; 
                  object-fit: cover; 
                  border: 2px solid white; 
                  background: #fff;
                  flex-shrink: 0;
                " 
              />
              <div style="display: flex; flex-direction: column; line-height: 1.15; overflow: hidden; flex: 1;">
                <span style="letter-spacing: -0.01em; font-weight: 800; font-size: 12px; overflow: hidden; text-overflow: ellipsis;">${seller.name}</span>
                <span style="font-size: 10px; opacity: 0.92; font-weight: 600; overflow: hidden; text-overflow: ellipsis;">📍 ${seller.neighborhood}</span>
              </div>
              <span style="background: rgba(0,0,0,0.35); padding: 2px 6px; border-radius: 12px; font-size: 10px; font-weight: 800; flex-shrink: 0;">
                ★${seller.rating}
              </span>
            </div>

            <!-- Pointer Teardrop -->
            <div style="
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 9px solid ${pinColor};
              filter: drop-shadow(0 2px 2px rgba(0,0,0,0.25));
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, -52],
      });
    }

    // Level 1: Island Overview (Zoom <= 12) -> Wide & Distinctive Google Badge Pin
    return L.divIcon({
      className: 'google-map-pin-container',
      html: `
        <div style="
          position: relative;
          cursor: pointer;
          transform: translate(-50%, -100%);
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: ${isSelected ? 9999 : 300};
        " class="group">
          <!-- Shadow base -->
          <div style="
            position: absolute;
            bottom: -3px;
            left: 50%;
            transform: translateX(-50%);
            width: 22px;
            height: 7px;
            background: rgba(0,0,0,0.3);
            border-radius: 50%;
            filter: blur(1px);
          "></div>

          <div style="
            background: ${pinColor};
            color: white;
            padding: 5px 12px 5px 6px;
            border-radius: 22px;
            box-shadow: 0 6px 16px rgba(0,0,0,0.4);
            border: 2px solid #ffffff;
            font-weight: 800;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 7px;
            white-space: nowrap;
            min-width: 125px;
            max-width: 180px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ${isSelected ? 'transform: scale(1.12); box-shadow: 0 8px 22px rgba(217,119,6,0.6);' : ''}
          ">
            <img 
              src="${seller.avatar || seller.coverImage}" 
              style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1.5px solid white; background: #fff; flex-shrink: 0;" 
            />
            <div style="display: flex; flex-direction: column; line-height: 1.1; overflow: hidden; flex: 1;">
              <span style="letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis;">${seller.name.split(' ')[0]}</span>
              <span style="font-size: 9px; opacity: 0.9; font-weight: 600;">${seller.neighborhood}</span>
            </div>
            <span style="background: rgba(0,0,0,0.32); padding: 1.5px 5.5px; border-radius: 10px; font-size: 10px; font-weight: 800; flex-shrink: 0;">
              ★${seller.rating}
            </span>
          </div>

          <div style="
            position: absolute;
            bottom: -7px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-top: 8px solid ${pinColor};
          "></div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      popupAnchor: [0, -46],
    });
  };

  // Render & Update Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.keys(markersRef.current).forEach((id) => {
      markersRef.current[id]?.remove();
    });
    markersRef.current = {};

    filteredSellers.forEach((seller) => {
      // Default coordinates if missing
      let lat = seller.latitude || 1.3521;
      let lng = seller.longitude || 103.8198;

      if (!seller.latitude || !seller.longitude) {
        if (seller.neighborhood === 'Tampines') { lat = 1.3532; lng = 103.9452; }
        else if (seller.neighborhood === 'Bishan') { lat = 1.3508; lng = 103.8488; }
        else if (seller.neighborhood === 'Orchard') { lat = 1.3048; lng = 103.8318; }
        else if (seller.neighborhood === 'Woodlands') { lat = 1.4426; lng = 103.7891; }
        else if (seller.neighborhood === 'Serangoon') { lat = 1.3650; lng = 103.8680; }
        else if (seller.neighborhood === 'Jurong') { lat = 1.3404; lng = 103.7050; }
        else if (seller.neighborhood === 'Bedok') { lat = 1.3236; lng = 103.9273; }
        else if (seller.neighborhood === 'Punggol') { lat = 1.4050; lng = 103.9020; }
      }

      const isSelected = selectedSeller?.id === seller.id;
      const marker = L.marker([lat, lng], {
        icon: createPinIcon(seller, isSelected, currentZoom),
        title: seller.name,
        zIndexOffset: isSelected ? 1000 : currentZoom >= 15 ? 300 : 0,
      }).addTo(map);

      marker.on('click', () => {
        setSelectedSeller(seller);
        if (onSelectSeller) onSelectSeller(seller);
        map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.8 });
      });

      markersRef.current[seller.id] = marker;
    });
  }, [filteredSellers, selectedSeller, currentZoom]);

  // Zoom Controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([1.3521, 103.8198], 12, { duration: 0.8 });
  };

  const handleSelectFromSearch = (seller: Seller) => {
    setSelectedSeller(seller);
    setSearchQuery(seller.name);
    if (mapInstanceRef.current) {
      const lat = seller.latitude || 1.3521;
      const lng = seller.longitude || 103.8198;
      mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 0.8 });
    }
  };

  return (
    <div
      id="google-maps-wrapper"
      className={`relative w-full overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 h-screen rounded-none bg-stone-100'
          : 'h-[calc(100vh-140px)] min-h-[620px] rounded-3xl border border-stone-300 shadow-md bg-stone-100'
      }`}
    >
      {/* 1. Leaflet Interactive Map Canvas (Google Maps Format) */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* 2. Floating Google Maps Search & Autocomplete Bar (Top Left) */}
      <div className="absolute top-4 left-4 z-20 w-full max-w-sm sm:max-w-md pointer-events-auto">
        <div className="relative bg-white rounded-xl shadow-lg border border-stone-200 flex items-center px-3 py-2">
          <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2.5" />
          <input
            type="text"
            placeholder="Search home bakeries, Halal kitchens, or town..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm text-stone-900 focus:outline-none placeholder-stone-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown Preview */}
        {searchQuery && filteredSellers.length > 0 && (
          <div className="mt-1.5 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-h-60 overflow-y-auto">
            {filteredSellers.map((seller) => (
              <button
                key={seller.id}
                onClick={() => handleSelectFromSearch(seller)}
                className="w-full p-2.5 hover:bg-stone-50 text-left flex items-center gap-2.5 border-b border-stone-100 last:border-0 transition cursor-pointer"
              >
                <img
                  src={seller.avatar || seller.coverImage}
                  alt={seller.name}
                  className="w-7 h-7 rounded-full object-cover border border-stone-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-stone-900 truncate">{seller.name}</span>
                    <span className="text-[10px] text-amber-700 font-bold shrink-0">★ {seller.rating}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate">{seller.neighborhood} • {seller.mainCategory}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Google Maps Type Selector (Map / Satellite / Terrain) - Top Right */}
      <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-stone-200 p-1 flex items-center gap-1 pointer-events-auto">
        <button
          onClick={() => setMapType('roadmap')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            mapType === 'roadmap'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            mapType === 'satellite'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          Satellite
        </button>
        <button
          onClick={() => setMapType('terrain')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            mapType === 'terrain'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          Terrain
        </button>
      </div>

      {/* 4. Google Maps Control Stack (Zoom In, Zoom Out, Recenter, Fullscreen) - Bottom Right */}
      <div className="absolute bottom-8 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          className="w-10 h-10 bg-white rounded-xl shadow-md border border-stone-200 text-stone-700 hover:text-stone-950 flex items-center justify-center transition cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Recenter Singapore */}
        <button
          onClick={handleRecenter}
          title="Recenter Singapore"
          className="w-10 h-10 bg-white rounded-xl shadow-md border border-stone-200 text-stone-700 hover:text-stone-950 flex items-center justify-center transition cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-amber-600" />
        </button>

        {/* Zoom Controls */}
        <div className="bg-white rounded-xl shadow-md border border-stone-200 overflow-hidden flex flex-col">
          <button
            onClick={handleZoomIn}
            title="Zoom in"
            className="w-10 h-10 hover:bg-stone-50 text-stone-700 flex items-center justify-center border-b border-stone-100 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom out"
            className="w-10 h-10 hover:bg-stone-50 text-stone-700 flex items-center justify-center transition cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Google Maps Watermark & Map Data Attribution - Bottom Left & Bottom Right */}
      <div className="absolute bottom-2 left-4 z-10 pointer-events-none flex items-center gap-1.5 opacity-85">
        <span className="text-[12px] font-black tracking-tight text-stone-700 drop-shadow-xs bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200">
          <span className="text-blue-600">G</span>
          <span className="text-red-500">o</span>
          <span className="text-amber-500">o</span>
          <span className="text-blue-600">g</span>
          <span className="text-green-600">l</span>
          <span className="text-red-500">e</span> Maps
        </span>
        <span className="text-[10px] text-stone-600 bg-white/60 px-1.5 py-0.5 rounded backdrop-blur-xs font-semibold">
          Singapore Pin Locations ({sellers.length})
        </span>
      </div>

      {/* 6. Selected Business InfoCard Overlay (Google Maps Pin Spotlight InfoWindow) */}
      {selectedSeller && (
        <div className="absolute bottom-6 left-4 z-20 max-w-sm w-[calc(100%-2rem)] sm:w-88 pointer-events-auto animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200 p-4 space-y-3">
            
            {/* Header with Close */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={selectedSeller.avatar || selectedSeller.coverImage}
                  alt={selectedSeller.name}
                  className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-stone-900 truncate leading-tight">
                    {selectedSeller.name}
                  </h4>
                  <p className="text-[11px] text-amber-800 font-semibold truncate">
                    {selectedSeller.neighborhood} • {selectedSeller.region} Region
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center gap-0.5 bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded-md text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{selectedSeller.rating}</span>
                </div>
                <button
                  onClick={() => setSelectedSeller(null)}
                  className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3 Food Photo Gallery */}
            <div className="grid grid-cols-3 gap-1 h-20 rounded-xl overflow-hidden bg-stone-100 p-0.5 border border-stone-200">
              {(selectedSeller.images && selectedSeller.images.length === 3
                ? selectedSeller.images
                : [
                    selectedSeller.coverImage,
                    selectedSeller.avatar,
                    'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=400&q=80',
                  ]
              ).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              ))}
            </div>

            {/* Badges & Address */}
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedSeller.foodStatus === 'halal_certified' && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" /> MUIS Halal
                  </span>
                )}
                {selectedSeller.foodStatus === 'muslim_owned' && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Muslim-Owned
                  </span>
                )}
                <span className="bg-stone-100 text-stone-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                  {selectedSeller.mainCategory}
                </span>
              </div>
              <p className="text-stone-600 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                <span>{selectedSeller.fullAddress}</span>
              </p>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => setViewingSellerId(selectedSeller.id)}
              className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>View Kitchen & Order Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
