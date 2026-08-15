import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FlashDropCard } from '../FlashDropCard';
import { OrderStatus } from '../../types';
import {
  ChefHat,
  Flame,
  Package,
  Clock,
  TrendingUp,
  DollarSign,
  Plus,
  CheckCircle2,
  AlertCircle,
  Truck,
  Bike,
  ShieldCheck,
  Star,
  Users,
  Settings,
  ArrowRight,
  Eye,
  LogOut
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const {
    sellers,
    drops,
    orders,
    products,
    updateOrderStatus,
    setIsCreateDropModalOpen,
    activeSellerTab,
    setActiveSellerTab,
    setTrackingOrderId,
    logout,
    setRole,
    setActiveCustomerTab,
  } = useApp();

  const handleSellerLogout = () => {
    logout();
    setRole('customer');
    setActiveCustomerTab('home');
  };

  const seller = sellers[0]; // The Flourist (or primary seller)
  const sellerDrops = drops.filter((d) => d.sellerId === seller.id);
  const sellerOrders = orders.filter((o) => o.sellerId === seller.id);
  const sellerProducts = products.filter((p) => p.sellerId === seller.id);

  // Compute stats
  const totalRevenue = sellerOrders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const pendingOrders = sellerOrders.filter((o) => o.status === 'received' || o.status === 'preparing');
  const activeDropsCount = sellerDrops.filter((d) => d.status === 'live').length;

  return (
    <div className="space-y-8 pb-20">
      
      {/* Baker Dashboard Header */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative">
            <img
              src={seller.avatar}
              alt={seller.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-amber-500/30"
            />
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 p-1 rounded-full text-xs font-bold" title="Verified Baker">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-display text-white">
                {seller.name}
              </h1>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                Home Kitchen Partner
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              📍 {seller.neighborhood} • SFA Reg: <strong className="font-mono text-stone-300">{seller.sfaCertNumber || 'SFA-HBB-2024-8841'}</strong>
            </p>
          </div>
        </div>

        {/* Top Action */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            id="seller-launch-drop-btn"
            onClick={() => setIsCreateDropModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-xl transition flex items-center gap-2 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-stone-950" />
            <span>Launch New Secret Drop</span>
          </button>

          <button
            id="seller-logout-header-btn"
            onClick={handleSellerLogout}
            className="px-4 py-3 rounded-2xl bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            title="Log out of Baker account"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-stone-900 font-display">
            S${(totalRevenue + 480).toFixed(2)}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% from last week
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Drops</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-stone-900 font-display">
            {activeDropsCount} Live
          </p>
          <span className="text-[11px] text-stone-500 font-medium">
            Real-time batch countdown active
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Bakes</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 font-display">
            {pendingOrders.length} Orders
          </p>
          <span className="text-[11px] text-amber-700 font-semibold">
            {pendingOrders.length > 0 ? 'Requires prep for evening dispatch' : 'All caught up!'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Rating & Feedback</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-stone-900 font-display">
            {seller.rating} ★
          </p>
          <span className="text-[11px] text-stone-500 font-medium">
            Based on {seller.reviewCount} customer reviews
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'orders', label: `Live Orders (${sellerOrders.length})`, icon: Package },
          { id: 'drops', label: `Flash Drops (${sellerDrops.length})`, icon: Flame },
          { id: 'products', label: `Menu Catalogue (${sellerProducts.length})`, icon: ChefHat },
          { id: 'analytics', label: 'Batch Analytics', icon: TrendingUp },
          { id: 'profile', label: 'Baker Settings & SFA', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSellerTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSellerTab(tab.id as any)}
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

      {/* 1. Orders Management Tab */}
      {activeSellerTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900 font-display">
              Orders Queue & Fulfillment Pipeline
            </h2>
            <span className="text-xs text-stone-500">
              Click status buttons to update prep and notify drivers
            </span>
          </div>

          {sellerOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 text-xs">
              No orders placed for this bakery yet. Launch a flash drop to start taking pre-orders!
            </div>
          ) : (
            <div className="space-y-4">
              {sellerOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm text-stone-900">
                        {order.customerName}
                      </span>
                      <span className="font-mono text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full capitalize">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600">
                      <strong>Items:</strong> {order.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500">
                      <span>📍 {order.customerAddress} ({order.customerPostalCode})</span>
                      <span>•</span>
                      <span>📞 {order.customerPhone}</span>
                      <span>•</span>
                      <span>🕒 {order.deliveryTimeslot}</span>
                    </div>

                    {order.driverName && (
                      <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Bike className="w-3.5 h-3.5" />
                        <span>Driver Assigned: {order.driverName} ({order.driverVehicle})</span>
                      </p>
                    )}
                  </div>

                  {/* Right: Actions and Status Stepper */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                    <div className="text-right">
                      <p className="text-xs text-stone-400">Total Net</p>
                      <p className="text-base font-black text-stone-900 font-display">
                        S${order.total.toFixed(2)}
                      </p>
                    </div>

                    {/* Action Flow */}
                    <div className="flex flex-wrap items-center gap-2">
                      {order.status === 'received' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs transition"
                        >
                          Mark as Baking 👩‍🍳
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition"
                        >
                          Mark Ready for Courier 📦
                        </button>
                      )}

                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'driver_assigned')}
                          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs transition"
                        >
                          Call / Match Driver 🛵
                        </button>
                      )}

                      {order.status === 'driver_assigned' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                          className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition"
                        >
                          Driver Picked Up 🚀
                        </button>
                      )}

                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition"
                        >
                          Mark Delivered 🎉
                        </button>
                      )}

                      <button
                        onClick={() => setTrackingOrderId(order.id)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                        title="View Live GPS Map"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Flash Drops Manager Tab */}
      {activeSellerTab === 'drops' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900 font-display">
              Active & Scheduled Secret Drops
            </h2>
            <button
              onClick={() => setIsCreateDropModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Flash Drop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sellerDrops.map((drop) => (
              <FlashDropCard key={drop.id} drop={drop} />
            ))}
          </div>
        </div>
      )}

      {/* 3. Product Catalogue Tab */}
      {activeSellerTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900 font-display">
              Bakery Menu & Signature Recipes
            </h2>
            <button
              onClick={() => alert("Product added to catalogue! You can launch a flash drop anytime from it.")}
              className="px-3.5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add New Recipe</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sellerProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs"
              >
                <div className="h-44 relative bg-stone-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white font-black text-xs px-2.5 py-1 rounded-full">
                    S${prod.price.toFixed(2)}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-stone-900">{prod.name}</h4>
                  <p className="text-xs text-stone-500 line-clamp-2">{prod.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <span className="text-stone-400">{prod.unitLabel}</span>
                    <button
                      onClick={() => setIsCreateDropModalOpen(true)}
                      className="text-amber-700 font-bold hover:underline"
                    >
                      Turn into Flash Drop →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Analytics Tab */}
      {activeSellerTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-stone-400 uppercase">Avg Sell-Out Time</span>
              <p className="text-2xl font-black text-amber-600 font-display">14 Minutes</p>
              <p className="text-xs text-stone-500">Top 5% fastest selling home baker</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-stone-400 uppercase">Repeat Customer Rate</span>
              <p className="text-2xl font-black text-emerald-600 font-display">48.2%</p>
              <p className="text-xs text-stone-500">124 regulars in Katong & Tampines</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-stone-400 uppercase">Batch Completion Rate</span>
              <p className="text-2xl font-black text-purple-600 font-display">99.4%</p>
              <p className="text-xs text-stone-500">0 unfulfilled orders</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-stone-900 font-display">
              Top Customer Neighborhoods for Your Bakes
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>1. Tampines / Pasir Ris</span>
                  <span className="text-stone-600">42% of orders</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>2. Katong / Joo Chiat / Bedok</span>
                  <span className="text-stone-600">31% of orders</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '31%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>3. Tiong Bahru / River Valley</span>
                  <span className="text-stone-600">18% of orders</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Baker Settings / SFA Verification Tab */}
      {activeSellerTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 font-display">
                Singapore Food Agency (SFA) Verified Kitchen
              </h3>
              <p className="text-xs text-stone-500">
                Registered Home-Based Business (HBB) Food Safety Guidelines Compliant
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="font-bold text-stone-400 uppercase text-[10px]">HBB Cert Number</span>
              <p className="font-mono font-bold text-sm text-stone-900 mt-1">{seller.sfaCertNumber || 'SFA-HBB-2024-8841'}</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="font-bold text-stone-400 uppercase text-[10px]">Hygiene Rating</span>
              <p className="font-bold text-sm text-emerald-700 mt-1">Grade A (Highest Hygiene Standard)</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="font-bold text-stone-400 uppercase text-[10px]">Self-Collection Location</span>
              <p className="font-semibold text-stone-800 mt-1">{seller.selfCollectionAddress}</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="font-bold text-stone-400 uppercase text-[10px]">Delivery Coverage</span>
              <p className="font-semibold text-stone-800 mt-1">Islandwide Singapore (S${seller.deliveryFee.toFixed(2)})</p>
            </div>
          </div>

          {/* Baker Account & Session Management */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-stone-900">Baker Portal Session</h4>
              <p className="text-xs text-stone-500">
                Logged in as <strong className="text-stone-800">{seller.name}</strong> ({seller.neighborhood} Kitchen).
              </p>
            </div>

            <button
              onClick={handleSellerLogout}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Baker Portal</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
