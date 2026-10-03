import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Package,
  ShoppingBag,
  Truck,
  User,
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const { orders, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'library' | 'orders' | 'profile'>('library');

  // Collect all digital books purchased across orders
  const digitalLibraryItems = orders
    .filter((o) => o.status === 'PAID')
    .flatMap((o) => o.items);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-[#d3cec6] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-lg font-mono">
            NA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-[#111111]">Newton Abya</h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                ACTIVE READER
              </span>
            </div>
            <p className="text-xs text-[#626260]">newtonabya@gmail.com · Member since Jan 2026</p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('store_catalog')}
          className="px-4 py-2 rounded-md bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors shrink-0"
        >
          Explore Catalog
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#d3cec6] text-xs font-medium">
        <button
          onClick={() => setActiveTab('library')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'library'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Digital Library ({digitalLibraryItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>
      </div>

      {/* Library View */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#7b7b78]">
            <p>Your purchased titles have persistent lifetime access in PDF and ePub formats.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {digitalLibraryItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="bg-white rounded-xl border border-[#d3cec6] p-5 flex flex-col justify-between space-y-4"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-24 rounded overflow-hidden bg-[#ebe7e1] border border-[#d3cec6] shrink-0">
                    <img
                      src={item.bookCover}
                      alt={item.bookTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#ff5600] font-semibold uppercase">
                      {item.format}
                    </span>
                    <h3 className="text-sm font-semibold text-[#111111] leading-snug line-clamp-2">
                      {item.bookTitle}
                    </h3>
                    <p className="text-xs text-[#626260]">{item.bookAuthor}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ebe7e1] flex items-center justify-between gap-2">
                  <button
                    onClick={() => alert(`Opening reading session for "${item.bookTitle}"`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#f5f1ec] text-xs font-medium text-[#111111] border border-[#d3cec6] hover:bg-[#ebe7e1]"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#ff5600]" />
                    <span>Read</span>
                  </button>

                  <button
                    onClick={() => alert(`Downloading verified PDF for "${item.bookTitle}"`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#111111] text-white text-xs font-medium hover:bg-black"
                  >
                    <Download className="w-3.5 h-3.5 text-[#ff5600]" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders View */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#d3cec6] overflow-hidden divide-y divide-[#ebe7e1]">
            {orders.map((o) => (
              <div key={o.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-sm text-[#111111]">Order #{o.id}</span>
                    <p className="text-[11px] text-[#7b7b78] mt-0.5">
                      Placed on {new Date(o.createdAt).toLocaleDateString()} · Flutterwave Ref: {o.txRef}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                        o.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {o.status}
                    </span>
                    <span className="font-mono font-semibold text-sm text-[#111111] tabular-nums">
                      ${o.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#f5f1ec] p-3 rounded-lg border border-[#d3cec6]">
                  <div>
                    <span className="font-semibold text-[#111111]">Delivery Address:</span>
                    <p className="text-[#626260]">
                      {o.deliveryAddress.street}, {o.deliveryAddress.city}, {o.deliveryAddress.country}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-[#111111]">Purchased Items:</span>
                    <p className="text-[#626260]">
                      {o.items.map((i) => `${i.bookTitle} (x${i.quantity})`).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
