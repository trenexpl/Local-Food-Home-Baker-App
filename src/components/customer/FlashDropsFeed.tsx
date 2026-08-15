import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FlashDropCard } from '../FlashDropCard';
import { LocationFilterButton } from '../LocationFilterButton';
import {
  Flame,
  Clock,
  Sparkles,
  BellRing,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  SlidersHorizontal,
  MapPin
} from 'lucide-react';

export const FlashDropsFeed: React.FC = () => {
  const {
    filteredDrops,
    drops,
    triggerSimulatedDropAlert,
    setIsVipModalOpen,
    setIsFilterModalOpen,
    userPrefs,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'urgent' | 'vip' | 'upcoming'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const displayDrops = filteredDrops.filter((drop) => {
    if (activeFilter === 'live') return drop.status === 'live';
    if (activeFilter === 'urgent') return drop.status === 'live' && drop.remainingBatch <= 5;
    if (activeFilter === 'vip') return drop.isVipEarlyAccess;
    if (activeFilter === 'upcoming') return drop.status === 'upcoming';
    return true;
  });

  const liveCount = filteredDrops.filter((d) => d.status === 'live').length;
  const urgentCount = filteredDrops.filter((d) => d.status === 'live' && d.remainingBatch <= 5).length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Radar Control Header */}
      <div className="bg-zinc-900 text-white p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-zinc-800 text-zinc-300 font-medium px-2.5 py-0.5 rounded-lg text-xs border border-zinc-700">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                Live Batch Radar
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {liveCount} Batches Matching
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-bold tracking-tight font-display text-white">
              Limited Home Kitchen Flash Drops
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Live batch releases from Singapore home chefs and bakers. Verified food status, real-time stock counters, and pre-orders.
            </p>
          </div>

          {/* Quick Actions & Sound toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={triggerSimulatedDropAlert}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <BellRing className="w-3.5 h-3.5 text-zinc-900" />
              <span>Simulate Drop Push</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition cursor-pointer"
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-zinc-300" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </button>

            {!userPrefs.isVip && (
              <button
                onClick={() => setIsVipModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <span>Get VIP Access</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Location Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-zinc-900 text-white font-bold shadow-xs'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium'
            }`}
          >
            <span>All Batches</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${activeFilter === 'all' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-700'}`}>
              {filteredDrops.length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('live')}
            className={`px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'live'
                ? 'bg-zinc-900 text-white font-bold shadow-xs'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Live Now</span>
            <span className="text-[10px] opacity-75">({liveCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'urgent'
                ? 'bg-zinc-900 text-white font-bold shadow-xs'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-zinc-400" />
            <span>Low Stock</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${activeFilter === 'urgent' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-700'}`}>
              {urgentCount}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'upcoming'
                ? 'bg-zinc-900 text-white font-bold shadow-xs'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Upcoming</span>
          </button>
        </div>

        {/* Location Selector & Full Filter Trigger */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <LocationFilterButton variant="compact" />
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-zinc-950 p-1.5 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Drops Grid */}
      {displayDrops.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 space-y-3">
          <Flame className="w-10 h-10 text-zinc-300 mx-auto" />
          <h3 className="font-semibold text-sm text-zinc-900">No drops matching this filter</h3>
          <p className="text-xs text-zinc-500">
            Check back shortly or reset your location/category filters.
          </p>
          <button
            onClick={() => setActiveFilter('all')}
            className="px-4 py-2 bg-zinc-900 text-white font-semibold text-xs rounded-xl cursor-pointer hover:bg-zinc-800 transition"
          >
            Show All Drops
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayDrops.map((drop) => (
            <FlashDropCard key={drop.id} drop={drop} />
          ))}
        </div>
      )}

    </div>
  );
};
