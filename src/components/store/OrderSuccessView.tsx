import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Lock,
  Package,
  Printer,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { orders, recentOrderId, navigateTo, setRole } = useApp();
  const order = orders.find((o) => o.id === recentOrderId) || orders[0];

  const [readerModalItem, setReaderModalItem] = useState<any | null>(null);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-sm text-[#626260]">No recent orders found.</p>
        <button
          onClick={() => navigateTo('store_home')}
          className="mt-4 px-4 py-2 bg-[#111111] text-white text-xs rounded-md"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Success Header banner */}
        <div className="bg-white rounded-xl border border-[#d3cec6] p-6 sm:p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-[#ff5600] uppercase tracking-wider">
            Payment Verified & Dispatched
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight">
            Order Confirmed — #{order.id}
          </h1>
          <p className="text-xs sm:text-sm text-[#626260] max-w-md mx-auto leading-relaxed">
            Thank you, {order.customerName}. Your Flutterwave payment has been authenticated and inventory has been reserved.
          </p>

          <div className="inline-flex items-center gap-3 pt-2 text-xs font-mono text-[#7b7b78] bg-[#f5f1ec] px-4 py-2 rounded-lg border border-[#d3cec6]">
            <span>Flutterwave Ref: <strong className="text-[#111111]">{order.txRef}</strong></span>
            <span>·</span>
            <span>FLW ID: <strong className="text-[#111111]">{order.flwTransactionId || 'FLW-7749102'}</strong></span>
          </div>
        </div>

        {/* Fulfillment Tracking Bar */}
        <div className="bg-white rounded-xl border border-[#d3cec6] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#ebe7e1] pb-3 text-xs">
            <span className="font-semibold text-[#111111] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#ff5600]" />
              <span>Physical Fulfillment Tracker</span>
            </span>
            <span className="text-[#7b7b78]">Courier: Royal Mail Tracked 24</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto text-[10px] font-bold">✓</div>
              <p className="font-semibold text-[#111111]">Paid</p>
              <p className="text-[10px] text-[#7b7b78]">Flutterwave Validated</p>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto text-[10px] font-bold">2</div>
              <p className="font-semibold text-[#111111]">Packing</p>
              <p className="text-[10px] text-[#7b7b78]">Atelier Warehouse</p>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#ebe7e1] text-[#7b7b78] flex items-center justify-center mx-auto text-[10px] font-bold">3</div>
              <p className="font-medium text-[#7b7b78]">In Transit</p>
              <p className="text-[10px] text-[#9c9fa5]">Pending Dispatch</p>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#ebe7e1] text-[#7b7b78] flex items-center justify-center mx-auto text-[10px] font-bold">4</div>
              <p className="font-medium text-[#7b7b78]">Delivered</p>
              <p className="text-[10px] text-[#9c9fa5]">Est. 2-3 Days</p>
            </div>
          </div>
        </div>

        {/* Itemized Order Details & Digital Downloads */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Purchased Books (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-xl border border-[#d3cec6] p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#111111] pb-2 border-b border-[#ebe7e1]">
              Purchased Titles & Instant Digital Downloads
            </h3>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 bg-[#f5f1ec] rounded-lg border border-[#d3cec6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 rounded overflow-hidden bg-[#ebe7e1] border border-[#d3cec6] shrink-0">
                      <img
                        src={item.bookCover}
                        alt={item.bookTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#ff5600] uppercase font-semibold">
                        {item.format} Edition
                      </span>
                      <h4 className="text-xs font-semibold text-[#111111]">{item.bookTitle}</h4>
                      <p className="text-[11px] text-[#626260]">by {item.bookAuthor} · Qty {item.quantity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setReaderModalItem(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-[#d3cec6] text-xs font-medium text-[#111111] hover:bg-[#ebe7e1] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#ff5600]" />
                      <span>Read Online</span>
                    </button>

                    <button
                      onClick={() => alert(`Downloading verified digital asset: ${item.bookTitle}.pdf`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#111111] text-white text-xs font-medium hover:bg-black transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-[#ff5600]" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#ebe7e1] flex items-center justify-between text-xs text-[#626260]">
              <span>Payment Channel: <strong className="text-[#111111] uppercase">{order.paymentMethod}</strong></span>
              <span>Paid Total: <strong className="text-[#111111] font-mono text-sm">${order.totalAmount.toFixed(2)}</strong></span>
            </div>
          </div>

          {/* Shipping & Delivery Address (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-xl border border-[#d3cec6] p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#111111] pb-2 border-b border-[#ebe7e1]">
              Delivery Destination
            </h3>

            <div className="text-xs text-[#626260] space-y-1">
              <p className="font-semibold text-[#111111]">{order.customerName}</p>
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
              <p>{order.deliveryAddress.country} - {order.deliveryAddress.zipCode}</p>
              <p className="pt-2 text-[11px] text-[#7b7b78]">{order.customerEmail}</p>
            </div>

            <div className="pt-4 border-t border-[#ebe7e1] space-y-2">
              <button
                onClick={() => {
                  setRole('CUSTOMER');
                  navigateTo('customer_portal');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                <span>View My Digital Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => navigateTo('store_home')}
                className="w-full py-2 px-3 rounded-md bg-[#f5f1ec] text-[#111111] text-xs font-medium border border-[#d3cec6] hover:bg-[#ebe7e1] transition-colors"
              >
                Back to Storefront
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Reader Modal Simulation */}
      {readerModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#f5f1ec] rounded-xl border border-[#d3cec6] w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 bg-white border-b border-[#d3cec6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#ff5600]" />
                <h3 className="text-sm font-semibold text-[#111111]">
                  Digital Reading Room: {readerModalItem.bookTitle}
                </h3>
              </div>
              <button
                onClick={() => setReaderModalItem(null)}
                className="p-1 rounded text-[#626260] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 max-w-xl mx-auto space-y-4 font-serif text-sm leading-relaxed text-[#111111]">
              <div className="text-center space-y-1 mb-6">
                <p className="text-[11px] font-sans font-mono text-[#7b7b78]">VERIFIED DIGITAL ACCESS TOKEN</p>
                <h4 className="text-lg font-sans font-bold">{readerModalItem.bookTitle}</h4>
                <p className="text-xs font-sans text-[#626260]">by {readerModalItem.bookAuthor}</p>
              </div>

              <p>
                "We begin in the stillness of raw matter. Long before the crane swings or the mortar dries, the drawing holds the weight of intentions. What is drawn on linen is a promise to the light."
              </p>
              <p>
                "In architecture, as in language, the space between elements defines the meaning. A column does not merely support; it measures silence."
              </p>
            </div>

            <div className="p-4 bg-white border-t border-[#d3cec6] flex items-center justify-between text-xs">
              <span className="text-[#7b7b78]">Page 1 of {readerModalItem.pages || 320}</span>
              <button
                onClick={() => setReaderModalItem(null)}
                className="px-4 py-1.5 rounded bg-[#111111] text-white text-xs font-medium"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
