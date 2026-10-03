import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lock,
  Minus,
  Plus,
  Shield,
  ShoppingBag,
  Trash2,
  Truck,
  Zap,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    clearCart,
    navigateTo,
  } = useApp();

  const shippingFee = cartTotal > 50 || cartTotal === 0 ? 0 : 4.50;
  const estimatedTax = Number((cartTotal * 0.05).toFixed(2));
  const finalGrandTotal = cartTotal + shippingFee + estimatedTax;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-white border border-[#d3cec6] flex items-center justify-center mx-auto text-[#9c9fa5]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-[#111111] tracking-tight">Your shopping bag is empty</h2>
        <p className="text-xs text-[#626260] max-w-sm mx-auto leading-relaxed">
          Explore our collection of contemporary architecture, literature, technology essays, and art monographs.
        </p>
        <button
          onClick={() => navigateTo('store_catalog')}
          className="px-6 py-2.5 rounded-md bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top row */}
      <div className="flex items-center justify-between border-b border-[#d3cec6] pb-4">
        <div>
          <span className="text-xs font-semibold text-[#ff5600] uppercase tracking-wider">Review Order</span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight">
            Shopping Bag ({cartItems.length} {cartItems.length === 1 ? 'title' : 'titles'})
          </h1>
        </div>

        <button
          onClick={() => navigateTo('store_catalog')}
          className="flex items-center gap-1.5 text-xs text-[#626260] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Items list (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-[#d3cec6] overflow-hidden divide-y divide-[#ebe7e1]">
            {cartItems.map((item) => (
              <div key={`${item.book.id}-${item.selectedFormat}`} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-start">
                
                {/* Book Thumbnail */}
                <div
                  onClick={() => navigateTo('store_book_detail', item.book.id)}
                  className="w-20 h-28 sm:w-24 sm:h-32 rounded-md overflow-hidden bg-[#ebe7e1] shrink-0 border border-[#d3cec6] cursor-pointer"
                >
                  <img
                    src={item.book.coverImageUrl}
                    alt={item.book.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between self-stretch">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono text-[#ff5600] uppercase">
                          {item.selectedFormat} Edition
                        </span>
                        <h3
                          onClick={() => navigateTo('store_book_detail', item.book.id)}
                          className="text-base font-semibold text-[#111111] hover:text-[#ff5600] transition-colors cursor-pointer leading-snug"
                        >
                          {item.book.title}
                        </h3>
                        <p className="text-xs text-[#626260]">by {item.book.author}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.book.id, item.selectedFormat)}
                        className="p-1.5 text-[#9c9fa5] hover:text-red-600 transition-colors"
                        title="Remove title"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quantity & Unit Total */}
                  <div className="mt-4 pt-3 border-t border-[#f5f1ec] flex items-center justify-between">
                    <div className="flex items-center border border-[#d3cec6] rounded-md bg-[#f5f1ec]">
                      <button
                        onClick={() => updateCartQuantity(item.book.id, item.selectedFormat, item.quantity - 1)}
                        className="p-1.5 text-[#626260] hover:text-[#111111]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.book.id, item.selectedFormat, item.quantity + 1)}
                        className="p-1.5 text-[#626260] hover:text-[#111111]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-semibold text-[#111111] font-mono tabular-nums">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </span>
                      <p className="text-[10px] text-[#7b7b78] tabular-nums">
                        ${item.book.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#7b7b78] px-2">
            <span>Prices include export taxes. Digital access links generated instantly on payment.</span>
            <button
              onClick={clearCart}
              className="text-[#626260] hover:text-red-600 transition-colors underline"
            >
              Empty shopping bag
            </button>
          </div>
        </div>

        {/* Right: Order Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#d3cec6] p-6 space-y-6">
          <h2 className="text-base font-semibold text-[#111111] pb-3 border-b border-[#ebe7e1]">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-[#626260]">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#111111] font-mono tabular-nums">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#626260]">
              <span className="flex items-center gap-1">
                <span>Courier Delivery</span>
                {shippingFee === 0 && <span className="text-[#ff5600] font-semibold">(Free &gt; $50)</span>}
              </span>
              <span className="font-semibold text-[#111111] font-mono tabular-nums">
                {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#626260]">
              <span>Estimated VAT / Tax (5%)</span>
              <span className="font-semibold text-[#111111] font-mono tabular-nums">
                ${estimatedTax.toFixed(2)}
              </span>
            </div>

            <div className="pt-3 border-t border-[#ebe7e1] flex items-baseline justify-between text-sm">
              <span className="font-semibold text-[#111111]">Grand Total</span>
              <span className="text-xl font-bold text-[#111111] font-mono tabular-nums">
                ${finalGrandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigateTo('store_checkout')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#ff5600] text-white text-xs font-semibold hover:bg-[#e04c00] transition-colors shadow-sm"
            >
              <span>Proceed to Flutterwave Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="bg-[#f5f1ec] p-3 rounded-lg border border-[#d3cec6] text-[11px] text-[#626260] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#111111]">
                <Zap className="w-3.5 h-3.5 text-[#ff5600]" />
                <span>Dynamic Gateway Key Injection</span>
              </div>
              <p className="leading-relaxed">
                Transactions are routed through dynamically decrypted Flutterwave merchant API keys stored securely in the PostgreSQL database.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
