import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Flame, Truck, Gift, ShieldCheck, Crown, Check } from 'lucide-react';

export const VipPassModal: React.FC = () => {
  const { isVipModalOpen, setIsVipModalOpen, userPrefs, toggleVipPass } = useApp();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVipModalOpen) {
        setIsVipModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVipModalOpen, setIsVipModalOpen]);

  if (!isVipModalOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsVipModalOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="vip-pass-modal-container"
        className="relative bg-stone-900 text-white w-full max-w-md max-h-[88vh] rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Prominent High-Contrast Close / Exit Button */}
        <button
          onClick={() => setIsVipModalOpen(false)}
          className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 text-stone-950 font-black text-xs shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer border border-stone-200"
          aria-label="Close VIP Pass dialog"
          title="Close (Exit)"
        >
          <X className="w-4 h-4 text-stone-950" strokeWidth={2.5} />
          <span>Exit</span>
        </button>

        {/* Compact Golden Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 border-b border-amber-500/20 text-center shrink-0">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400 text-stone-950 shadow-lg mb-2">
            <Crown className="w-6 h-6 fill-stone-950" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight font-display text-white pr-16 sm:pr-0">
            SGHomeEats VIP Pass
          </h3>
          <p className="text-xs text-amber-100/90 mt-1 max-w-xs mx-auto leading-tight">
            Unlock exclusive home kitchen drops and perks across Singapore.
          </p>

          <div className="mt-2.5 inline-flex items-baseline gap-1.5 bg-black/50 px-3.5 py-1 rounded-full border border-amber-400/40 backdrop-blur-xs">
            <span className="text-base sm:text-lg font-black text-amber-300">S$9.90</span>
            <span className="text-[11px] text-stone-300 font-medium">/ month • Cancel anytime</span>
          </div>
        </div>

        {/* Scrollable Benefits Body */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1 text-xs">
          <div className="space-y-2">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-800/70 border border-stone-700/60">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">30-Min Early Secret Drop Access</h4>
                <p className="text-[11px] text-stone-400 leading-tight mt-0.5">
                  Pre-order limited batches before public release.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-800/70 border border-stone-700/60">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">S$0 Free Islandwide Delivery</h4>
                <p className="text-[11px] text-stone-400 leading-tight mt-0.5">
                  Save S$5.00–S$7.00 delivery fees with zero minimum spend.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-800/70 border border-stone-700/60">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Exclusive VIP-Only Seasonal Drops</h4>
                <p className="text-[11px] text-stone-400 leading-tight mt-0.5">
                  Secret experimental recipes from master home bakers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-800/70 border border-stone-700/60">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Extra S$2.50 Batch Discount</h4>
                <p className="text-[11px] text-stone-400 leading-tight mt-0.5">
                  Automatic instant discount applied on every drop checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Current Status Box */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <div>
              <p className="text-[11px] text-stone-400">Current Membership:</p>
              <p className="font-extrabold text-amber-300 text-xs mt-0.5 flex items-center gap-1">
                {userPrefs.isVip ? '👑 VIP PASS ACTIVE' : 'Standard Guest'}
              </p>
            </div>

            <span className="text-[10.5px] text-stone-400">
              {userPrefs.isVip ? 'Renews 31 Dec 2026' : 'No active subscription'}
            </span>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <div className="p-4 bg-stone-950/90 border-t border-stone-800 shrink-0 space-y-2">
          <button
            onClick={() => {
              toggleVipPass();
              setIsVipModalOpen(false);
            }}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 fill-stone-950" />
            <span>
              {userPrefs.isVip ? 'Manage / Deactivate VIP Pass' : 'Activate VIP Pass (S$0 Delivery)'}
            </span>
          </button>

          <div className="flex items-center justify-between text-[10.5px] text-stone-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Singapore Home-Baker Guarantee</span>
            </span>
            <button
              onClick={() => setIsVipModalOpen(false)}
              className="text-stone-400 hover:text-white underline cursor-pointer"
            >
              Close window
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

