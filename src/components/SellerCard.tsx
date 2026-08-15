import React, { useState } from 'react';
import { Seller } from '../types';
import { useApp } from '../context/AppContext';
import { Star, MapPin, CheckCircle2, Heart, Clock, Truck, ChevronRight, Utensils, Image as ImageIcon } from 'lucide-react';
import { FoodStatusBadge } from './FoodStatusBadge';

interface SellerCardProps {
  seller: Seller;
}

export const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
  const { setViewingSellerId, userPrefs, toggleFavoriteSeller } = useApp();
  const isFavorited = userPrefs.favoriteSellerIds.includes(seller.id);

  // Guarantee 3 images
  const listingImages = seller.images && seller.images.length === 3
    ? seller.images
    : [
        seller.coverImage || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        seller.avatar || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=600&q=80',
      ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div
      id={`seller-card-${seller.id}`}
      className="group bg-white rounded-3xl border border-zinc-200 shadow-xs hover:border-zinc-400 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
      onClick={() => setViewingSellerId(seller.id)}
    >
      {/* 3-IMAGE GALLERY LISTING HEADER */}
      <div className="relative p-2.5 bg-zinc-50 border-b border-zinc-100">
        <div className="grid grid-cols-3 gap-1.5 h-36 sm:h-40 rounded-2xl overflow-hidden">
          {/* Main Large Image (Active or First) */}
          <div className="col-span-2 relative h-full overflow-hidden bg-zinc-200 rounded-xl group/main">
            <img
              src={listingImages[activeImageIndex]}
              alt={`${seller.name} item ${activeImageIndex + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover/main:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

            {/* Neighborhood & Region Tag */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-[10px] font-semibold bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-xs">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{seller.neighborhood} • {seller.region}</span>
            </div>

            {/* Image Indicator Badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
              <ImageIcon className="w-2.5 h-2.5" />
              <span>{activeImageIndex + 1} of 3</span>
            </div>
          </div>

          {/* Right 2 Stacked Secondary Images */}
          <div className="col-span-1 grid grid-rows-2 gap-1.5 h-full">
            {listingImages.map((imgUrl, idx) => {
              if (idx === activeImageIndex) return null;
              return (
                <div
                  key={idx}
                  className="relative h-full overflow-hidden bg-zinc-200 rounded-xl cursor-pointer ring-1 ring-black/5 hover:opacity-95 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  title={`View photo ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${seller.name} preview ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteSeller(seller.id);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/90 hover:bg-white text-zinc-700 shadow-sm transition z-10"
          aria-label="Save to favorites"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isFavorited ? 'fill-zinc-900 text-zinc-900' : 'text-zinc-600'
            }`}
          />
        </button>
      </div>

      {/* Seller Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          
          {/* Header with Avatar, Name, and Rating */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-200 bg-zinc-100"
                />
                {seller.verified && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-zinc-900 text-white p-0.5 rounded-full ring-1 ring-white"
                    title="Verified Singapore Home F&B"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-sm text-zinc-900 truncate font-display group-hover:text-amber-800 transition">
                  {seller.name}
                </h3>
                <p className="text-[11px] text-zinc-500 truncate">
                  {seller.neighborhood}, Singapore
                </p>
              </div>
            </div>

            {/* Rating pill */}
            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-lg text-zinc-800 shrink-0">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span className="text-xs font-bold">{seller.rating}</span>
              <span className="text-[10px] text-zinc-400">({seller.reviewCount})</span>
            </div>
          </div>

          {/* Dietary & Halal Status Badge */}
          <div>
            <FoodStatusBadge
              status={seller.foodStatus}
              halalCertInfo={seller.halalCertInfo}
              size="xs"
            />
          </div>

          {/* Tagline */}
          <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
            {seller.tagline}
          </p>

          {/* Categories & Cuisine Tags */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {seller.mainCategory && (
              <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                {seller.mainCategory}
              </span>
            )}
            {(seller.subCategories || []).slice(0, 2).map((sc) => (
              <span
                key={sc}
                className="text-[10px] font-medium bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded-md"
              >
                {sc}
              </span>
            ))}
          </div>
        </div>

        {/* Footer specs & CTA */}
        <div className="pt-2 border-t border-zinc-100 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 bg-zinc-50 p-2 rounded-xl border border-zinc-200">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{(seller.minLeadTime || 'Pre-order').split('(')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">
                {userPrefs.isVip ? 'Free (VIP)' : `S$${(seller.deliveryFee ?? 0).toFixed(2)} delivery`}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-zinc-900 group-hover:text-amber-800 transition px-1">
            <span className="flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-zinc-500" />
              <span>View Kitchen & Menu</span>
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition" />
          </div>
        </div>

      </div>
    </div>
  );
};
