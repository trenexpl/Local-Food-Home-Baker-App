import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Heart, Sparkles, MapPin, Instagram, HelpCircle, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setRole, setActiveCustomerTab, setViewingSellerId, setViewingDropId, setIsVipModalOpen } = useApp();

  const handleFooterLogoClick = () => {
    setRole('customer');
    setActiveCustomerTab('home');
    setViewingSellerId(null);
    setViewingDropId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-12 pb-8 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Trust & Community Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-zinc-900">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-white">Verified Home Micro-Bakers</h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                All micro-kitchens adhere to SFA home-based business food safety and hygiene guidelines.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-white">Direct-to-Artisan Platform</h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Low commission structure allows local home bakers to thrive and share limited batches.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-white">VIP Early Batch Access</h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Unlock 30-minute early reservation windows on high-demand artisanal drops.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8">
          <div>
            <button
              onClick={handleFooterLogoClick}
              className="flex items-center gap-2 mb-2.5 text-left group cursor-pointer"
              title="Go to SGHomeEats Main Page"
            >
              <div className="w-6 h-6 rounded-md bg-amber-500 text-zinc-950 font-black flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                🍲
              </div>
              <span className="font-bold text-white font-display text-sm tracking-tight group-hover:text-amber-400 transition-colors">
                SGHomeEats
              </span>
            </button>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Singapore's premier marketplace for home-based micro-kitchens, artisanal bakers, and heritage culinary drops.
            </p>
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Singapore 🇸🇬</span>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-xs text-zinc-300 mb-2.5">Discover</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><button onClick={() => setRole('customer')} className="hover:text-white transition cursor-pointer">Artisanal Drops</button></li>
              <li><button onClick={() => setRole('customer')} className="hover:text-white transition cursor-pointer">Home Kitchens</button></li>
              <li><button onClick={() => setRole('customer')} className="hover:text-white transition cursor-pointer">Sourdough & Pastries</button></li>
              <li><button onClick={() => setRole('customer')} className="hover:text-white transition cursor-pointer">Heritage & Kuehs</button></li>
              <li><button onClick={() => setIsVipModalOpen(true)} className="text-zinc-200 hover:text-white transition cursor-pointer">VIP Membership</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-xs text-zinc-300 mb-2.5">Creators & Couriers</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><button onClick={() => setRole('seller')} className="hover:text-white transition font-medium text-zinc-300 cursor-pointer">Kitchen & Baker Portal</button></li>
              <li><button onClick={() => setRole('seller')} className="hover:text-white transition cursor-pointer">Schedule a Drop</button></li>
              <li><button onClick={() => setRole('driver')} className="hover:text-white transition font-medium text-zinc-300 cursor-pointer">Courier Dispatch</button></li>
              <li><button onClick={() => setRole('seller')} className="hover:text-white transition cursor-pointer">SFA Safety Guidelines</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-xs text-zinc-300 mb-2.5">Platform & Trust</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> PayNow Secure Escrow</li>
              <li className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-zinc-400" /> Help & Dispute Support</li>
              <li className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-zinc-400" /> Terms of Service</li>
              <li className="flex items-center gap-1.5"><Instagram className="w-3.5 h-3.5 text-zinc-400" /> @sghomeeats.app</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <p>© 2026 SGHomeEats Singapore Pte Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-300 cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">Terms</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">Food Hygiene</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
