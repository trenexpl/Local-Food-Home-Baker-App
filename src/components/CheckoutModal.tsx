import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CreditCard,
  QrCode,
  Package,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Bike
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    placeOrder,
    userPrefs,
    sellers,
    setActiveCustomerTab,
  } = useApp();

  const firstItem = cart[0];
  const seller = firstItem ? sellers.find((s) => s.id === firstItem.sellerId) : sellers[0];

  const [formData, setFormData] = useState({
    customerName: userPrefs.name || 'Shermaine Wong',
    customerPhone: userPrefs.phone || '+65 9123 4567',
    customerAddress: userPrefs.address || 'Blk 248 Tampines Street 21, #08-112',
    customerPostalCode: userPrefs.postalCode || '520248',
    deliveryOption: 'delivery' as 'delivery' | 'self_collection',
    deliveryTimeslot: 'Today, 4:30 PM - 6:30 PM (Evening Batch)',
    specialInstructions: 'Please leave on shoe cabinet if unattended.',
    paymentMethod: 'paynow' as 'paynow' | 'credit_card',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen || cart.length === 0) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = formData.deliveryOption === 'delivery' ? (userPrefs.isVip ? 0 : (seller?.deliveryFee || 5.0)) : 0;
  const vipDiscount = userPrefs.isVip ? 2.50 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - vipDiscount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      placeOrder(formData);
      setIsProcessing(false);
      setActiveCustomerTab('orders');
    }, 900);
  };

  const handlePostalPreset = (postal: string, addr: string) => {
    setFormData((prev) => ({
      ...prev,
      customerPostalCode: postal,
      customerAddress: addr,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div
        id="checkout-modal-container"
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold">
              🍲
            </div>
            <div>
              <h3 className="font-black text-base text-white">SGHomeEats Express Checkout</h3>
              <p className="text-[11px] text-zinc-400">
                Direct to {seller?.name || 'Local Home Chef'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 max-h-[calc(85vh-180px)] overflow-y-auto">
          
          {/* Section 1: Fulfillment Type */}
          <div>
            <label className="block text-xs font-black text-zinc-900 uppercase tracking-wider mb-2">
              1. Choose Fulfillment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, deliveryOption: 'delivery' })}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                  formData.deliveryOption === 'delivery'
                    ? 'border-zinc-900 bg-amber-50/50 ring-2 ring-zinc-900/10'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs text-zinc-900">Doorstep Delivery</span>
                  </div>
                  {userPrefs.isVip && (
                    <span className="text-[10px] bg-amber-500 text-stone-950 font-black px-1.5 py-0.5 rounded">
                      FREE VIP
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Dispatched by local courier ({userPrefs.isVip ? 'Free with VIP Pass' : `+S$${seller?.deliveryFee.toFixed(2) || '5.00'}`})
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, deliveryOption: 'self_collection' })}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                  formData.deliveryOption === 'self_collection'
                    ? 'border-zinc-900 bg-amber-50/50 ring-2 ring-zinc-900/10'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-zinc-700" />
                    <span className="font-bold text-xs text-zinc-900">Self-Collection</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    S$0.00
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Pick up at {seller?.neighborhood} ({seller?.selfCollectionAddress || 'Baker Studio'})
                </p>
              </button>
            </div>
          </div>

          {/* Section 2: Contact & Address Information */}
          <div className="space-y-3">
            <label className="block text-xs font-black text-zinc-900 uppercase tracking-wider">
              2. Delivery Address & Contact Details
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  placeholder="e.g. Shermaine Wong"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Singapore Mobile (+65) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  placeholder="+65 9123 4567"
                />
              </div>
            </div>

            {formData.deliveryOption === 'delivery' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      SG Postal Code (6 Digits) *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={formData.customerPostalCode}
                      onChange={(e) => setFormData({ ...formData, customerPostalCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                      placeholder="e.g. 520248"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Unit & Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                      placeholder="Blk 248 Tampines Street 21, #08-112"
                    />
                  </div>
                </div>

                {/* Quick Postal Presets */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-stone-500">
                  <span className="font-semibold text-stone-700">Quick SG Locations:</span>
                  {[
                    { label: 'Tampines', postal: '520248', addr: 'Blk 248 Tampines Street 21, #08-112' },
                    { label: 'Bishan', postal: '570180', addr: 'Blk 180 Bishan Street 13, #04-45' },
                    { label: 'Orchard', postal: '238863', addr: '82 Orchard Road, #12-04' },
                    { label: 'Woodlands', postal: '730888', addr: 'Blk 888 Woodlands Drive 50, #09-32' },
                    { label: 'Serangoon', postal: '550212', addr: 'Blk 212 Serangoon Ave 4, #05-88' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePostalPreset(preset.postal, preset.addr)}
                      className="px-2 py-0.5 bg-stone-100 hover:bg-amber-50 rounded-full text-stone-700 hover:text-amber-900 font-medium cursor-pointer"
                    >
                      📍 {preset.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Drop Notes / Unit Access Instructions
              </label>
              <input
                type="text"
                value={formData.specialInstructions}
                onChange={(e) =>
                  setFormData({ ...formData, specialInstructions: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                placeholder="e.g. Leave on shoe cabinet, ring bell once."
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3">
            <label className="block text-xs font-black text-zinc-900 uppercase tracking-wider">
              3. Select Payment Method
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'paynow' })}
                className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                  formData.paymentMethod === 'paynow'
                    ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500/20 text-purple-950 font-bold'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  PayNow
                </div>
                <span className="text-xs font-bold">PayNow SG (Escrow)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'credit_card' })}
                className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                  formData.paymentMethod === 'credit_card'
                    ? 'border-zinc-900 bg-stone-100 ring-2 ring-zinc-900/20 text-zinc-950 font-bold'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-xs font-bold">Credit / Debit Card</span>
              </button>
            </div>

            {/* PayNow Preview Box */}
            {formData.paymentMethod === 'paynow' && (
              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 flex items-center gap-3">
                <div className="w-12 h-12 bg-white p-1 rounded-xl border border-purple-200 flex items-center justify-center shadow-xs shrink-0">
                  <QrCode className="w-9 h-9 text-purple-900" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-purple-950">PayNow Escrow Protection</p>
                  <p className="text-[11px] text-purple-800">
                    UEN: <strong className="font-mono">202619402C</strong> (SGHomeEats Escrow). Funds held securely until batch arrival.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary breakdown */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <h4 className="font-black text-zinc-900 uppercase tracking-wider text-[11px]">
              Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
            </h4>

            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-stone-600">
                <span className="truncate max-w-[280px]">
                  {item.quantity}x {item.title}
                </span>
                <span className="font-bold text-zinc-900">
                  S${(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="pt-2 border-t border-stone-200 flex justify-between text-stone-600">
              <span>Delivery Fee</span>
              <span>
                {formData.deliveryOption === 'self_collection' ? (
                  <strong className="text-emerald-700">S$0.00 (Self-Collection)</strong>
                ) : userPrefs.isVip ? (
                  <strong className="text-emerald-700">FREE (VIP Pass)</strong>
                ) : (
                  `S$${deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>

            {userPrefs.isVip && (
              <div className="flex justify-between text-amber-700 font-bold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> VIP Drop Voucher
                </span>
                <span>-S$2.50</span>
              </div>
            )}

            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
              <span className="font-black text-zinc-900 text-sm">Total Amount Payable</span>
              <span className="font-black text-xl text-zinc-900">
                S${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-base shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing Order...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Place Order • S${grandTotal.toFixed(2)}</span>
                <ChevronRight className="w-5 h-5 text-amber-400" />
              </span>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Singapore consumer protection & real-time delivery GPS tracking included</span>
          </div>

        </form>
      </div>
    </div>
  );
};
