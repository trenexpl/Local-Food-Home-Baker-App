import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Customer Components
import { CustomerHome } from './components/customer/CustomerHome';
import { LocationsView } from './components/customer/LocationsView';
import { DiscoverView } from './components/customer/DiscoverView';
import { SellerDetailView } from './components/customer/SellerDetailView';
import { CustomerOrdersView } from './components/customer/CustomerOrdersView';
import { CustomerProfileView } from './components/customer/CustomerProfileView';

// Seller Components
import { SellerDashboard } from './components/seller/SellerDashboard';
import { CreateDropModal } from './components/seller/CreateDropModal';

// Driver Components
import { DriverDashboard } from './components/driver/DriverDashboard';

// Shared Modals & Drawers
import { DropDetailModal } from './components/DropDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveTrackingModal } from './components/LiveTrackingModal';
import { VipPassModal } from './components/VipPassModal';
import { FilterModal } from './components/FilterModal';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  const {
    role,
    activeCustomerTab,
    viewingSellerId,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Customer View */}
        {role === 'customer' && (
          <>
            {viewingSellerId ? (
              <SellerDetailView />
            ) : (
              <>
                {activeCustomerTab === 'home' && <CustomerHome />}
                {activeCustomerTab === 'locations' && <LocationsView />}
                {activeCustomerTab === 'discover' && <DiscoverView />}
                {activeCustomerTab === 'orders' && <CustomerOrdersView />}
                {activeCustomerTab === 'profile' && <CustomerProfileView />}
              </>
            )}
          </>
        )}

        {/* Home Baker / Seller View */}
        {role === 'seller' && <SellerDashboard />}

        {/* Motorcycle Courier / Driver View */}
        {role === 'driver' && <DriverDashboard />}

      </main>

      {/* Global Modals & Drawers */}
      <DropDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <LiveTrackingModal />
      <VipPassModal />
      <CreateDropModal />
      <FilterModal />
      <AuthModal />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default App;
