import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Clock,
  Bike,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Phone,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

export const CustomerOrdersView: React.FC = () => {
  const { orders, setTrackingOrderId, setActiveCustomerTab } = useApp();

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'cancelled');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Package className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-display">
              My Orders & Live GPS Tracking
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track preparation progress, driver dispatch, and estimated arrival in real-time.
          </p>
        </div>

        {activeOrders.length > 0 && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-2xl text-xs font-bold self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>{activeOrders.length} Order{activeOrders.length > 1 ? 's' : ''} in Motion</span>
          </div>
        )}
      </div>

      {/* 1. Active In-Progress Orders */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-stone-900 font-display flex items-center gap-2">
          <span>Active Dispatches</span>
          <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
            {activeOrders.length}
          </span>
        </h2>

        {activeOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 space-y-3">
            <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-sm text-stone-700">No active orders right now</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Ready for a treat? Check the Flash Drop Radar to catch today's freshly baked drops!
            </p>
            <button
              onClick={() => setActiveCustomerTab('drops')}
              className="px-4 py-2 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-xs"
            >
              Browse Flash Drops
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                      📦
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base font-display">
                          {order.sellerName}
                        </span>
                        <span className="font-mono text-xs bg-stone-800 text-amber-300 px-2 py-0.5 rounded border border-stone-700">
                          {order.orderNumber}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.deliveryTimeslot}
                      </p>
                    </div>
                  </div>

                  <button
                    id={`track-btn-${order.id}`}
                    onClick={() => setTrackingOrderId(order.id)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <Bike className="w-4 h-4" />
                    <span>Open Live GPS Radar</span>
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                      <div>
                        <span className="text-stone-500 font-medium">Current Status: </span>
                        <strong className="text-stone-900 uppercase font-display text-sm">
                          {order.status.replace(/_/g, ' ')}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-stone-600">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>{order.estimatedDeliveryTime}</span>
                    </div>
                  </div>

                  {/* Order Items Grid */}
                  <div className="divide-y divide-stone-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover bg-stone-100"
                          />
                          <div>
                            <p className="font-bold text-stone-900">{item.title}</p>
                            <p className="text-stone-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-stone-900">
                          S${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Driver summary if assigned */}
                  {order.driverName && (
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={order.driverPhoto || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'}
                          alt={order.driverName}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-stone-900">Rider: {order.driverName}</p>
                          <p className="text-stone-500 text-[11px]">{order.driverVehicle}</p>
                        </div>
                      </div>

                      <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        🛵 En Route (~{order.driverEtaMinutes || 11}m away)
                      </span>
                    </div>
                  )}

                  {/* Total and address footer */}
                  <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span className="truncate">{order.customerAddress} ({order.customerPostalCode})</span>
                    </div>

                    <div className="flex items-baseline gap-2 self-end sm:self-auto">
                      <span className="text-stone-500">Paid ({order.paymentMethod.toUpperCase()}):</span>
                      <span className="text-base font-black text-stone-900 font-display">
                        S${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Past Orders History */}
      {pastOrders.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h2 className="text-base font-extrabold text-stone-900 font-display">
            Past Order History
          </h2>

          <div className="space-y-3">
            {pastOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{order.sellerName}</span>
                      <span className="text-stone-400 font-mono text-[11px]">{order.orderNumber}</span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      {order.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span className="font-extrabold text-stone-900">
                    S${order.total.toFixed(2)}
                  </span>
                  <span className="px-2.5 py-1 bg-stone-100 text-stone-700 font-semibold rounded-lg text-[11px]">
                    Delivered
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
