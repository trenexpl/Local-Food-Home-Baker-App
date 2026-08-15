import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ChefHat, Bike, Sparkles, BellRing } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { role, setRole, userPrefs, toggleVipPass, triggerSimulatedDropAlert, orders } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  return (
    <aside aria-label="Role Switcher" id="role-switcher-banner" className="bg-zinc-900 text-zinc-300 text-xs py-2 px-3 sm:px-6 border-b border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-zinc-800 text-zinc-200 font-medium px-2.5 py-0.5 rounded-full text-[11px] border border-zinc-700/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            SGHomeEats • Live Platform
          </span>
          <span className="hidden md:inline text-zinc-400">
            Switch persona to test full ecosystem:
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {/* Role selector buttons */}
          <div className="inline-flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
            <button
              id="role-btn-customer"
              onClick={() => setRole('customer')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                role === 'customer'
                  ? 'bg-zinc-100 text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Consumer</span>
              {activeOrdersCount > 0 && role !== 'customer' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
            </button>

            <button
              id="role-btn-seller"
              onClick={() => setRole('seller')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                role === 'seller'
                  ? 'bg-zinc-100 text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Home Baker</span>
            </button>

            <button
              id="role-btn-driver"
              onClick={() => setRole('driver')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                role === 'driver'
                  ? 'bg-zinc-100 text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Courier</span>
            </button>
          </div>

          {/* Quick Simulation Tools */}
          <div className="flex items-center gap-1">
            <button
              id="btn-simulate-drop-alert"
              onClick={triggerSimulatedDropAlert}
              title="Trigger a simulated flash drop push alert"
              className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-md border border-zinc-700 transition"
            >
              <BellRing className="w-3 h-3 text-zinc-300" />
              <span className="hidden sm:inline">Simulate Alert</span>
            </button>

            <button
              id="btn-quick-toggle-vip"
              onClick={toggleVipPass}
              title="Toggle VIP Early Access status"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-medium transition ${
                userPrefs.isVip
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-200 font-bold'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-zinc-400" />
              <span>VIP Pass: {userPrefs.isVip ? 'ACTIVE' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};


