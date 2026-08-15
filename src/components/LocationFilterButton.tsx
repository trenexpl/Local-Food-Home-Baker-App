import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SG_REGIONS_DATA, ALL_NEIGHBORHOODS } from '../data/categoriesAndLocations';
import { SGRegion } from '../types';
import { MapPin, ChevronDown, Navigation, Check, Search, X } from 'lucide-react';

interface LocationFilterButtonProps {
  variant?: 'prominent' | 'compact' | 'pill';
  showDropdown?: boolean;
}

export const LocationFilterButton: React.FC<LocationFilterButtonProps> = ({
  variant = 'prominent',
  showDropdown = true,
}) => {
  const {
    multiFilters,
    setMultiFilters,
    setIsFilterModalOpen,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLocationsCount = multiFilters.locations.length;
  const isNearMe = multiFilters.nearMe;

  let displayLabel = 'All Singapore';
  if (isNearMe) {
    displayLabel = '📍 Near Me';
  } else if (selectedLocationsCount === 1) {
    displayLabel = multiFilters.locations[0];
  } else if (selectedLocationsCount > 1) {
    displayLabel = `${multiFilters.locations[0]} +${selectedLocationsCount - 1} more`;
  }

  const handleSelectAllSG = () => {
    setMultiFilters((prev) => ({ ...prev, locations: [], nearMe: false }));
    setIsOpen(false);
  };

  const handleSelectNearMe = () => {
    setMultiFilters((prev) => ({ ...prev, nearMe: true, locations: [] }));
    setIsOpen(false);
  };

  const handleToggleNeighborhood = (n: string) => {
    setMultiFilters((prev) => {
      const exists = prev.locations.includes(n);
      const newLocations = exists
        ? prev.locations.filter((item) => item !== n)
        : [...prev.locations, n];
      return { ...prev, locations: newLocations, nearMe: false };
    });
  };

  const filteredNeighborhoods = searchQuery
    ? ALL_NEIGHBORHOODS.filter((n) => n.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Prominent Button on Home & Feed */}
      {variant === 'prominent' && (
        <button
          id="btn-prominent-location-filter"
          onClick={() => (showDropdown ? setIsOpen(!isOpen) : setIsFilterModalOpen(true))}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer border ${
            selectedLocationsCount > 0 || isNearMe
              ? 'bg-amber-500 text-zinc-950 border-amber-600 ring-2 ring-amber-500/20'
              : 'bg-white text-zinc-800 border-zinc-300 hover:bg-zinc-50'
          }`}
        >
          <MapPin className={`w-3.5 h-3.5 ${selectedLocationsCount > 0 || isNearMe ? 'text-zinc-950' : 'text-amber-600'}`} />
          <span className="truncate max-w-[140px] sm:max-w-[180px]">{displayLabel}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
        </button>
      )}

      {/* Pill Variant */}
      {variant === 'pill' && (
        <button
          onClick={() => (showDropdown ? setIsOpen(!isOpen) : setIsFilterModalOpen(true))}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition border cursor-pointer ${
            selectedLocationsCount > 0 || isNearMe
              ? 'bg-zinc-900 text-white border-zinc-950 shadow-xs'
              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <MapPin className="w-3 h-3 text-amber-500" />
          <span>{displayLabel}</span>
          <ChevronDown className="w-3 h-3 text-zinc-400" />
        </button>
      )}

      {/* Compact Variant */}
      {variant === 'compact' && (
        <button
          onClick={() => (showDropdown ? setIsOpen(!isOpen) : setIsFilterModalOpen(true))}
          className="flex items-center gap-1 text-xs font-semibold text-zinc-800 hover:text-zinc-950 p-1.5 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span className="truncate max-w-[120px]">{displayLabel}</span>
          <ChevronDown className="w-3 h-3 text-zinc-400" />
        </button>
      )}

      {/* Quick Location Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-zinc-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
            <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Singapore Neighbourhoods
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsFilterModalOpen(true);
              }}
              className="text-[11px] font-bold text-amber-700 hover:underline"
            >
              All Filters & Map
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-1.5 mb-2.5">
            <button
              onClick={handleSelectNearMe}
              className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                isNearMe
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
              }`}
            >
              <Navigation className="w-3 h-3 text-emerald-600" />
              <span>📍 Near Me</span>
            </button>

            <button
              onClick={handleSelectAllSG}
              className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                !isNearMe && selectedLocationsCount === 0
                  ? 'bg-zinc-900 text-white border-zinc-950'
                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
              }`}
            >
              <span>🇸🇬 All SG</span>
            </button>
          </div>

          {/* Search Neighbourhoods */}
          <div className="relative mb-2.5">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Tampines, Punggol, Katong..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-zinc-900 transition"
            />
          </div>

          {/* List of Neighbourhoods */}
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-zinc-100 text-xs">
            {searchQuery ? (
              <div className="space-y-1 pt-1">
                {filteredNeighborhoods.length === 0 ? (
                  <p className="text-zinc-400 text-center py-2 text-[11px]">No neighbourhood found</p>
                ) : (
                  filteredNeighborhoods.map((n) => (
                    <label
                      key={n}
                      className="flex items-center justify-between p-1.5 hover:bg-zinc-50 rounded-lg cursor-pointer select-none"
                    >
                      <span className="text-zinc-800">{n}</span>
                      <input
                        type="checkbox"
                        checked={multiFilters.locations.includes(n)}
                        onChange={() => handleToggleNeighborhood(n)}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 accent-zinc-900"
                      />
                    </label>
                  ))
                )}
              </div>
            ) : (
              SG_REGIONS_DATA.map((r) => (
                <div key={r.region} className="pt-1.5 first:pt-0">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    {r.region}
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {(r.neighborhoods || []).slice(0, 6).map((n) => {
                      const isChecked = multiFilters.locations.includes(n);
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => handleToggleNeighborhood(n)}
                          className={`text-left text-[11px] p-1.5 rounded-lg border transition truncate ${
                            isChecked
                              ? 'bg-amber-100/70 border-amber-300 font-bold text-zinc-950'
                              : 'border-zinc-150 hover:bg-zinc-50 text-zinc-700'
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">
              {selectedLocationsCount > 0 ? `${selectedLocationsCount} selected` : 'Showing all'}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
