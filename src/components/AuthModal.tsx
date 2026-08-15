import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  ChefHat,
  Bike,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  LogOut
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, userPrefs, login, logout, setRole } = useApp();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  const [formData, setFormData] = useState({
    name: 'Shermaine Wong',
    email: 'shermaine.wong@gmail.com',
    phone: '+65 9123 4567',
    address: 'Blk 248 Tampines Street 21, #08-112',
    postalCode: '520248',
    dietaryPreference: 'Halal & No Pork/Lard',
  });

  if (!isAuthModalOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      postalCode: formData.postalCode,
      dietaryPreference: formData.dietaryPreference,
      isVip: true,
      selectedNeighborhood: 'Tampines',
    });
    setIsAuthModalOpen(false);
  };

  const handleDemoLogin = (type: 'customer' | 'baker' | 'driver') => {
    if (type === 'customer') {
      login({
        name: 'Shermaine Wong',
        email: 'shermaine.wong@gmail.com',
        phone: '+65 9123 4567',
        address: 'Blk 248 Tampines Street 21, #08-112',
        postalCode: '520248',
        selectedNeighborhood: 'Tampines',
        isVip: true,
        dietaryPreference: 'Halal & Vegetarian',
        favoriteSellerIds: ['seller_makcik_salmah', 'seller_bishan_botanical'],
      });
      setRole('customer');
    } else if (type === 'baker') {
      login({
        name: 'Makcik Salmah & Family',
        email: 'salmah.kitchen@heartlandbakes.sg',
        phone: '+65 9234 5678',
        address: 'Blk 312 Tampines St 33, #04-18',
        postalCode: '520312',
        selectedNeighborhood: 'Tampines',
        isVip: true,
      });
      setRole('seller');
    } else if (type === 'driver') {
      login({
        name: 'Ah Meng (Heartland Courier)',
        email: 'ahmeng.dispatch@gmail.com',
        phone: '+65 8456 7890',
        address: 'Blk 120 Bedok North St 2',
        postalCode: '460120',
        selectedNeighborhood: 'East Region',
        isVip: false,
      });
      setRole('driver');
    }
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div
        id="auth-modal-container"
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-lg shadow-sm">
              🍞
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {userPrefs.isLoggedIn ? 'Account Settings' : 'SGHomeEats Account'}
              </h3>
              <p className="text-xs text-zinc-400">
                {userPrefs.isLoggedIn ? `Signed in as ${userPrefs.name}` : 'Sign in or register to order'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {userPrefs.isLoggedIn ? (
            /* Logged in state inside modal */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 text-amber-400 flex items-center justify-center text-xl font-bold">
                    👩🏻
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{userPrefs.name}</h4>
                    <p className="text-xs text-stone-500">{userPrefs.email}</p>
                    <p className="text-xs text-stone-600 mt-0.5">{userPrefs.phone}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-200 text-xs text-stone-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{userPrefs.address} ({userPrefs.postalCode})</span>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={() => {
                  logout();
                  setRole('customer');
                }}
                className="w-full py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Account</span>
              </button>

              {/* Switch Demo Role */}
              <div className="pt-2 border-t border-stone-200 space-y-2">
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Switch Demo Account (1-Click)
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('customer')}
                    className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-xs">
                        👩🏻
                      </span>
                      <div>
                        <span className="font-bold text-xs text-stone-900">Consumers (Shermaine Wong)</span>
                        <p className="text-[10px] text-stone-500">Tampines • Halal & Pastry lover</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('baker')}
                    className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                        👨🏽‍🍳
                      </span>
                      <div>
                        <span className="font-bold text-xs text-stone-900">Home Bakers (Makcik Salmah)</span>
                        <p className="text-[10px] text-stone-500">Dapur Makcik Salmah • Halal Kitchen</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('driver')}
                    className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                        🛵
                      </span>
                      <div>
                        <span className="font-bold text-xs text-stone-900">Couriers (Ah Meng)</span>
                        <p className="text-[10px] text-stone-500">Heartland Courier Dispatcher</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Signed out state */
            <div className="space-y-5">
              {/* Quick 1-Click Demo Logins */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  ⚡ 1-Click Quick Demo Sign In
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* 1. Consumers */}
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('customer')}
                    className="p-3 rounded-2xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-left transition flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-base shadow-2xs">
                        👩🏻
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-stone-900">Consumers</span>
                          <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded">Shermaine Wong</span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5">Tampines • Halal & Pastry VIP Customer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-800 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* 2. Home Bakers */}
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('baker')}
                    className="p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-zinc-900 text-white font-bold flex items-center justify-center text-base shadow-2xs">
                        👨🏽‍🍳
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-stone-900">Home Bakers</span>
                          <span className="bg-stone-200 text-stone-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded">Makcik Salmah</span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5">Dapur Makcik Salmah • Tampines East (MUIS Halal)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-stone-700 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* 3. Couriers */}
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('driver')}
                    className="p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-zinc-900 text-white font-bold flex items-center justify-center text-base shadow-2xs">
                        🛵
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-stone-900">Couriers</span>
                          <span className="bg-stone-200 text-stone-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded">Ah Meng</span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5">Heartland Motorcycle Courier Dispatcher</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-stone-700 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-stone-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] text-stone-400 font-semibold uppercase tracking-wider absolute">
                  Or Sign In / Sign Up
                </span>
              </div>

              {/* Toggle Tab */}
              <div className="flex rounded-xl bg-stone-100 p-1">
                <button
                  type="button"
                  onClick={() => setTab('signin')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    tab === 'signin' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    tab === 'signup' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Register New Account
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCustomSubmit} className="space-y-3">
                {tab === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                      placeholder="e.g. Rachel Tan"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    placeholder="name@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Singapore Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    placeholder="+65 9123 4567"
                  />
                </div>

                {tab === 'signup' && (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          SG Postal *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          placeholder="520248"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          Delivery Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          placeholder="Blk 248 Tampines St 21, #08-112"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Dietary Preference
                      </label>
                      <select
                        value={formData.dietaryPreference}
                        onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                      >
                        <option value="Halal Only">Halal Only</option>
                        <option value="Muslim Owned & Halal">Muslim Owned & Halal</option>
                        <option value="No Pork No Lard">No Pork No Lard</option>
                        <option value="Vegetarian / Vegan">Vegetarian / Vegan</option>
                        <option value="All Cuisines">All Cuisines</option>
                      </select>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>{tab === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
