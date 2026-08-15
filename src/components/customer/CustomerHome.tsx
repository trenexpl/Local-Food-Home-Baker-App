import React from 'react';
import { useApp } from '../../context/AppContext';
import { SellerCard } from '../SellerCard';
import { MAIN_CATEGORIES } from '../../data/categoriesAndLocations';
import { FoodStatus, MainCategory } from '../../types';
import {
  Compass,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Award,
  ArrowRight,
  Utensils,
  CheckCircle2,
  Search,
  X
} from 'lucide-react';

export const CustomerHome: React.FC = () => {
  const {
    filteredSellers,
    sellers,
    setActiveCustomerTab,
    multiFilters,
    setMultiFilters,
    setRole,
    searchQuery,
    setSearchQuery,
    setViewingSellerId,
  } = useApp();

  const handleSelectCategory = (catName: MainCategory) => {
    setMultiFilters((prev) => ({
      ...prev,
      mainCategories: prev.mainCategories.includes(catName) ? [] : [catName],
    }));
    setActiveCustomerTab('discover');
  };

  const handleBrowseLocations = () => {
    setViewingSellerId(null);
    setActiveCustomerTab('locations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grouped vendor categories for curated sections
  const halalAndMuslimOwned = filteredSellers.filter(
    (s) => s.foodStatus === 'halal_certified' || s.foodStatus === 'muslim_owned'
  );
  const featuredBakers = filteredSellers.filter((s) => s.mainCategory === 'Bakes & Desserts');
  const homeCookedChefs = filteredSellers.filter((s) => s.mainCategory === 'Home-Cooked Food');

  return (
    <div className="space-y-8 pb-20">

      {/* Live Search Query Results Overlay Banner */}
      {searchQuery.trim().length > 0 && (
        <section className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-amber-500 text-stone-950 font-bold">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-stone-900 font-display">
                  Search Results for &ldquo;{searchQuery}&rdquo;
                </h2>
                <p className="text-xs text-amber-900/80">
                  Showing {filteredSellers.length} matching home {filteredSellers.length === 1 ? 'kitchen/baker' : 'kitchens/bakers'} across Singapore
                </p>
              </div>
            </div>

            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Search</span>
            </button>
          </div>

          {filteredSellers.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-amber-200 space-y-3">
              <p className="text-sm font-bold text-stone-800">
                No home bakers or menu items found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try searching for specific Singapore estates (e.g. <strong>Tampines</strong>, <strong>Bishan</strong>, <strong>Orchard</strong>, <strong>Woodlands</strong>, <strong>Serangoon</strong>) or items like <strong>Sourdough</strong>, <strong>Halal</strong>, <strong>Brownies</strong>, or <strong>Tarts</strong>.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {['Tampines', 'Bishan', 'Orchard', 'Woodlands', 'Serangoon', 'Sourdough', 'Halal', 'Brownies'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition cursor-pointer"
                  >
                    🔍 {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
              {filteredSellers.map((seller) => (
                <SellerCard key={seller.id} seller={seller} />
              ))}
            </div>
          )}
        </section>
      )}
      


      {/* 2. Hero Banner (Warm artisanal theme, non-black) */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-100/70 via-orange-50/80 to-amber-50 border border-amber-200/80 shadow-sm p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-900 font-semibold px-3 py-1 rounded-full text-xs border border-amber-300/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Singapore Heartland Home-Based F&B Directory</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-950 leading-tight font-display">
              Artisanal home bakes & heritage meals.{' '}
              <span className="text-amber-800 font-bold block sm:inline">
                Fresh from kitchens across Singapore.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-xl">
              Discover verified local home bakers, MUIS Halal certified kitchens, slow-simmered family recipes, and limited weekend pastry drops with multi-photo previews for every vendor listing.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                id="browse-locations-map-btn"
                onClick={handleBrowseLocations}
                className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2.5 group cursor-pointer shadow-sm hover:shadow"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>Browse by Locations & Regions</span>
                <ChevronRight className="w-4 h-4 text-amber-200 group-hover:translate-x-0.5 transition" />
              </button>
            </div>

            {/* Perks info */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-xs font-semibold text-stone-700 border-t border-amber-200/80">
              <span className="flex items-center gap-1.5 text-stone-800">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> SFA Registered
              </span>
              <span className="flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Halal & Dietary Verified
              </span>
              <span className="flex items-center gap-1.5 text-stone-800">
                <Award className="w-4 h-4 text-amber-700" /> PayNow Escrow
              </span>
            </div>
          </div>

          {/* Right Column: Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-200/90 shadow-md aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 bg-amber-100 group">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
                alt="Fresh Artisanal Bakery Sourdough and Pastries"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium bg-stone-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                <span className="flex items-center gap-1.5 font-bold">
                  <span>🥐</span> Fresh Batch Bakes
                </span>
                <span className="text-amber-300 font-semibold">Islandwide Delivery</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. 4 Main F&B Categories Hub */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-zinc-800" />
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Browse by Main Categories
            </h2>
          </div>
          <button
            onClick={() => setActiveCustomerTab('discover')}
            className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MAIN_CATEGORIES.map((cat) => {
            const isSelected = multiFilters.mainCategories.includes(cat.name);
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleSelectCategory(cat.name)}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-950 shadow-md'
                    : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-900 shadow-xs'
                }`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200 inline-block">
                  {cat.icon}
                </span>
                <div className="mt-3">
                  <h3 className="font-bold text-xs sm:text-sm">{cat.name}</h3>
                  <p
                    className={`text-[10px] line-clamp-1 mt-0.5 ${
                      isSelected ? 'text-zinc-300' : 'text-zinc-500'
                    }`}
                  >
                    {(cat.subcategories || []).slice(0, 3).join(', ')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Home-Based Vendors (3 Images Per Listing) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 font-display">
                Featured Home Kitchens & Micro-Bakeries
              </h2>
              <p className="text-xs text-zinc-500">
                Explore hand-crafted menus with 3 photos per vendor listing.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveCustomerTab('discover')}
            className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 transition"
          >
            <span>View All ({filteredSellers.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(filteredSellers || []).slice(0, 6).map((seller) => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      </section>

      {/* 6. Halal Certified & Muslim-Owned Heartland Favorites */}
      {halalAndMuslimOwned.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 font-display">
                    Halal Certified & Muslim-Owned Kitchens
                  </h2>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    MUIS & Muslim-Owned
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  Authentic heritage recipes prepared in verified Halal home kitchens.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setMultiFilters((prev) => ({
                  ...prev,
                  foodStatuses: ['halal_certified', 'muslim_owned'],
                }));
                setActiveCustomerTab('discover');
              }}
              className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <span>Explore All ({halalAndMuslimOwned.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(halalAndMuslimOwned || []).slice(0, 3).map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Call To Action for Singapore Home Chefs */}
      <section className="rounded-3xl bg-white border border-zinc-200 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center text-xl mx-auto shadow-2xs">
          👩‍🍳
        </div>
        <h3 className="text-lg sm:text-xl font-bold font-display text-zinc-900">
          Operate a Home-Based F&B Kitchen in Singapore?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
          List your kitchen with 3 photos, specify your Singapore neighbourhood, declare your Halal/Dietary status, accept PayNow payments, and receive direct customer orders.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setRole('seller')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
          >
            <span>Open Home Kitchen Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

    </div>
  );
};
