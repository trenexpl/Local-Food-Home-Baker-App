import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  Clock,
  Bike,
  Phone,
  MessageSquare,
  ShieldCheck,
  Package,
  ChefHat,
  ArrowRight,
  Navigation
} from 'lucide-react';
import { OrderStatus } from '../types';

export const LiveTrackingModal: React.FC = () => {
  const {
    trackingOrderId,
    setTrackingOrderId,
    orders,
    updateOrderStatus,
    driverPickupOrder,
    driverCompleteDelivery,
  } = useApp();

  const [simulatedEta, setSimulatedEta] = useState(11);
  const [riderProgress, setRiderProgress] = useState(65); // percentage along route

  const order = orders.find((o) => o.id === trackingOrderId);

  // Animate rider along route if out_for_delivery
  useEffect(() => {
    if (!order || order.status !== 'out_for_delivery') return;

    const interval = setInterval(() => {
      setRiderProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + 2;
      });
      setSimulatedEta((prev) => Math.max(2, prev - 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [order?.status]);

  if (!trackingOrderId || !order) return null;

  const stages: { key: OrderStatus; label: string; icon: string }[] = [
    { key: 'received', label: 'Order Placed', icon: '📝' },
    { key: 'preparing', label: 'Baker In Kitchen', icon: '👩‍🍳' },
    { key: 'ready', label: 'Packed & Fresh', icon: '📦' },
    { key: 'driver_assigned', label: 'Courier Matched', icon: '🛵' },
    { key: 'out_for_delivery', label: 'On The Way', icon: '🚀' },
    { key: 'delivered', label: 'Delivered', icon: '🎉' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === order.status);

  const handleAdvanceSimulation = () => {
    if (order.status === 'received') updateOrderStatus(order.id, 'preparing');
    else if (order.status === 'preparing') updateOrderStatus(order.id, 'ready');
    else if (order.status === 'ready') updateOrderStatus(order.id, 'driver_assigned');
    else if (order.status === 'driver_assigned') driverPickupOrder(order.id);
    else if (order.status === 'out_for_delivery') driverCompleteDelivery(order.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div
        id="live-tracking-modal-container"
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-lg shadow-md">
              🛵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  SGHomeEats Live Dispatch Radar
                </h3>
                <span className="bg-amber-500/20 text-amber-400 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {order.orderNumber}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {order.sellerName} → {order.customerNeighborhood || 'Doorstep Delivery'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAdvanceSimulation}
              disabled={order.status === 'delivered'}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-xs font-bold shadow-sm transition disabled:opacity-40 cursor-pointer"
              title="Fast forward simulation to next order stage"
            >
              <span>Next Stage Step</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <button
              onClick={() => setTrackingOrderId(null)}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[calc(88vh-140px)] overflow-y-auto">
          
          {/* Status Progress Stepper */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between text-xs font-black text-zinc-900 mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Order Status: <span className="uppercase text-emerald-700">{order.status.replace(/_/g, ' ')}</span>
              </span>
              <span className="text-stone-500 font-medium">
                {order.status === 'delivered' ? 'Completed' : `Estimated Arrival: ~${simulatedEta} mins`}
              </span>
            </div>

            {/* Stepper Bar */}
            <div className="grid grid-cols-6 gap-1 sm:gap-2">
              {stages.map((stg, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div key={stg.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isCurrent
                          ? 'bg-zinc-900 text-white ring-4 ring-amber-500/40 scale-110'
                          : isPassed
                          ? 'bg-zinc-800 text-white'
                          : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      {isPassed && !isCurrent ? '✓' : stg.icon}
                    </div>
                    <span
                      className={`text-[9.5px] sm:text-[10.5px] mt-1.5 font-semibold line-clamp-1 ${
                        isCurrent
                          ? 'text-zinc-950 font-black'
                          : isPassed
                          ? 'text-zinc-800'
                          : 'text-stone-400'
                      }`}
                    >
                      {stg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Singapore Map Simulation */}
          <div className="relative h-60 sm:h-72 rounded-3xl bg-slate-950 overflow-hidden border border-stone-800 shadow-inner flex flex-col justify-between p-4">
            
            {/* Stylized Grid Map Background */}
            <div className="absolute inset-0 opacity-25">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* SVG Route Line */}
                <path
                  d="M 60 180 Q 200 60, 420 140 T 700 80"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Singapore landmark tags on simulated map */}
            <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs border border-white/10 flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Singapore SGHomeEats Dispatch Route</span>
            </div>

            {/* Baker Location Marker */}
            <div className="absolute left-10 sm:left-14 bottom-10 z-10 flex flex-col items-center">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-zinc-950 font-bold shadow-lg ring-4 ring-amber-500/30 flex items-center gap-1.5">
                <ChefHat className="w-4 h-4" />
                <span className="text-xs font-extrabold">{order.sellerNeighborhood}</span>
              </div>
              <span className="text-[10px] text-stone-300 mt-1 font-medium bg-black/80 px-2 py-0.5 rounded">
                {order.sellerName}
              </span>
            </div>

            {/* Customer Location Marker */}
            <div className="absolute right-8 sm:right-16 top-12 z-10 flex flex-col items-center">
              <div className="p-2.5 rounded-2xl bg-zinc-800 text-white font-bold shadow-lg ring-4 ring-white/10 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-extrabold">Delivery Destination</span>
              </div>
              <span className="text-[10px] text-stone-300 mt-1 font-medium bg-black/80 px-2 py-0.5 rounded truncate max-w-[140px]">
                {order.customerAddress}
              </span>
            </div>

            {/* Moving Scooter Marker */}
            {order.status === 'out_for_delivery' && (
              <div
                className="absolute z-20 transition-all duration-1000 flex flex-col items-center"
                style={{
                  left: `${riderProgress}%`,
                  top: `${Math.sin((riderProgress / 100) * Math.PI) * 45 + 35}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-10 h-10 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-2xl ring-4 ring-amber-400/50 animate-bounce">
                  <Bike className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold bg-zinc-900 text-white px-2 py-0.5 rounded-full mt-1 border border-amber-400">
                  {order.driverName || 'Courier'} ({simulatedEta}m away)
                </span>
              </div>
            )}

            {/* Map bottom stats overlay */}
            <div className="mt-auto z-10 flex items-center justify-between text-white text-xs bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>
                  Estimated Drop Delivery: <strong>{order.estimatedDeliveryTime}</strong>
                </span>
              </div>

              <span className="text-[11px] text-amber-400 font-bold">
                ● Live GPS Tracking Active
              </span>
            </div>
          </div>

          {/* Matched Driver Card */}
          {order.driverName && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={order.driverPhoto || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'}
                  alt={order.driverName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm text-zinc-900">
                      {order.driverName}
                    </h4>
                    <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-1.5 py-0.5 rounded">
                      ⭐ {order.driverRating || 4.98}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {order.driverVehicle || 'Local Delivery Scooter'}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-bold mt-1">
                    ✓ Verified Delivery Partner
                  </p>
                </div>
              </div>

              {/* Action Contact buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Calling ${order.driverName} (${order.driverPhone})...`)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-zinc-900 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Call Courier</span>
                </button>
                <button
                  onClick={() => alert(`Opening chat with ${order.driverName}: "Hi, please leave outside unit door!"`)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-zinc-900 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          )}

          {/* Timeline Audit Logs */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-3">
              Order Activity & Verification Log
            </h4>
            <div className="space-y-2.5">
              {order.statusTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs"
                >
                  <span className="font-mono text-stone-400 font-bold shrink-0">
                    {item.timestamp}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-zinc-900 capitalize">
                      {item.status.replace(/_/g, ' ')}
                    </p>
                    <p className="text-stone-600 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Item Summary */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-amber-700" />
              <div>
                <p className="font-bold text-zinc-900">
                  {order.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}
                </p>
                <p className="text-[11px] text-stone-600">
                  Paid via {order.paymentMethod.toUpperCase()} • Total: S${order.total.toFixed(2)}
                </p>
              </div>
            </div>

            <span className="font-extrabold text-xs text-amber-800">
              {order.deliveryOption === 'self_collection' ? 'Self Pickup' : 'Doorstep Dispatch'}
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SGHomeEats Guarantee: 100% Fresh & Authentic</span>
          </div>

          <button
            onClick={() => setTrackingOrderId(null)}
            className="px-5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Radar
          </button>
        </div>

      </div>
    </div>
  );
};
