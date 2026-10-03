import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  BookOpen,
  ShoppingBag,
  Sliders,
  DollarSign,
  ShieldCheck,
  Compass,
  Menu,
  X,
  User,
  CheckCircle2,
} from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const {
    currentRole,
    setRole,
    activeView,
    navigateTo,
    cartCount,
    toast,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const rolesList: { id: UserRole; label: string; desc: string }[] = [
    { id: 'CUSTOMER', label: 'Customer / Guest', desc: 'Browse catalog, cart, and Flutterwave checkout' },
    { id: 'PUBLISHER', label: 'Publisher', desc: 'Manage catalog, submit books, sales analytics, payouts' },
    { id: 'FINANCE', label: 'Finance Officer', desc: 'Live transactions, payout approvals, GMV revenue' },
    { id: 'SYSTEM_ADMIN', label: 'System Admin', desc: 'Dynamic API keys, book approvals, users, audit logs' },
  ];

  return (
    <>
      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed top-3 right-4 z-50 transition-all duration-300 transform translate-y-0">
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium shadow-sm ${
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-900'
                : toast.type === 'info'
                ? 'bg-[#ebe7e1] border-[#d3cec6] text-[#111111]'
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#ff5600] shrink-0" />
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Main Top Bar adhering strictly to 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-[#f5f1ec]/95 backdrop-blur-sm border-b border-[#d3cec6] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => navigateTo('store_home')}
              className="text-left group flex items-center gap-2.5 focus-visible:outline-none"
            >
              <div className="w-8 h-8 rounded-md bg-[#111111] flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4 text-[#f5f1ec]" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-[#111111] font-sans">
                Folio & Spine
              </span>
            </button>
            <span className="hidden sm:inline-block text-xs font-mono text-[#626260] border-l border-[#d3cec6] pl-3">
              v1.0-editorial
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#111111]">
            <button
              onClick={() => navigateTo('store_home')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeView.startsWith('store_')
                  ? 'bg-white text-[#111111] shadow-xs border border-[#d3cec6]'
                  : 'text-[#626260] hover:text-[#111111]'
              }`}
            >
              Storefront
            </button>

            <button
              onClick={() => navigateTo('navigation_flow_diagram')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'navigation_flow_diagram'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#ff5600] hover:bg-[#ebe7e1]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>User Flow Diagram</span>
            </button>

            <button
              onClick={() => navigateTo('publisher_dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'publisher_dashboard'
                  ? 'bg-white text-[#111111] shadow-xs border border-[#d3cec6]'
                  : 'text-[#626260] hover:text-[#111111]'
              }`}
            >
              Publisher
            </button>

            <button
              onClick={() => navigateTo('finance_dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'finance_dashboard'
                  ? 'bg-white text-[#111111] shadow-xs border border-[#d3cec6]'
                  : 'text-[#626260] hover:text-[#111111]'
              }`}
            >
              Finance
            </button>

            <button
              onClick={() => navigateTo('admin_dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'admin_dashboard'
                  ? 'bg-white text-[#111111] shadow-xs border border-[#d3cec6]'
                  : 'text-[#626260] hover:text-[#111111]'
              }`}
            >
              System Admin
            </button>
          </nav>

          {/* Zone 3: Actions (Role Switcher & Cart) */}
          <div className="flex items-center gap-3">
            {/* Quick RBAC Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-[#d3cec6] text-[#111111] hover:bg-[#ebe7e1] transition-colors"
                title="Switch Role-Based Access Control persona"
              >
                <span className="w-2 h-2 rounded-full bg-[#ff5600]" />
                <span className="hidden lg:inline text-[#626260]">Role:</span>
                <span className="font-semibold">{currentRole.replace('_', ' ')}</span>
              </button>

              {roleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setRoleDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg border border-[#d3cec6] shadow-lg p-2 z-50">
                    <div className="px-3 py-1.5 border-b border-[#ebe7e1] mb-1">
                      <p className="text-xs font-semibold text-[#111111]">Switch Active Persona (RBAC)</p>
                      <p className="text-[11px] text-[#7b7b78]">Test roles & permissions defined in PRD</p>
                    </div>
                    {rolesList.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setRole(r.id);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-md text-xs transition-colors flex flex-col ${
                          currentRole === r.id
                            ? 'bg-[#f5f1ec] text-[#111111] font-semibold'
                            : 'text-[#626260] hover:bg-[#ebe7e1] hover:text-[#111111]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{r.label}</span>
                          {currentRole === r.id && (
                            <span className="text-[10px] text-[#ff5600] font-mono">ACTIVE</span>
                          )}
                        </div>
                        <span className="text-[11px] font-normal text-[#7b7b78] mt-0.5">{r.desc}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={() => navigateTo('store_cart')}
              className="relative p-2 rounded-md text-[#111111] hover:bg-[#ebe7e1] transition-colors focus-visible:outline-none"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff5600] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Customer Account Button */}
            <button
              onClick={() => navigateTo('customer_portal')}
              className="hidden sm:flex p-2 rounded-md text-[#111111] hover:bg-[#ebe7e1] transition-colors"
              title="Customer Library & Orders"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-[#111111] hover:bg-[#ebe7e1]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#d3cec6] bg-[#f5f1ec] px-4 pt-3 pb-6 space-y-2">
            <button
              onClick={() => {
                navigateTo('store_home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-[#111111] hover:bg-white"
            >
              Storefront Home
            </button>
            <button
              onClick={() => {
                navigateTo('navigation_flow_diagram');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm font-medium text-[#ff5600] hover:bg-white"
            >
              <Compass className="w-4 h-4" />
              User Flow Diagram
            </button>
            <button
              onClick={() => {
                navigateTo('publisher_dashboard');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-[#111111] hover:bg-white"
            >
              Publisher Portal
            </button>
            <button
              onClick={() => {
                navigateTo('finance_dashboard');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-[#111111] hover:bg-white"
            >
              Finance Dashboard
            </button>
            <button
              onClick={() => {
                navigateTo('admin_dashboard');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-[#111111] hover:bg-white"
            >
              System Admin Dashboard
            </button>
            <button
              onClick={() => {
                navigateTo('customer_portal');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-[#111111] hover:bg-white"
            >
              My Library & Orders
            </button>
          </div>
        )}
      </header>
    </>
  );
};
