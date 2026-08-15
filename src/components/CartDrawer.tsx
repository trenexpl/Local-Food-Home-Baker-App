import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Sparkles, ArrowRight, ShieldCheck, Bike } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    setIsCheckoutOpen,
    userPrefs,
    setIsVipModalOpen,
    sellers,
  } = useApp();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const firstItem = cart[0];
  const seller = firstItem ? sellers.find((s) => s.id === firstItem.sellerId) : null;
  const deliveryFee = userPrefs.isVip ? 0 : (seller ? seller.deliveryFee : 5.00);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-zinc-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-zinc-950 font-bold flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">SGHomeEats Basket</h3>
              <p className="text-[10.5px] text-zinc-400">Singapore Artisanal Drops</p>
            </div>
            <span className="bg-amber-500 text-zinc-950 text-xs font-black px-2 py-0.5 rounded-full ml-1">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VIP Pass Banner in Cart */}
        {!userPrefs.isVip && cart.length > 0 && (
          <div className="bg-amber-50 p-3 px-4 border-b border-amber-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>SGHomeEats VIP:</strong> Get <strong>S$0 Delivery</strong> on every drop!
              </span>
            </div>
            <button
              onClick={() => setIsVipModalOpen(true)}
              className="text-[11px] font-black bg-zinc-900 hover:bg-zinc-800 text-white px-2.5 py-1 rounded-full transition shrink-0 cursor-pointer"
            >
              Try VIP
            </button>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-stone-300" />
              </div>
              <h4 className="font-bold text-base text-zinc-900">Your basket is empty</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                Explore live secret drops and reserve fresh baked goods before batches run out!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-5 py-2.5 rounded-full bg-zinc-900 text-white font-bold text-xs shadow-xs hover:bg-zinc-800 transition cursor-pointer"
              >
                Browse Fresh Drops
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex gap-3 relative group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover bg-stone-200 shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-500 p-1 transition cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate">
                      by {item.sellerName}
                    </p>
                    <p className="text-[11px] text-amber-700 font-semibold mt-0.5 flex items-center gap-1">
                      <Bike className="w-3 h-3 text-amber-600" /> {item.fulfillmentDate || 'Today'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/80">
                    <div className="flex items-center border border-stone-300 bg-white rounded-full overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1.5 px-2 text-stone-600 hover:bg-stone-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1.5 px-2 text-amber-700 hover:bg-stone-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-black text-sm text-zinc-900">
                      S${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">S${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {userPrefs.isVip ? (
                    <span className="text-emerald-700 font-bold">FREE (VIP Pass)</span>
                  ) : (
                    <span>S${deliveryFee.toFixed(2)}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-stone-200">
                <span>Total Due</span>
                <span className="text-base text-zinc-900">
                  S${(subtotal + (userPrefs.isVip ? 0 : deliveryFee)).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Review Order & Pay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Singapore SFA safety verified • PayNow Escrow</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

