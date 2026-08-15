import React from 'react';
import { useApp } from '../context/AppContext';
import { NotificationDropdown } from './NotificationDropdown';
import {
  ShoppingBag,
  Sparkles,
  MapPin,
  Flame,
  Compass,
  Package,
  User,
  ChefHat,
  Bike,
  PlusCircle,
  LayoutDashboard,
  Box,
  TrendingUp,
  Truck,
  DollarSign,
  LogIn,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    activeCustomerTab,
    setActiveCustomerTab,
    activeSellerTab,
    setActiveSellerTab,
    activeDriverTab,
    setActiveDriverTab,
    setSearchQuery,
    userPrefs,
    setIsVipModalOpen,
    setIsCartOpen,
    setIsCreateDropModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    logout,
    cart,
    orders,
    drops,
    viewingSellerId,
    setViewingSellerId,
    setViewingDropId,
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeCustomerOrders = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const liveDropsCount = drops.filter((d) => d.status === 'live').length;

  const handleBrandLogoClick = () => {
    setRole('customer');
    setActiveCustomerTab('home');
    setViewingSellerId(null);
    setViewingDropId(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileClick = () => {
    if (role === 'customer') {
      setActiveCustomerTab('profile');
    } else if (role === 'seller') {
      setActiveSellerTab('analytics');
    } else {
      setActiveDriverTab('profile');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-1.5 sm:gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleBrandLogoClick}
              className="flex items-center gap-1.5 sm:gap-2.5 text-left group cursor-pointer"
              id="brand-logo-btn"
              title="Go to SGHomeEats Main Page"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-base sm:text-lg shadow-xs group-hover:scale-105 transition-transform">
                🍲
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm sm:text-base md:text-lg tracking-tight text-zinc-950 font-display">
                    SGHome<span className="text-amber-600 font-extrabold">Eats</span>
                  </span>
                  <span className="bg-amber-100 text-amber-900 font-bold text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded tracking-wider uppercase border border-amber-200">
                    SG
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-medium hidden md:block tracking-tight">
                  Artisanal Home Kitchens & Bakery Marketplace
                </p>
              </div>
            </button>
          </div>

          {/* Right Action Icons & Profile Info - All visible in mobile & tablet */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* VIP Early Access Button (Customer) - Always visible on mobile & tablet */}
            {role === 'customer' && (
              <button
                id="btn-vip-pass-modal"
                onClick={() => setIsVipModalOpen(true)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs transition cursor-pointer whitespace-nowrap ${
                  userPrefs.isVip
                    ? 'bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200 font-bold'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800 font-medium'
                }`}
                title={userPrefs.isVip ? 'VIP Pass Active - Click to Manage' : 'Get VIP Pass'}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="hidden xs:inline">{userPrefs.isVip ? 'VIP Active' : 'VIP Pass'}</span>
                <span className="xs:hidden">{userPrefs.isVip ? 'VIP' : 'VIP'}</span>
              </button>
            )}

            {/* Seller Action Button */}
            {role === 'seller' && (
              <button
                id="btn-create-secret-drop"
                onClick={() => setIsCreateDropModalOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] sm:text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">New Batch Drop</span>
                <span className="xs:hidden">New Drop</span>
              </button>
            )}

            {/* Notification Bell */}
            <NotificationDropdown />

            {/* Cart Button (Customer) */}
            {role === 'customer' && (
              <button
                id="btn-open-cart-drawer"
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 sm:p-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                aria-label="View Shopping Bag"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 sm:h-4.5 sm:w-4.5 items-center justify-center rounded-full bg-zinc-900 text-[9px] sm:text-[10px] font-bold text-white shadow-xs ring-1 sm:ring-2 ring-white">
                    {totalCartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile & Auth Button */}
            <div className="pl-0.5 sm:pl-1 border-l border-zinc-200 flex items-center gap-0.5 sm:gap-1">
              {role === 'customer' && !userPrefs.isLoggedIn ? (
                /* Signed out state in Navbar */
                <button
                  id="navbar-sign-in-btn"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] sm:text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign In</span>
                </button>
              ) : (
                /* Signed in state / Baker / Courier */
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    id="navbar-profile-btn"
                    onClick={handleProfileClick}
                    className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-xl bg-zinc-100/80 border border-zinc-200 cursor-pointer hover:bg-zinc-200/70 transition text-left"
                    title="View Profile & Account Details"
                  >
                    <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {role === 'customer' && <User className="w-3.5 h-3.5 text-amber-400" />}
                      {role === 'seller' && <ChefHat className="w-3.5 h-3.5 text-amber-400" />}
                      {role === 'driver' && <Bike className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="hidden lg:block text-left text-xs pr-1.5">
                      <p className="font-semibold text-zinc-900 leading-tight">
                        {role === 'customer' ? userPrefs.name : role === 'seller' ? 'The Flourist' : 'Ah Meng'}
                      </p>
                      <p className="text-[10px] text-zinc-500 capitalize">
                        {role === 'customer' ? (userPrefs.isVip ? '👑 VIP Member' : 'Profile') : role}
                      </p>
                    </div>
                  </button>

                  {role === 'customer' && userPrefs.isLoggedIn && (
                    <button
                      onClick={logout}
                      title="Log Out"
                      className="flex p-1 sm:p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      aria-label="Log Out"
                    >
                      <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar (Universal for Customer, Baker, and Courier) */}
      <div className="bg-zinc-50/90 border-t border-zinc-200 px-2 sm:px-4 md:px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-1">
          
          {/* CUSTOMER TABS */}
          {role === 'customer' && (
            <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-max">
              <button
                id="tab-customer-home"
                onClick={() => {
                  setViewingSellerId(null);
                  setViewingDropId(null);
                  setActiveCustomerTab('home');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                  activeCustomerTab === 'home' && !viewingSellerId
                    ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <button
                id="tab-customer-discover"
                onClick={() => {
                  setViewingSellerId(null);
                  setViewingDropId(null);
                  setActiveCustomerTab('discover');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                  activeCustomerTab === 'discover'
                    ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Explore Drops</span>
              </button>

              <button
                id="tab-customer-locations"
                onClick={() => {
                  setViewingSellerId(null);
                  setViewingDropId(null);
                  setActiveCustomerTab('locations');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                  activeCustomerTab === 'locations'
                    ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Singapore Map</span>
              </button>

              <button
                id="tab-customer-orders"
                onClick={() => {
                  setViewingSellerId(null);
                  setViewingDropId(null);
                  setActiveCustomerTab('orders');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                  activeCustomerTab === 'orders'
                    ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>My Orders {activeCustomerOrders > 0 && `(${activeCustomerOrders})`}</span>
              </button>

              <button
                id="tab-customer-profile"
                onClick={() => {
                  setViewingSellerId(null);
                  setViewingDropId(null);
                  setActiveCustomerTab('profile');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                  activeCustomerTab === 'profile'
                    ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Account & VIP</span>
              </button>
            </div>
          )}

          {/* SELLER TABS */}
          {role === 'seller' && (
              <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-max">
                <button
                  id="tab-seller-dashboard"
                  onClick={() => setActiveSellerTab('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                    activeSellerTab === 'dashboard'
                      ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>

                <button
                  id="tab-seller-drops"
                  onClick={() => setActiveSellerTab('drops')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                    activeSellerTab === 'drops'
                      ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Drop Manager</span>
                </button>

                <button
                  id="tab-seller-orders"
                  onClick={() => setActiveSellerTab('orders')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                    activeSellerTab === 'orders'
                      ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Orders</span>
                </button>

                <button
                  id="tab-seller-products"
                  onClick={() => setActiveSellerTab('products')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                    activeSellerTab === 'products'
                      ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Menu</span>
                </button>

                <button
                  id="tab-seller-analytics"
                  onClick={() => setActiveSellerTab('analytics')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                    activeSellerTab === 'analytics'
                      ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Earnings</span>
                </button>
              </div>
            )}

            {/* DRIVER TABS */}
            {role === 'driver' && (
              <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-max">
                <button
                  id="tab-driver-available"
                  onClick={() => setActiveDriverTab('available')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                    activeDriverTab === 'available'
                      ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Available Pickups</span>
                </button>

                <button
                  id="tab-driver-deliveries"
                  onClick={() => setActiveDriverTab('deliveries')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                    activeDriverTab === 'deliveries'
                      ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Deliveries</span>
                </button>

                <button
                  id="tab-driver-earnings"
                  onClick={() => setActiveDriverTab('earnings')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                    activeDriverTab === 'earnings'
                      ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Earnings</span>
                </button>

                <button
                  id="tab-driver-profile"
                  onClick={() => setActiveDriverTab('profile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                    activeDriverTab === 'profile'
                      ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-medium'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
              </div>
            )}

          </div>
        </div>
    </header>
  );
};


