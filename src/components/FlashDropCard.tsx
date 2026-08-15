import React, { useState, useEffect } from 'react';
import { FlashDrop } from '../types';
import { useApp } from '../context/AppContext';
import { Clock, MapPin, Sparkles, Flame, CheckCircle2, ChevronRight, Star } from 'lucide-react';
import { FoodStatusBadge } from './FoodStatusBadge';

interface FlashDropCardProps {
  drop: FlashDrop;
  compact?: boolean;
}

export const FlashDropCard: React.FC<FlashDropCardProps> = ({ drop, compact = false }) => {
  const { setViewingDropId, setViewingSellerId, sellers, userPrefs, addToCart } = useApp();
  const seller = sellers.find((s) => s.id === drop.sellerId);

  // Countdown calculation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = drop.status === 'upcoming' 
        ? new Date(drop.openingTime).getTime()
        : new Date(drop.closingTime).getTime();
      const difference = targetTime - Date.now();

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [drop.closingTime, drop.openingTime, drop.status]);

  const percentageLeft = Math.round((drop.remainingBatch / drop.totalBatch) * 100);
  const isSoldOut = drop.remainingBatch <= 0 || drop.status === 'sold_out';
  const isUrgent = drop.remainingBatch <= 5 && !isSoldOut;

  const dropFoodStatus = drop.foodStatus || seller?.foodStatus || 'not_specified';
  const halalCert = drop.halalCertInfo || seller?.halalCertInfo;

  return (
    <div
      id={`drop-card-${drop.id}`}
      className="group bg-white rounded-2xl border border-zinc-200 shadow-xs hover:border-zinc-400 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col relative"
    >
      {/* Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-100 cursor-pointer" onClick={() => setViewingDropId(drop.id)}>
        <img
          src={drop.image}
          alt={drop.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
          {drop.isVipEarlyAccess ? (
            <span className="inline-flex items-center gap-1 bg-zinc-900 text-white font-medium text-[10px] px-2 py-0.5 rounded shadow-xs">
              <Sparkles className="w-3 h-3 text-zinc-300" />
              VIP EARLY
            </span>
          ) : isUrgent ? (
            <span className="inline-flex items-center gap-1 bg-zinc-900 text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-xs">
              <Flame className="w-3 h-3 text-rose-400" />
              {drop.remainingBatch} Left
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-zinc-900/90 backdrop-blur-xs text-white font-medium text-[10px] px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Live Batch
            </span>
          )}

          <span className="bg-white text-zinc-950 font-bold text-xs px-2 py-0.5 rounded shadow-xs">
            S${drop.price.toFixed(2)}
          </span>
        </div>

        {/* Bottom Image Overlay: Live Countdown & Neighborhood */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-mono border border-white/10">
            <Clock className="w-3 h-3 text-zinc-300" />
            <span>
              {drop.status === 'upcoming' ? 'Opens ' : 'Closes '}
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>

          <span className="text-[10px] text-zinc-200 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
            📍 {drop.neighborhood}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller row & Food Status */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            {seller ? (
              <div
                onClick={() => setViewingSellerId(seller.id)}
                className="flex items-center gap-1.5 truncate cursor-pointer group/baker hover:opacity-80 transition flex-1"
              >
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  referrerPolicy="no-referrer"
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
                <span className="text-xs font-medium text-zinc-700 group-hover/baker:text-zinc-950 transition truncate">
                  {seller.name}
                </span>
                {seller.verified && (
                  <CheckCircle2 className="w-3 h-3 text-zinc-700 shrink-0" />
                )}
              </div>
            ) : <div />}

            <FoodStatusBadge
              status={dropFoodStatus}
              halalCertInfo={halalCert}
              size="xs"
            />
          </div>

          {/* Title & Tagline */}
          <h3
            onClick={() => setViewingDropId(drop.id)}
            className="font-semibold text-sm text-zinc-900 font-display group-hover:text-zinc-700 transition cursor-pointer line-clamp-1"
          >
            {drop.title}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
            {drop.tagline || drop.description}
          </p>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1 mt-2">
            {drop.mainCategory && (
              <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded">
                {drop.mainCategory}
              </span>
            )}
            {drop.subCategory && (
              <span className="text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded">
                {drop.subCategory}
              </span>
            )}
          </div>

          {/* Inventory Progress Bar */}
          <div className="mt-3 bg-zinc-100 rounded-full h-1.5 w-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isUrgent ? 'bg-zinc-900' : 'bg-zinc-800'
              }`}
              style={{ width: `${Math.max(8, percentageLeft)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-500 font-medium">
            <span>
              {isSoldOut ? (
                <span className="text-zinc-900 font-bold">SOLD OUT</span>
              ) : (
                <>
                  <strong className="text-zinc-900">{drop.remainingBatch}</strong> / {drop.totalBatch} boxes left
                </>
              )}
            </span>
            <span>{percentageLeft}% Available</span>
          </div>

          {/* Fulfillment Schedule */}
          <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-600">
            <div className="flex items-center gap-1 truncate text-zinc-500">
              <span>📅</span>
              <span className="truncate">{drop.fulfillmentDate}</span>
            </div>
            <span className="text-[10px] font-medium text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">
              Courier Delivery
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center gap-2">
          <button
            onClick={() => setViewingDropId(drop.id)}
            className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>View Batch Details</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {!isSoldOut && (
            <button
              onClick={() => addToCart(drop, 1)}
              title="Quick Add 1 box to cart"
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900 text-xs font-bold transition flex items-center justify-center cursor-pointer"
            >
              +1
            </button>
          )}
        </div>
      </div>
    </div>
  );
};



