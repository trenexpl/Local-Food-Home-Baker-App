import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Check, Flame, Truck, Gift, Star, ShieldCheck, Crown } from 'lucide-react';

export const VipPassModal: React.FC = () => {
  const { isVipModalOpen, setIsVipModalOpen, userPrefs, toggleVipPass } = useApp();

  if (!isVipModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div
        id="vip-pass-modal-container"
        className="relative bg-stone-900 text-white w-full max-w-lg rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsVipModalOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Golden Glow Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 border-b border-amber-500/20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-400 text-stone-950 shadow-xl mb-3">
            <Crown className="w-8 h-8 fill-stone-950" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-white">
            SGHomeEats VIP Pass
          </h3>
          <p className="text-xs sm:text-sm text-amber-200 mt-1 max-w-xs mx-auto">
            Never miss a sold-out drop again. Unlock exclusive home kitchen and micro-bakery perks across Singapore.
          </p>

          <div className="mt-4 inline-flex items-baseline gap-1.5 bg-black/40 px-4 py-1.5 rounded-full border border-amber-400/30 backdrop-blur-xs">
            <span className="text-xl font-extrabold text-amber-300">S$9.90</span>
            <span className="text-xs text-stone-300 font-medium">/ month (Cancel anytime)</span>
          </div>
        </div>

        {/* Benefits List */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-800/60 border border-stone-800">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">30-Min Early Secret Drop Access</h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Pre-order limited batches 30–60 minutes before they are released to the public.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-800/60 border border-stone-800">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">S$0 Free Islandwide Delivery</h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Save S$5.00–S$7.00 delivery fees on all verified home baker orders with no min spend.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-800/60 border border-stone-800">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Exclusive VIP-Only Seasonal Drops</h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Secret experimental flavors from top master home bakers made only for VIP members.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-800/60 border border-stone-800">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Extra S$2.50 Batch Discount</h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Automatic instant discount applied on every drop checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Current Status Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <div>
              <p className="text-stone-300">Your Current Status:</p>
              <p className="font-extrabold text-amber-300 text-sm mt-0.5">
                {userPrefs.isVip ? '👑 VIP PASS ACTIVE' : 'Standard Guest Pass'}
              </p>
            </div>

            <span className="text-[11px] text-stone-400">
              {userPrefs.isVip ? 'Renews 31 Dec 2026' : 'No active pass'}
            </span>
          </div>

          {/* Action CTA */}
          <button
            onClick={() => {
              toggleVipPass();
              setIsVipModalOpen(false);
            }}
            className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-stone-950" />
            <span>
              {userPrefs.isVip ? 'Manage / Deactivate VIP Pass' : 'Activate VIP Pass (Instant S$0 Delivery)'}
            </span>
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Singapore Home-Baker Community Guarantee</span>
          </div>
        </div>

      </div>
    </div>
  );
};
