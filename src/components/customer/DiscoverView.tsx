import React from 'react';
import { useApp } from '../../context/AppContext';
import { SellerCard } from '../SellerCard';
import { LocationFilterButton } from '../LocationFilterButton';
import { MAIN_CATEGORIES, FOOD_STATUS_CONFIG } from '../../data/categoriesAndLocations';
import { FoodStatus, MainCategory } from '../../types';
import {
  Compass,
  MapPin,
  Filter,
  Search,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  UtensilsCrossed,
  X
} from 'lucide-react';

export const DiscoverView: React.FC = () => {
  const {
    filteredSellers,
    sellers,
    multiFilters,
    setMultiFilters,
    resetMultiFilters,
    setIsFilterModalOpen,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const handleToggleFoodStatus = (status: FoodStatus) => {
    setMultiFilters((prev) => {
      const exists = prev.foodStatuses.includes(status);
      const next = exists
        ? prev.foodStatuses.filter((s) => s !== status)
        : [...prev.foodStatuses, status];
      return { ...prev, foodStatuses: next };
    });
  };

  const handleToggleMainCategory = (cat: MainCategory) => {
    setMultiFilters((prev) => {
      const exists = prev.mainCategories.includes(cat);
      const next = exists
        ? prev.mainCategories.filter((c) => c !== cat)
        : [...prev.mainCategories, cat];
      return { ...prev, mainCategories: next };
    });
  };

  const activeFilterCount =
    multiFilters.locations.length +
    (multiFilters.nearMe ? 1 : 0) +
    multiFilters.foodStatuses.length +
    multiFilters.mainCategories.length +
    multiFilters.subCategories.length +
    multiFilters.fulfilment.length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header & Prominent Location / Filter Bar */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
                <Compass className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 font-display">
                Singapore Home-Based F&B Directory
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Explore {sellers.length} verified home bakers, Muslim-owned kitchens, and artisanal cooks across Singapore.
            </p>
          </div>

          {/* Location & Filter Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <LocationFilterButton variant="prominent" />

            <button
              id="btn-open-advanced-filters"
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>All Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-amber-500 text-zinc-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by kitchen name, neighborhood (e.g. Tampines, Punggol), or dish (Chiffon cake, Beef Rendang, Sourdough, Curry puffs)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-zinc-900 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* CORE FILTER 1: FOOD STATUS (HALAL / NON-HALAL / MUSLIM-OWNED / NO PORK NO LARD) */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Dietary & Halal Integrity Status
            </span>
          </div>
          {multiFilters.foodStatuses.length > 0 && (
            <button
              onClick={() => setMultiFilters((prev) => ({ ...prev, foodStatuses: [] }))}
              className="text-[11px] font-bold text-zinc-500 hover:text-zinc-900 hover:underline"
            >
              Clear Food Status
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              'halal_certified',
              'muslim_owned',
              'no_pork_no_lard',
              'non_halal',
            ] as FoodStatus[]
          ).map((status) => {
            const cfg = FOOD_STATUS_CONFIG[status];
            const isSelected = multiFilters.foodStatuses.includes(status);
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleToggleFoodStatus(status)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  isSelected
                    ? `${cfg.badgeBg} ${cfg.badgeBorder} ring-2 ring-zinc-900/10 shadow-xs font-bold`
                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${cfg.badgeDot}`}></span>
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CORE FILTER 2: 4 MAIN F&B CATEGORIES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MAIN_CATEGORIES.map((cat) => {
          const isSelected = multiFilters.mainCategories.includes(cat.name);
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => handleToggleMainCategory(cat.name)}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900 text-white border-zinc-950 shadow-md ring-2 ring-zinc-900/20'
                  : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-900 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{cat.icon}</span>
                {isSelected && (
                  <span className="bg-amber-500 text-zinc-950 font-black text-[9px] px-1.5 py-0.2 rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="mt-2">
                <h3 className="font-bold text-xs">{cat.name}</h3>
                <p
                  className={`text-[10px] line-clamp-1 mt-0.5 ${
                    isSelected ? 'text-zinc-300' : 'text-zinc-400'
                  }`}
                >
                  {(cat.subcategories || []).slice(0, 3).join(', ')}...
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Filter Chips Bar */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
          <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Active Filters ({activeFilterCount}):
          </span>

          {multiFilters.nearMe && (
            <span className="inline-flex items-center gap-1 bg-white text-zinc-900 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
              📍 Near Me
              <X
                className="w-3 h-3 cursor-pointer text-zinc-400 hover:text-zinc-900"
                onClick={() => setMultiFilters((prev) => ({ ...prev, nearMe: false }))}
              />
            </span>
          )}

          {multiFilters.locations.map((loc) => (
            <span
              key={loc}
              className="inline-flex items-center gap-1 bg-white text-zinc-900 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs"
            >
              📍 {loc}
              <X
                className="w-3 h-3 cursor-pointer text-zinc-400 hover:text-zinc-900"
                onClick={() =>
                  setMultiFilters((prev) => ({
                    ...prev,
                    locations: prev.locations.filter((l) => l !== loc),
                  }))
                }
              />
            </span>
          ))}

          {multiFilters.foodStatuses.map((fs) => (
            <span
              key={fs}
              className="inline-flex items-center gap-1 bg-white text-zinc-900 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs"
            >
              {FOOD_STATUS_CONFIG[fs].label}
              <X
                className="w-3 h-3 cursor-pointer text-zinc-400 hover:text-zinc-900"
                onClick={() => handleToggleFoodStatus(fs)}
              />
            </span>
          ))}

          {multiFilters.mainCategories.map((mc) => (
            <span
              key={mc}
              className="inline-flex items-center gap-1 bg-white text-zinc-900 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs"
            >
              {mc}
              <X
                className="w-3 h-3 cursor-pointer text-zinc-400 hover:text-zinc-900"
                onClick={() => handleToggleMainCategory(mc)}
              />
            </span>
          ))}

          <button
            onClick={resetMultiFilters}
            className="text-xs text-amber-800 font-bold hover:underline ml-auto flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        </div>
      )}

      {/* Results Header & Grid (3 Images Per Listing) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
          <span>
            Showing <strong className="text-zinc-900">{filteredSellers.length}</strong> home food & bakery kitchens
          </span>
          {searchQuery && (
            <span>
              Search match for "<strong className="text-zinc-800">{searchQuery}</strong>"
            </span>
          )}
        </div>

        {filteredSellers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl shadow-xs">
              🔍
            </div>
            <h3 className="font-bold text-base text-zinc-900">No home kitchens match these filters</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try adjusting your food status (Halal/No Pork No Lard), clearing specific neighbourhoods, or resetting filters.
            </p>
            <button
              onClick={resetMultiFilters}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
