import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bike,
  Navigation,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Camera,
  AlertCircle,
  LogOut,
  User
} from 'lucide-react';

export const DriverDashboard: React.FC = () => {
  const {
    orders,
    driverAcceptOrder,
    driverPickupOrder,
    driverCompleteDelivery,
    setTrackingOrderId,
    activeDriverTab,
    setActiveDriverTab,
    logout,
    setRole,
    setActiveCustomerTab,
  } = useApp();

  const [isOnline, setIsOnline] = useState(true);
  const [driverEarnings, setDriverEarnings] = useState(86.50);

  const handleDriverLogout = () => {
    logout();
    setRole('customer');
    setActiveCustomerTab('home');
  };

  // Filter orders by driver status
  const availableDeliveries = orders.filter((o) => o.status === 'ready' || (o.status === 'preparing' && !o.driverName));
  const myActiveDeliveries = orders.filter(
    (o) => (o.status === 'driver_assigned' || o.status === 'out_for_delivery') && o.deliveryOption === 'delivery'
  );
  const completedDeliveries = orders.filter((o) => o.status === 'delivered');

  return (
    <div className="space-y-8 pb-20">
      
      {/* Driver Status Card */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
              alt="Ah Meng Driver"
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-emerald-500/40 shadow-lg"
            />
            <span className={`absolute -bottom-1 -right-1 p-1.5 rounded-full ring-4 ring-stone-900 ${isOnline ? 'bg-emerald-500' : 'bg-stone-500'}`}></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-display text-white">
                Ah Meng (Motorcycle Courier)
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ⭐ 4.98 (340+ Drops)
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Vehicle: <strong className="text-stone-200">Yamaha Aerox 155 (FBK 8912 P)</strong> • Active Zone: <strong className="text-amber-400">East & Central SG</strong>
            </p>
          </div>
        </div>

        {/* Online Toggle & Actions */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-5 py-3 rounded-2xl font-black text-xs transition shadow-lg flex items-center gap-2 cursor-pointer ${
              isOnline
                ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-stone-950 animate-ping' : 'bg-stone-500'}`}></span>
            <span>{isOnline ? '🟢 Online (Receiving Drop Runs)' : '⚪ Offline (Paused)'}</span>
          </button>

          <button
            id="driver-logout-header-btn"
            onClick={handleDriverLogout}
            className="px-4 py-3 rounded-2xl bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            title="Log out of Courier account"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase">Today's Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-stone-900 font-display">
            S${(driverEarnings + myActiveDeliveries.length * 8.50).toFixed(2)}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> PayNow Instant Payout Ready
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase">Active Runs</span>
            <Bike className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 font-display">
            {myActiveDeliveries.length}
          </p>
          <span className="text-[11px] text-stone-500 font-medium">In delivery transit</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase">Drop Requests Near You</span>
            <Navigation className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-600 font-display">
            {availableDeliveries.length}
          </p>
          <span className="text-[11px] text-purple-700 font-semibold">Available for acceptance</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase">Trips Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-stone-900 font-display">
            {completedDeliveries.length + 8}
          </p>
          <span className="text-[11px] text-stone-500 font-medium">100% on-time delivery</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'active', label: `Active Runs (${myActiveDeliveries.length})`, icon: Bike },
          { id: 'available', label: `Available Drop Runs (${availableDeliveries.length})`, icon: Navigation },
          { id: 'history', label: `Payouts & Completed (${completedDeliveries.length + 8})`, icon: DollarSign },
          { id: 'profile', label: 'Courier Profile & Account', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDriverTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDriverTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-xs font-black'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Active Deliveries Tab */}
      {activeDriverTab === 'active' && (
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-stone-900 font-display">
            Current Assigned Runs & Live GPS Dispatch
          </h2>

          {myActiveDeliveries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
              <Bike className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-sm text-stone-800">No active deliveries right now</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Check the "Available Drop Runs" tab to claim nearby home baker dispatches.
              </p>
              <button
                onClick={() => setActiveDriverTab('available')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
              >
                View Available Drop Runs
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {myActiveDeliveries.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden"
                >
                  <div className="p-4 sm:p-5 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                        🛵
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm sm:text-base font-display">
                            {order.sellerName} → {order.customerName}
                          </span>
                          <span className="font-mono text-xs bg-stone-800 text-amber-300 px-2 py-0.5 rounded border border-stone-700">
                            {order.orderNumber}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Delivery Slot: {order.deliveryTimeslot}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-extrabold text-sm bg-black/40 px-3 py-1 rounded-xl border border-emerald-500/30">
                        Earn +S$8.50
                      </span>
                      <button
                        onClick={() => setTrackingOrderId(order.id)}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition"
                      >
                        Live Radar
                      </button>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Route Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Step A: Pickup */}
                      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-900 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-amber-600" />
                            1. Pickup From Baker
                          </span>
                          <span className="text-[11px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded">
                            {order.sellerNeighborhood}
                          </span>
                        </div>
                        <p className="font-bold text-xs text-stone-900">{order.sellerName}</p>
                        <p className="text-xs text-stone-600">
                          {order.sellerSelfCollectionAddress || 'Katong Studio Kitchen, 142 East Coast Road #02-04'}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Items: {order.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}
                        </p>
                      </div>

                      {/* Step B: Drop-off */}
                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            2. Drop-off Destination
                          </span>
                          <span className="text-[11px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded">
                            {order.customerNeighborhood || 'Tampines'}
                          </span>
                        </div>
                        <p className="font-bold text-xs text-stone-900">{order.customerName} ({order.customerPhone})</p>
                        <p className="text-xs text-stone-600">{order.customerAddress} (SG {order.customerPostalCode})</p>
                        {order.specialInstructions && (
                          <p className="text-[11px] text-amber-800 font-semibold bg-amber-100/60 p-1.5 rounded">
                            Note: "{order.specialInstructions}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rider Action Workflow */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert(`Calling customer: ${order.customerPhone}`)}
                          className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Call Recipient</span>
                        </button>
                        <button
                          onClick={() => alert("Simulating Google Maps turn-by-turn navigation...")}
                          className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <Navigation className="w-3.5 h-3.5 text-blue-600" />
                          <span>Start GPS Navigation</span>
                        </button>
                      </div>

                      {order.status === 'driver_assigned' ? (
                        <button
                          onClick={() => driverPickupOrder(order.id)}
                          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
                        >
                          <span>Confirm Pickup at Baker & Start Delivery</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            driverCompleteDelivery(order.id);
                            setDriverEarnings((prev) => prev + 8.50);
                          }}
                          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Complete & Snap Proof of Delivery (+S$8.50)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Available Runs Tab */}
      {activeDriverTab === 'available' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900 font-display">
              Open Home-Baker Dispatch Runs
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              Filtered for Singapore East & Central
            </span>
          </div>

          {availableDeliveries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 text-xs">
              No new dispatch runs waiting. All current baker drops are assigned!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDeliveries.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-stone-900 font-display">
                        {order.sellerName}
                      </span>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl">
                        +S$8.50 Payout
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-stone-600">
                        <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Pickup: {order.sellerNeighborhood}</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-600">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Drop: {order.customerAddress} ({order.customerPostalCode})</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-500">
                        <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>Slot: {order.deliveryTimeslot}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => driverAcceptOrder(order.id)}
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Bike className="w-4 h-4" />
                    <span>Accept Run (Earn S$8.50)</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Payouts & History Tab */}
      {activeDriverTab === 'history' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-extrabold text-base text-stone-900 font-display">
                Courier Payouts & PayNow Escrow
              </h3>
              <p className="text-xs text-stone-500">
                Instant disbursement to Singapore NRIC/UEN PayNow account
              </p>
            </div>
            <button
              onClick={() => alert(`Transferred S$${(driverEarnings + 24).toFixed(2)} instantly to Ah Meng PayNow account (S****182B)!`)}
              className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition"
            >
              Cash Out via PayNow
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <div>
                <p className="font-bold text-stone-900">4x Katong to Tampines Batch Run</p>
                <p className="text-stone-500 text-[11px]">Today, 12:45 PM • Completed</p>
              </div>
              <span className="font-black text-sm text-emerald-600">+S$34.00</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <div>
                <p className="font-bold text-stone-900">2x Tiong Bahru Canelé Express Run</p>
                <p className="text-stone-500 text-[11px]">Today, 10:15 AM • Completed</p>
              </div>
              <span className="font-black text-sm text-emerald-600">+S$17.00</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <div>
                <p className="font-bold text-stone-900">VIP Fast Drop Peak Incentive Bonus</p>
                <p className="text-stone-500 text-[11px]">Today, 9:00 AM • Platform Bonus</p>
              </div>
              <span className="font-black text-sm text-amber-600">+S$10.00</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Courier Profile & Account Tab */}
      {activeDriverTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 font-display">
                Courier Dispatch Profile & SFA Food Delivery Handler Verification
              </h3>
              <p className="text-xs text-stone-500">
                Verified thermal bag delivery rider for SGHomeEats artisanal batches
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="font-bold text-stone-400 uppercase text-[10px]">Registered Rider</span>
              <p className="font-bold text-sm text-stone-900 mt-1">Ah Meng (S****182B)</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="font-bold text-stone-400 uppercase text-[10px]">Vehicle & Registration</span>
              <p className="font-bold text-sm text-stone-900 mt-1">Yamaha Aerox 155 (FBK 8912 P)</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="font-bold text-stone-400 uppercase text-[10px]">SFA Food Hygiene Handler</span>
              <p className="font-bold text-sm text-emerald-700 mt-1">Certified (WSQ Food Safety Level 1)</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="font-bold text-stone-400 uppercase text-[10px]">Instant Payout Method</span>
              <p className="font-bold text-sm text-purple-800 mt-1">PayNow NRIC Linked (Instant Payout)</p>
            </div>
          </div>

          {/* Courier Account & Session Management */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-stone-900">Courier Dispatch Session</h4>
              <p className="text-xs text-stone-500">
                Currently signed in as courier <strong className="text-stone-800">Ah Meng</strong>.
              </p>
            </div>

            <button
              onClick={handleDriverLogout}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Courier Dispatch</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
