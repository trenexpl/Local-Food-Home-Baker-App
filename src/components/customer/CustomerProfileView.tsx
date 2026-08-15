import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SellerCard } from '../SellerCard';
import {
  User,
  Sparkles,
  MapPin,
  Heart,
  Bell,
  Volume2,
  ShieldCheck,
  Crown,
  ChevronRight,
  Phone,
  Mail,
  Edit3,
  LogOut,
  LogIn,
  Package,
  CheckCircle2,
  Utensils,
  Save,
  X
} from 'lucide-react';

export const CustomerProfileView: React.FC = () => {
  const {
    userPrefs,
    updateUserPrefs,
    toggleVipPass,
    setIsVipModalOpen,
    sellers,
    orders,
    setActiveCustomerTab,
    setIsAuthModalOpen,
    login,
    logout
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userPrefs.name,
    email: userPrefs.email,
    phone: userPrefs.phone,
    address: userPrefs.address,
    postalCode: userPrefs.postalCode,
    dietaryPreference: userPrefs.dietaryPreference || 'Halal & No Pork/Lard',
    selectedNeighborhood: userPrefs.selectedNeighborhood || 'Tampines',
  });

  const favoriteSellers = sellers.filter((s) => userPrefs.favoriteSellerIds.includes(s.id));
  const myOrdersCount = orders.filter((o) => o.status !== 'cancelled').length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserPrefs(editForm);
    setIsEditing(false);
  };

  /* ------------------------------------------------------------- */
  /* SIGNED OUT STATE VIEW                                         */
  /* ------------------------------------------------------------- */
  if (!userPrefs.isLoggedIn) {
    return (
      <div className="space-y-8 pb-16 max-w-4xl mx-auto">
        {/* Guest Banner */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs text-center space-y-5">
          <div className="w-18 h-18 mx-auto rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-3xl">
            👤
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h1 className="text-2xl font-black text-stone-900 font-display">
              SGHomeEats Account
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              You are currently browsing as a <strong className="text-stone-700">Guest</strong>. Sign in or create an account to save your favorite home kitchens, track fresh drops, and unlock VIP perks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="profile-view-signin-btn"
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>Sign In / Register Account</span>
            </button>
            
            <button
              onClick={() => {
                login({
                  name: 'Shermaine Wong',
                  email: 'shermaine.wong@gmail.com',
                  phone: '+65 9123 4567',
                  address: 'Blk 248 Tampines Street 21, #08-112',
                  postalCode: '520248',
                  selectedNeighborhood: 'Tampines',
                  isVip: true,
                  dietaryPreference: 'Halal & No Pork/Lard',
                  favoriteSellerIds: ['seller_makcik_salmah', 'seller_bishan_botanical'],
                });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>1-Click Demo Login (Shermaine)</span>
            </button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">
              ❤️
            </div>
            <h4 className="font-bold text-xs text-stone-900">Favorite Bakeries</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Follow micro-bakers in Tampines, Bishan, Orchard, Woodlands, and Serangoon.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
              🛵
            </div>
            <h4 className="font-bold text-xs text-stone-900">Live Courier Tracking</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Track fresh batch dispatch and delivery timeline right to your doorstep.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm">
              👑
            </div>
            <h4 className="font-bold text-xs text-stone-900">VIP Early Batch Access</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Snag viral sourdough and pastry drops 30 minutes before general release.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------- */
  /* SIGNED IN STATE VIEW                                          */
  /* ------------------------------------------------------------- */
  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Profile Card with User Details */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900 text-amber-400 flex items-center justify-center font-bold text-2xl shadow-md ring-4 ring-amber-500/20 shrink-0">
            👩🏻
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-display">
                {userPrefs.name}
              </h1>
              {userPrefs.isVip ? (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-stone-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                  <Crown className="w-3 h-3 fill-stone-950" />
                  VIP Member
                </span>
              ) : (
                <span className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                  Standard Member
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 mt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                {userPrefs.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                {userPrefs.phone}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 mt-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{userPrefs.address} ({userPrefs.postalCode})</span>
              </span>
              {userPrefs.dietaryPreference && (
                <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-amber-200">
                  <Utensils className="w-3 h-3" />
                  {userPrefs.dietaryPreference}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            onClick={() => {
              setEditForm({
                name: userPrefs.name,
                email: userPrefs.email,
                phone: userPrefs.phone,
                address: userPrefs.address,
                postalCode: userPrefs.postalCode,
                dietaryPreference: userPrefs.dietaryPreference || 'Halal & No Pork/Lard',
                selectedNeighborhood: userPrefs.selectedNeighborhood || 'Tampines',
              });
              setIsEditing(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal/Drawer */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">Edit Customer Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Singapore Phone</label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">SG Postal</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={editForm.postalCode}
                    onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono font-bold text-stone-900"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-stone-600 mb-1">Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">Dietary Preference</label>
                <select
                  value={editForm.dietaryPreference}
                  onChange={(e) => setEditForm({ ...editForm, dietaryPreference: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900"
                >
                  <option value="Halal Only">Halal Only</option>
                  <option value="Muslim Owned & Halal">Muslim Owned & Halal</option>
                  <option value="No Pork No Lard">No Pork No Lard</option>
                  <option value="Vegetarian / Vegan">Vegetarian / Vegan</option>
                  <option value="All Cuisines">All Cuisines</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveCustomerTab('orders')}
          className="bg-white p-5 rounded-3xl border border-stone-200 text-left hover:border-zinc-900 transition cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-zinc-900 text-white">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">My Orders</p>
              <p className="text-lg font-black text-stone-900">{myOrdersCount} Placed</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Favorite Bakers</p>
            <p className="text-lg font-black text-stone-900">{favoriteSellers.length} Followed</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <Crown className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Membership Tier</p>
            <p className="text-lg font-black text-stone-900">{userPrefs.isVip ? 'VIP Active' : 'Standard'}</p>
          </div>
        </div>
      </div>

      {/* VIP Pass Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-stone-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-black/40 text-amber-300">
              <Crown className="w-4 h-4" />
            </span>
            <span className="font-extrabold text-xs tracking-wider uppercase text-amber-200">
              SGHomeEats VIP Pass Status
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display">
            {userPrefs.isVip ? 'VIP Membership Active' : 'Unlock VIP Early Drop Access'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            {userPrefs.isVip
              ? 'You are enjoying 30-minute early access to all limited drops and S$0 delivery fee on every order.'
              : 'Join the VIP Pass for S$9.90/month to unlock early pre-order windows, zero delivery fees, and secret drops.'}
          </p>
        </div>

        <button
          onClick={toggleVipPass}
          className="px-6 py-3 rounded-2xl bg-white hover:bg-stone-100 text-stone-950 font-black text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{userPrefs.isVip ? 'Deactivate Pass' : 'Activate VIP Pass'}</span>
        </button>
      </div>

      {/* Saved Favorite Bakers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-lg font-black text-stone-900 font-display">
              Favorite Home Bakers ({favoriteSellers.length})
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            You will receive instant drop alerts from these bakers
          </span>
        </div>

        {favoriteSellers.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-xs text-stone-500">
            No favorite bakers saved yet. Tap the heart on any baker profile in Tampines, Bishan, Orchard, Woodlands, or Serangoon to follow their drops!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favoriteSellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        )}
      </div>

      {/* Account Settings / Notification Preferences */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-stone-900 font-display">
          Notification & Alert Preferences
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-amber-600" />
              <div>
                <p className="font-bold text-stone-900">Instant Flash Drop Push Notifications</p>
                <p className="text-stone-500 text-[11px]">Receive push alerts when your favorite bakers open a batch</p>
              </div>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg text-[11px]">
              Enabled
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-amber-600" />
              <div>
                <p className="font-bold text-stone-900">Audio Radar Drop Chimes</p>
                <p className="text-stone-500 text-[11px]">Play subtle sound when a drop has &lt;5 boxes left</p>
              </div>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg text-[11px]">
              Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Account Session & Log Out Section */}
      <div className="bg-white p-6 rounded-3xl border border-rose-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-rose-600" />
              <h3 className="font-extrabold text-base text-stone-900 font-display">
                Account Session
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Currently signed in as <strong className="text-stone-800">{userPrefs.name}</strong> ({userPrefs.email}).
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              setActiveCustomerTab('home');
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of Account</span>
          </button>
        </div>
      </div>

    </div>
  );
};

