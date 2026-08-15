import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodStatusBadge } from './FoodStatusBadge';
import {
  X,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  Truck,
  Package,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Flame,
  Instagram,
  FileCheck
} from 'lucide-react';

export const DropDetailModal: React.FC = () => {
  const {
    viewingDropId,
    setViewingDropId,
    drops,
    sellers,
    addToCart,
    setViewingSellerId,
    setIsCheckoutOpen,
    userPrefs,
    setIsVipModalOpen
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'self_collection'>('delivery');

  if (!viewingDropId) return null;

  const drop = drops.find((d) => d.id === viewingDropId);
  if (!drop) return null;

  const seller = sellers.find((s) => s.id === drop.sellerId);
  const isSoldOut = drop.remainingBatch <= 0;
  const isUrgent = drop.remainingBatch <= 5 && !isSoldOut;

  const dropFoodStatus = drop.foodStatus || seller?.foodStatus || 'not_specified';
  const halalCert = drop.halalCertInfo || seller?.halalCertInfo;

  const handleAddToCart = () => {
    addToCart(drop, quantity, deliveryOption);
    setViewingDropId(null);
  };

  const handleDirectPreOrder = () => {
    addToCart(drop, quantity, deliveryOption);
    setViewingDropId(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        id="drop-detail-modal"
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-zinc-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          onClick={() => setViewingDropId(null)}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Image Banner */}
        <div className="relative h-60 sm:h-68 bg-zinc-100 overflow-hidden">
          <img
            src={drop.image}
            alt={drop.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          {/* Badges on Image */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
            {drop.isVipEarlyAccess && (
              <span className="inline-flex items-center gap-1.5 bg-zinc-900 text-white font-semibold text-xs px-2.5 py-1 rounded shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                VIP Early Window
              </span>
            )}
            {isUrgent && (
              <span className="inline-flex items-center gap-1.5 bg-zinc-900 text-white font-semibold text-xs px-2.5 py-1 rounded shadow-xs">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Only {drop.remainingBatch} Left
              </span>
            )}
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-zinc-300 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
                📍 {drop.neighborhood}
              </span>
              {drop.mainCategory && (
                <span className="text-xs text-zinc-300 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
                  {drop.mainCategory}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              {drop.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[calc(85vh-280px)] overflow-y-auto">
          
          {/* Food Status Integrity Section */}
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Dietary & Halal Integrity Status
              </span>
              <FoodStatusBadge
                status={dropFoodStatus}
                halalCertInfo={halalCert}
                size="md"
              />
            </div>

            {drop.subCategory && (
              <div className="text-left sm:text-right">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                  Subcategory
                </span>
                <span className="inline-block text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg">
                  {drop.subCategory}
                </span>
              </div>
            )}
          </div>

          {/* Price & Inventory Bar */}
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-zinc-900 font-display">
                  S${drop.price.toFixed(2)}
                </span>
                {drop.originalPrice && (
                  <span className="text-xs text-zinc-400 line-through">
                    S${drop.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-zinc-500 font-normal">/ batch box</span>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">
                Freshly prepared on delivery day
              </p>
            </div>

            <div className="sm:w-48">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-600 font-medium">Batch Stock:</span>
                <span className="text-zinc-900 font-semibold">
                  {drop.remainingBatch} / {drop.totalBatch} Left
                </span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-zinc-900 transition-all duration-300"
                  style={{ width: `${Math.max(6, (drop.remainingBatch / drop.totalBatch) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Baker Profile Card */}
          {seller && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-3">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-xs text-zinc-900">{seller.name}</h4>
                    {seller.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500">{seller.neighborhood} • ⭐ {seller.rating} ({seller.reviewCount} reviews)</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setViewingDropId(null);
                  setViewingSellerId(seller.id);
                }}
                className="text-xs font-medium text-zinc-800 hover:text-zinc-950 bg-white px-2.5 py-1.5 rounded-xl border border-zinc-200 transition cursor-pointer"
              >
                View Kitchen
              </button>
            </div>
          )}

          {/* Description & Flavor Notes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
              About This Batch
            </h4>
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
              {drop.description}
            </p>

            {drop.flavorNotes && drop.flavorNotes.length > 0 && (
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-zinc-500">Notes:</span>
                {drop.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="text-xs font-medium bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded border border-zinc-200"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Fulfillment details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-100">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <div className="flex items-center gap-2 text-zinc-900 font-medium text-xs">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Pre-Order Window</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Closes when sold out or at scheduled cutoff.
              </p>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <div className="flex items-center gap-2 text-zinc-900 font-medium text-xs">
                <Truck className="w-3.5 h-3.5 text-zinc-500" />
                <span>Fulfillment Date</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {drop.fulfillmentDate}
              </p>
            </div>
          </div>

          {/* Delivery or Self Collection toggle */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
              Fulfillment Option:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryOption('delivery')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  deliveryOption === 'delivery'
                    ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-zinc-800" />
                    <span className="font-semibold text-xs text-zinc-900">Delivery</span>
                  </div>
                  {userPrefs.isVip && (
                    <span className="text-[10px] font-semibold bg-zinc-900 text-white px-1.5 py-0.5 rounded">
                      VIP $0
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Local courier ({userPrefs.isVip ? 'Free for VIP' : `+S$${seller?.deliveryFee.toFixed(2) || '5.00'}`})
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryOption('self_collection')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  deliveryOption === 'self_collection'
                    ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-zinc-800" />
                    <span className="font-semibold text-xs text-zinc-900">Self-Collection</span>
                  </div>
                  <span className="text-[10px] font-medium bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded">
                    FREE
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Pick up at {seller?.neighborhood || 'Baker Studio'}
                </p>
              </button>
            </div>
          </div>

          {/* SFA Hygiene Assurance */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
            <ShieldCheck className="w-4 h-4 text-zinc-700 shrink-0" />
            <span>
              Verified SFA Home-Based Business. Handled with standard food prep safety.
            </span>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-medium text-zinc-600">Boxes:</span>
            <div className="flex items-center border border-zinc-300 bg-white rounded-lg overflow-hidden">
              <button
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 transition cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-xs text-zinc-900">
                {quantity}
              </span>
              <button
                disabled={quantity >= drop.remainingBatch}
                onClick={() => setQuantity((q) => Math.min(drop.remainingBatch, q + 1))}
                className="p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-sm font-bold text-zinc-900 font-display sm:ml-2">
              S${(drop.price * quantity).toFixed(2)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              disabled={isSoldOut}
              onClick={handleAddToCart}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-900 text-xs font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>

            <button
              disabled={isSoldOut}
              onClick={handleDirectPreOrder}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>Instant Checkout</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
