import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setRole } = useApp();

  return (
    <footer className="bg-[#ebe7e1] border-t border-[#d3cec6] text-[#626260] pt-12 pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-[#d3cec6]">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-[#111111]">
              <div className="w-6 h-6 rounded bg-[#111111] flex items-center justify-center text-white">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold tracking-tight text-base">Folio & Spine</span>
            </div>
            <p className="text-xs text-[#7b7b78] leading-relaxed max-w-sm">
              An editorial independent bookstore and publisher self-management platform with dynamic Flutterwave secret key injection and strict multi-role RBAC security.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#7b7b78] pt-2">
              <Lock className="w-3.5 h-3.5 text-[#ff5600]" />
              <span>AES-256-GCM Encrypted Settings at Rest in PostgreSQL</span>
            </div>
          </div>

          {/* Col 1: Storefront */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-[#111111] tracking-wider uppercase">Catalog</p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => navigateTo('store_home')} className="hover:text-[#111111] transition-colors">
                  Featured Titles
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('store_catalog')} className="hover:text-[#111111] transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('store_catalog')} className="hover:text-[#111111] transition-colors">
                  Architecture & Design
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('store_catalog')} className="hover:text-[#111111] transition-colors">
                  Technology & Society
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Portals */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-[#111111] tracking-wider uppercase">Role Portals</p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setRole('PUBLISHER');
                    navigateTo('publisher_dashboard');
                  }}
                  className="hover:text-[#111111] transition-colors"
                >
                  Publisher Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('FINANCE');
                    navigateTo('finance_dashboard');
                  }}
                  className="hover:text-[#111111] transition-colors"
                >
                  Finance Register
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('SYSTEM_ADMIN');
                    navigateTo('admin_dashboard');
                  }}
                  className="hover:text-[#111111] transition-colors"
                >
                  System Admin (Newton Abya)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('CUSTOMER');
                    navigateTo('customer_portal');
                  }}
                  className="hover:text-[#111111] transition-colors"
                >
                  Customer Library
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Security */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-[#111111] tracking-wider uppercase">Platform Architecture</p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => navigateTo('navigation_flow_diagram')} className="text-[#ff5600] font-medium hover:underline">
                  Interactive Flow Map
                </button>
              </li>
              <li>
                <span className="text-[#7b7b78]">Flutterwave v3 API Integration</span>
              </li>
              <li>
                <span className="text-[#7b7b78]">Role Verification Middleware</span>
              </li>
              <li>
                <span className="text-[#7b7b78]">Webhook Signature Verification</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7b7b78] gap-3">
          <p>© 2026 Folio & Spine Ltd. Designed with Intercom Editorial Guidelines.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#111111] cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-[#111111] cursor-pointer">Publisher Terms</span>
            <span>·</span>
            <span className="hover:text-[#111111] cursor-pointer">Security Whitepaper</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
