/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavbar } from './components/layout/TopNavbar';
import { Footer } from './components/layout/Footer';
import { StorefrontView } from './components/store/StorefrontView';
import { BookDetailPage } from './components/store/BookDetailPage';
import { CartPage } from './components/store/CartPage';
import { CheckoutModal } from './components/store/CheckoutModal';
import { OrderSuccessView } from './components/store/OrderSuccessView';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { PublisherDashboard } from './components/publisher/PublisherDashboard';
import { FinanceDashboard } from './components/finance/FinanceDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NavigationFlowDiagram } from './components/flow/NavigationFlowDiagram';
import { Compass, ShoppingBag, ShieldCheck, DollarSign, BookOpen } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, navigateTo, currentRole, setRole } = useApp();

  const renderActiveScreen = () => {
    switch (activeView) {
      case 'store_home':
      case 'store_catalog':
        return <StorefrontView />;
      case 'store_book_detail':
        return <BookDetailPage />;
      case 'store_cart':
        return <CartPage />;
      case 'store_checkout':
        return <CheckoutModal />;
      case 'store_order_success':
        return <OrderSuccessView />;
      case 'customer_portal':
        return <CustomerPortal />;
      case 'publisher_dashboard':
        return <PublisherDashboard />;
      case 'finance_dashboard':
        return <FinanceDashboard />;
      case 'admin_dashboard':
        return <AdminDashboard />;
      case 'navigation_flow_diagram':
        return <NavigationFlowDiagram />;
      default:
        return <StorefrontView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f1ec] text-[#111111] antialiased selection:bg-[#ff5600] selection:text-white">
      <TopNavbar />

      {/* Screen quick banner if on a dashboard */}
      {activeView !== 'navigation_flow_diagram' && (
        <div className="bg-[#ebe7e1] border-b border-[#d3cec6] text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#626260]">
              <span className="font-semibold text-[#111111]">Active Screen:</span>
              <span className="capitalize">{activeView.replace(/_/g, ' ')}</span>
              <span>·</span>
              <span>Persona: <strong className="text-[#111111]">{currentRole}</strong></span>
            </div>

            <button
              onClick={() => navigateTo('navigation_flow_diagram')}
              className="text-[#ff5600] font-semibold hover:underline flex items-center gap-1 text-[11px]"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Open Navigation Flow Diagram →</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary viewport content */}
      <main className="flex-1">
        {renderActiveScreen()}
      </main>

      <Footer />

      {/* Sticky Bottom Quick Navigation Bar for Mobile */}
      <div className="md:hidden sticky bottom-0 z-30 bg-[#f5f1ec]/95 backdrop-blur-xs border-t border-[#d3cec6] py-2 px-4 flex items-center justify-around text-[10px] font-medium text-[#626260]">
        <button
          onClick={() => navigateTo('store_home')}
          className={`flex flex-col items-center gap-1 ${
            activeView.startsWith('store_') ? 'text-[#ff5600] font-bold' : ''
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Store</span>
        </button>

        <button
          onClick={() => navigateTo('navigation_flow_diagram')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'navigation_flow_diagram' ? 'text-[#ff5600] font-bold' : ''
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Flow Map</span>
        </button>

        <button
          onClick={() => {
            setRole('PUBLISHER');
            navigateTo('publisher_dashboard');
          }}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'publisher_dashboard' ? 'text-[#ff5600] font-bold' : ''
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Publisher</span>
        </button>

        <button
          onClick={() => {
            setRole('FINANCE');
            navigateTo('finance_dashboard');
          }}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'finance_dashboard' ? 'text-[#ff5600] font-bold' : ''
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Finance</span>
        </button>

        <button
          onClick={() => navigateTo('store_cart')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'store_cart' ? 'text-[#ff5600] font-bold' : ''
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Bag</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
