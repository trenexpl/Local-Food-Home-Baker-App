import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SG_REGIONS_DATA, MAIN_CATEGORIES, FOOD_STATUS_CONFIG } from '../data/categoriesAndLocations';
import { SGRegion, FoodStatus, MainCategory } from '../types';
import {
  X,
  MapPin,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Navigation,
  DollarSign,
  Truck,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Utensils
} from 'lucide-react';

export const FilterModal: React.FC = () => {
  const {
    isFilterModalOpen,
    setIsFilterModalOpen,
    multiFilters,
    setMultiFilters,
    resetMultiFilters,
    filteredDropsCount,
    filteredSellersCount,
  } = useApp();

  // Local draft state so user can make changes and click [APPLY FILTER]
  const [draftFilters, setDraftFilters] = useState(multiFilters);
  const [activeTab, setActiveTab] = useState<'all' | 'location' | 'food_status' | 'categories' | 'price_fulfillment'>('all');
  const [expandedRegions, setExpandedRegions] = useState<Record<SGRegion, boolean>>({
    Central: true,
    East: true,
    West: true,
    North: true,
    'North-East': true,
  });

  // Keep draft in sync when modal opens
  React.useEffect(() => {
    if (isFilterModalOpen) {
      setDraftFilters(multiFilters);
    }
  }, [isFilterModalOpen, multiFilters]);

  if (!isFilterModalOpen) return null;

  const toggleRegion = (region: SGRegion) => {
    setExpandedRegions((prev) => ({ ...prev, [region]: !prev[region] }));
  };

  const toggleNeighborhood = (n: string) => {
    setDraftFilters((prev) => {
      const exists = prev.locations.includes(n);
      const newLocations = exists
        ? prev.locations.filter((item) => item !== n)
        : [...prev.locations, n];
      return { ...prev, locations: newLocations, nearMe: false };
    });
  };

  const toggleAllInRegion = (regionData: (typeof SG_REGIONS_DATA)[0]) => {
    setDraftFilters((prev) => {
      const allSelected = regionData.neighborhoods.every((n) => prev.locations.includes(n));
      let newLocations = [...prev.locations];
      if (allSelected) {
        // Deselect all
        newLocations = newLocations.filter((n) => !regionData.neighborhoods.includes(n));
      } else {
        // Select all
        const toAdd = regionData.neighborhoods.filter((n) => !newLocations.includes(n));
        newLocations = [...newLocations, ...toAdd];
      }
      return { ...prev, locations: newLocations, nearMe: false };
    });
  };

  const toggleFoodStatus = (status: FoodStatus) => {
    setDraftFilters((prev) => {
      const exists = prev.foodStatuses.includes(status);
      const next = exists
        ? prev.foodStatuses.filter((s) => s !== status)
        : [...prev.foodStatuses, status];
      return { ...prev, foodStatuses: next };
    });
  };

  const toggleMainCategory = (catName: MainCategory) => {
    setDraftFilters((prev) => {
      const exists = prev.mainCategories.includes(catName);
      const next = exists
        ? prev.mainCategories.filter((c) => c !== catName)
        : [...prev.mainCategories, catName];
      return { ...prev, mainCategories: next };
    });
  };

  const toggleSubCategory = (subCat: string) => {
    setDraftFilters((prev) => {
      const exists = prev.subCategories.includes(subCat);
      const next = exists
        ? prev.subCategories.filter((s) => s !== subCat)
        : [...prev.subCategories, subCat];
      return { ...prev, subCategories: next };
    });
  };

  const toggleFulfilment = (option: 'delivery' | 'self_collection' | 'group_buy') => {
    setDraftFilters((prev) => {
      const exists = prev.fulfilment.includes(option);
      const next = exists
        ? prev.fulfilment.filter((o) => o !== option)
        : [...prev.fulfilment, option];
      return { ...prev, fulfilment: next };
    });
  };

  const toggleAvailability = (avail: 'live' | 'today' | 'tomorrow' | 'preorder') => {
    setDraftFilters((prev) => {
      const exists = prev.availability.includes(avail);
      const next = exists
        ? prev.availability.filter((a) => a !== avail)
        : [...prev.availability, avail];
      return { ...prev, availability: next };
    });
  };

  const handleApply = () => {
    setMultiFilters(draftFilters);
    setIsFilterModalOpen(false);
  };

  const handleReset = () => {
    resetMultiFilters();
    setDraftFilters({
      locations: [],
      regions: [],
      nearMe: false,
      foodStatuses: [],
      mainCategories: [],
      subCategories: [],
      minPrice: 0,
      maxPrice: 100,
      fulfilment: [],
      availability: [],
    });
  };

  // Calculate active filter count
  const activeCount =
    draftFilters.locations.length +
    (draftFilters.nearMe ? 1 : 0) +
    draftFilters.foodStatuses.length +
    draftFilters.mainCategories.length +
    draftFilters.subCategories.length +
    draftFilters.fulfilment.length +
    draftFilters.availability.length +
    (draftFilters.minPrice > 0 || draftFilters.maxPrice < 100 ? 1 : 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs"
      onClick={() => setIsFilterModalOpen(false)}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-zinc-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-900 text-white shadow-xs">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-900 font-display">Filter Marketplace</h2>
                {activeCount > 0 && (
                  <span className="bg-amber-500 text-zinc-950 font-bold text-xs px-2 py-0.5 rounded-full">
                    {activeCount} active
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500">Multi-select locations, food status, and categories</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Quick Category Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-zinc-100 bg-zinc-50 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'all', label: 'All Filters' },
            { id: 'location', label: `📍 Location (${draftFilters.locations.length})` },
            { id: 'food_status', label: `🕌 Food Status (${draftFilters.foodStatuses.length})` },
            { id: 'categories', label: `🍰 Categories (${draftFilters.mainCategories.length + draftFilters.subCategories.length})` },
            { id: 'price_fulfillment', label: `💰 Price & Delivery (${draftFilters.fulfilment.length + draftFilters.availability.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Filter Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 divide-y divide-zinc-100">
          
          {/* SECTION 1: LOCATION FILTER */}
          {(activeTab === 'all' || activeTab === 'location') && (
            <div className="space-y-4 pt-2 first:pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">📍 Singapore Location & Neighbourhoods</h3>
                    <p className="text-[11px] text-zinc-500">Select regions or individual heartland neighbourhoods</p>
                  </div>
                </div>

                {draftFilters.locations.length > 0 && (
                  <button
                    onClick={() => setDraftFilters((prev) => ({ ...prev, locations: [], nearMe: false }))}
                    className="text-xs text-amber-700 font-semibold hover:underline"
                  >
                    Clear Locations
                  </button>
                )}
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      nearMe: !prev.nearMe,
                      locations: [],
                    }))
                  }
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                    draftFilters.nearMe
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                      : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-50'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>📍 Near Me (~5km GPS)</span>
                  {draftFilters.nearMe && <Check className="w-3.5 h-3.5 ml-1" />}
                </button>

                <button
                  type="button"
                  onClick={() => setDraftFilters((prev) => ({ ...prev, locations: [], nearMe: false }))}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    draftFilters.locations.length === 0 && !draftFilters.nearMe
                      ? 'bg-zinc-900 text-white border-zinc-950 shadow-xs'
                      : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-50'
                  }`}
                >
                  🇸🇬 All Singapore
                </button>
              </div>

              {/* Region Accordions & Neighbourhood Checkboxes */}
              <div className="space-y-3 pt-2">
                {SG_REGIONS_DATA.map((regionGroup) => {
                  const isExpanded = expandedRegions[regionGroup.region];
                  const selectedInRegion = regionGroup.neighborhoods.filter((n) =>
                    draftFilters.locations.includes(n)
                  );
                  const isAllSelected = selectedInRegion.length === regionGroup.neighborhoods.length;
                  const isPartiallySelected = selectedInRegion.length > 0 && !isAllSelected;

                  return (
                    <div
                      key={regionGroup.region}
                      className="border border-zinc-200 rounded-2xl overflow-hidden bg-white"
                    >
                      {/* Region Header Row */}
                      <div className="flex items-center justify-between px-4 py-3 bg-zinc-50/80 hover:bg-zinc-100/80 transition cursor-pointer select-none">
                        <div
                          className="flex items-center gap-2.5 flex-1"
                          onClick={() => toggleRegion(regionGroup.region)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-zinc-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-zinc-500" />
                          )}
                          <span className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                            {regionGroup.region} SINGAPORE
                          </span>
                          {selectedInRegion.length > 0 && (
                            <span className="bg-amber-500 text-zinc-950 text-[10px] font-bold px-2 py-0.2 rounded-full">
                              {selectedInRegion.length} selected
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAllInRegion(regionGroup);
                          }}
                          className="text-[11px] font-semibold text-zinc-600 hover:text-zinc-950 px-2 py-1 rounded-md hover:bg-white border border-transparent hover:border-zinc-200 transition"
                        >
                          {isAllSelected ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>

                      {/* Neighbourhoods Grid */}
                      {isExpanded && (
                        <div className="p-3.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 bg-white">
                          {regionGroup.neighborhoods.map((neighborhood) => {
                            const isChecked = draftFilters.locations.includes(neighborhood);
                            return (
                              <label
                                key={neighborhood}
                                className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition ${
                                  isChecked
                                    ? 'bg-amber-50/70 border-amber-400 text-zinc-950 font-bold shadow-2xs'
                                    : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleNeighborhood(neighborhood)}
                                  className="w-3.5 h-3.5 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900 accent-zinc-900"
                                />
                                <span className="truncate">{neighborhood}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: FOOD STATUS / HALAL FILTER */}
          {(activeTab === 'all' || activeTab === 'food_status') && (
            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">🕌 Food Status & Halal Integrity</h3>
                    <p className="text-[11px] text-zinc-500">Filter by verified halal certification and dietary assurances</p>
                  </div>
                </div>

                {draftFilters.foodStatuses.length > 0 && (
                  <button
                    onClick={() => setDraftFilters((prev) => ({ ...prev, foodStatuses: [] }))}
                    className="text-xs text-emerald-700 font-semibold hover:underline"
                  >
                    Clear Food Status
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    'halal_certified',
                    'muslim_owned',
                    'no_pork_no_lard',
                    'non_halal',
                    'not_specified',
                  ] as FoodStatus[]
                ).map((status) => {
                  const cfg = FOOD_STATUS_CONFIG[status];
                  const isChecked = draftFilters.foodStatuses.includes(status);
                  return (
                    <label
                      key={status}
                      className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer select-none transition ${
                        isChecked
                          ? `${cfg.badgeBg} ${cfg.badgeBorder} ring-2 ring-zinc-900/10 shadow-xs`
                          : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleFoodStatus(status)}
                        className="mt-1 w-4 h-4 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-900 accent-zinc-900 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{cfg.icon}</span>
                          <span className="font-bold text-xs text-zinc-900">{cfg.label}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-tight">
                          {cfg.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: CATEGORIES & SUBCATEGORIES */}
          {(activeTab === 'all' || activeTab === 'categories') && (
            <div className="space-y-5 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                    <Utensils className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">🍰 Categories & Specialties</h3>
                    <p className="text-[11px] text-zinc-500">Pick main categories and specific homemade dishes</p>
                  </div>
                </div>

                {(draftFilters.mainCategories.length > 0 || draftFilters.subCategories.length > 0) && (
                  <button
                    onClick={() =>
                      setDraftFilters((prev) => ({ ...prev, mainCategories: [], subCategories: [] }))
                    }
                    className="text-xs text-indigo-700 font-semibold hover:underline"
                  >
                    Clear Categories
                  </button>
                )}
              </div>

              {/* Main Categories Cards */}
              <div className="space-y-4">
                {MAIN_CATEGORIES.map((cat) => {
                  const isMainSelected = draftFilters.mainCategories.includes(cat.name);
                  return (
                    <div
                      key={cat.name}
                      className="border border-zinc-200 rounded-2xl p-4 bg-white space-y-3"
                    >
                      {/* Main Category Header */}
                      <label className="flex items-center justify-between cursor-pointer select-none">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{cat.icon}</span>
                          <span className="font-bold text-sm text-zinc-900">{cat.name}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isMainSelected}
                          onChange={() => toggleMainCategory(cat.name)}
                          className="w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900 accent-zinc-900"
                        />
                      </label>

                      {/* Subcategories Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cat.subcategories.map((sub) => {
                          const isSubSelected = draftFilters.subCategories.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => toggleSubCategory(sub)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                                isSubSelected
                                  ? 'bg-zinc-900 text-white border-zinc-950 shadow-2xs font-semibold'
                                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                              }`}
                            >
                              {sub}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 4: PRICE, FULFILMENT & AVAILABILITY */}
          {(activeTab === 'all' || activeTab === 'price_fulfillment') && (
            <div className="space-y-6 pt-6">
              
              {/* Price Range */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
                    Price Range (S$)
                  </span>
                  <span className="text-xs font-bold text-zinc-900">
                    S${draftFilters.minPrice} — S${draftFilters.maxPrice}+
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Under S$20', min: 0, max: 20 },
                    { label: 'S$20 - S$40', min: 20, max: 40 },
                    { label: 'S$40 & Above', min: 40, max: 100 },
                  ].map((preset) => {
                    const isMatched =
                      draftFilters.minPrice === preset.min && draftFilters.maxPrice === preset.max;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          setDraftFilters((prev) => ({
                            ...prev,
                            minPrice: isMatched ? 0 : preset.min,
                            maxPrice: isMatched ? 100 : preset.max,
                          }))
                        }
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          isMatched
                            ? 'bg-zinc-900 text-white border-zinc-900'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fulfilment Modes */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-zinc-500" />
                  Fulfilment Method
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'self_collection', label: '🚶 Self Collection' },
                    { id: 'delivery', label: '🛵 Delivery' },
                    { id: 'group_buy', label: '👥 Group Buy' },
                  ].map((mode) => {
                    const isChecked = draftFilters.fulfilment.includes(mode.id as any);
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => toggleFulfilment(mode.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          isChecked
                            ? 'bg-amber-500 text-zinc-950 border-amber-600 shadow-2xs font-bold'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  Availability & Batch Timing
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'live', label: '🔥 Live Now' },
                    { id: 'today', label: '📦 Today' },
                    { id: 'tomorrow', label: '📅 Tomorrow' },
                    { id: 'preorder', label: '⏰ Pre-Order' },
                  ].map((avail) => {
                    const isChecked = draftFilters.availability.includes(avail.id as any);
                    return (
                      <button
                        key={avail.id}
                        type="button"
                        onClick={() => toggleAvailability(avail.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          isChecked
                            ? 'bg-zinc-900 text-white border-zinc-950 shadow-2xs font-bold'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{avail.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer / Action Bar */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-zinc-600">
            <span className="font-semibold text-zinc-900">
              {filteredDropsCount} drops
            </span>{' '}
            • <span className="font-semibold text-zinc-900">{filteredSellersCount} home kitchens</span> match
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 font-semibold text-xs border border-zinc-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="apply-filter-btn"
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Apply Filters</span>
              {activeCount > 0 && (
                <span className="bg-amber-500 text-zinc-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
