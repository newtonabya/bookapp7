import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookFormat } from '../../types';
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Minus,
  Plus,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from 'lucide-react';

export const BookDetailPage: React.FC = () => {
  const { books, selectedBookId, addToCart, navigateTo, showToast } = useApp();
  const book = books.find((b) => b.id === selectedBookId) || books[0];

  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(book.format || 'Hardcover');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'excerpt' | 'specs' | 'reviews'>('overview');

  // Format pricing delta
  const formatPrices: Record<BookFormat, number> = {
    Hardcover: book.price,
    Paperback: Math.max(12, Number((book.price * 0.75).toFixed(2))),
    'E-book': Math.max(9.99, Number((book.price * 0.55).toFixed(2))),
  };

  const currentPrice = formatPrices[selectedFormat];

  const handleInstantBuy = () => {
    addToCart(book, selectedFormat, quantity);
    navigateTo('store_checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-[#d3cec6] pb-4 text-xs">
        <button
          onClick={() => navigateTo('store_catalog')}
          className="flex items-center gap-1.5 text-[#626260] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2 text-[#7b7b78]">
          <span>Catalog</span>
          <span>/</span>
          <span>{book.genres[0]}</span>
          <span>/</span>
          <span className="text-[#111111] font-medium truncate max-w-[200px]">{book.title}</span>
        </div>
      </div>

      {/* Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Cover Showcase (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-[#d3cec6] p-6 shadow-sm">
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#ebe7e1] relative shadow-md">
              <img
                src={book.coverImageUrl}
                alt={book.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded">
                {selectedFormat} Edition
              </div>
            </div>

            {/* Quick Physical vs Digital Badging */}
            <div className="mt-4 pt-4 border-t border-[#ebe7e1] flex items-center justify-between text-xs text-[#626260]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#ff5600]" />
                <span>Standard Delivery: 2-3 Days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Instant ePub Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Format Switcher & Purchase Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#626260]">
              <span className="font-semibold text-[#111111]">{book.publisherName}</span>
              <span>·</span>
              <span>{book.publicationYear} Edition</span>
              <span>·</span>
              <span>ISBN: {book.isbn}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold text-[#111111] tracking-tight leading-tight">
              {book.title}
            </h1>

            <p className="text-base text-[#626260]">
              by <span className="text-[#111111] font-medium">{book.author}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#111111] font-mono">{book.rating}</span>
              <span className="text-xs text-[#7b7b78]">({book.reviewsCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-xl bg-white border border-[#d3cec6] space-y-5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#7b7b78] uppercase tracking-wider">Unit Price</span>
                <div className="text-3xl font-semibold text-[#111111] font-mono tabular-nums">
                  ${currentPrice.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    book.stockQuantity > 10
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {book.stockQuantity > 0 ? `${book.stockQuantity} Copies in Stock` : 'Backorder Available'}
                </span>
              </div>
            </div>

            {/* Format Selection Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#111111]">Select Edition Format:</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Hardcover', 'Paperback', 'E-book'] as BookFormat[]).map((fmt) => {
                  const isSelected = selectedFormat === fmt;
                  return (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-[#ff5600] bg-[#f5f1ec] text-[#111111]'
                          : 'border-[#d3cec6] bg-white text-[#626260] hover:border-[#111111]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{fmt}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#ff5600]" />}
                      </div>
                      <p className="text-xs font-mono font-semibold text-[#111111] mt-1 tabular-nums">
                        ${formatPrices[fmt].toFixed(2)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Buy Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#d3cec6] rounded-md bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-[#626260] hover:text-[#111111]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-xs font-mono font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-[#626260] hover:text-[#111111]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => addToCart(book, selectedFormat, quantity)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-[#ff5600]" />
                  <span>Add to Bag (${(currentPrice * quantity).toFixed(2)})</span>
                </button>
              </div>

              {/* Instant Buy with Flutterwave */}
              <button
                onClick={handleInstantBuy}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#ff5600] text-white text-xs font-semibold hover:bg-[#e04c00] transition-colors shadow-sm"
              >
                <Zap className="w-4 h-4" />
                <span>Instant Checkout with Flutterwave</span>
              </button>
            </div>

            {/* Security Guarantee */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-[#7b7b78] border-t border-[#ebe7e1]">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#ff5600]" />
                <span>Encrypted Flutterwave v3 Checkout</span>
              </span>
              <span>30-Day Physical Returns</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs: Overview, Excerpt, Specs, Reviews */}
      <div className="bg-white rounded-2xl border border-[#d3cec6] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-6 border-b border-[#ebe7e1] text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-[#ff5600] text-[#111111] font-semibold'
                : 'border-transparent text-[#626260] hover:text-[#111111]'
            }`}
          >
            Curator's Overview
          </button>
          <button
            onClick={() => setActiveTab('excerpt')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'excerpt'
                ? 'border-[#ff5600] text-[#111111] font-semibold'
                : 'border-transparent text-[#626260] hover:text-[#111111]'
            }`}
          >
            Digital Excerpt
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'specs'
                ? 'border-[#ff5600] text-[#111111] font-semibold'
                : 'border-transparent text-[#626260] hover:text-[#111111]'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'reviews'
                ? 'border-[#ff5600] text-[#111111] font-semibold'
                : 'border-transparent text-[#626260] hover:text-[#111111]'
            }`}
          >
            Verified Reviews ({book.reviewsCount})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4 max-w-3xl text-sm text-[#626260] leading-relaxed">
            <p className="text-base text-[#111111] font-medium leading-relaxed">
              {book.description}
            </p>
            <p>
              Printed on archival 140gsm uncoated FSC-certified Swedish paper stock, bound with Swiss exposed spine stitching, and wrapped in debossed bookcloth jacket. Every volume includes digital access tokens to high-resolution vector diagrams and supplementary footnotes.
            </p>
          </div>
        )}

        {activeTab === 'excerpt' && (
          <div className="bg-[#f5f1ec] rounded-xl p-6 border border-[#d3cec6] max-w-3xl space-y-3 font-serif">
            <span className="text-[11px] font-sans font-semibold text-[#ff5600] uppercase tracking-wider">
              Opening Chapter Excerpt
            </span>
            <blockquote className="text-sm text-[#111111] leading-relaxed italic border-l-2 border-[#111111] pl-4">
              "The concrete is not merely structure; it is frozen time, retaining the grain of the wooden boards that cast it and the deliberate shadows that carve its facade under an indifferent sky. To build in monolithic mass is to refuse the transient vanity of the ephemeral."
            </blockquote>
            <p className="text-xs font-sans text-[#7b7b78] pt-2">
              — Chapter 1: The Geometry of Weight, Page 14
            </p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-[#f5f1ec] rounded-lg border border-[#d3cec6]">
              <span className="text-[#7b7b78]">ISBN-13</span>
              <p className="font-semibold text-[#111111] font-mono mt-0.5">{book.isbn}</p>
            </div>
            <div className="p-3.5 bg-[#f5f1ec] rounded-lg border border-[#d3cec6]">
              <span className="text-[#7b7b78]">Length</span>
              <p className="font-semibold text-[#111111] font-mono mt-0.5">{book.pages} pages</p>
            </div>
            <div className="p-3.5 bg-[#f5f1ec] rounded-lg border border-[#d3cec6]">
              <span className="text-[#7b7b78]">Dimensions</span>
              <p className="font-semibold text-[#111111] mt-0.5">210 × 280 mm (Hardcover)</p>
            </div>
            <div className="p-3.5 bg-[#f5f1ec] rounded-lg border border-[#d3cec6]">
              <span className="text-[#7b7b78]">Binding</span>
              <p className="font-semibold text-[#111111] mt-0.5">Swiss Smyth-Sewn Cloth</p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 max-w-3xl">
            <div className="p-4 bg-[#f5f1ec] rounded-xl border border-[#d3cec6] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#111111]">Architectural Review Quarterly</span>
                <span className="text-[#7b7b78]">March 2026</span>
              </div>
              <p className="text-xs text-[#626260] leading-relaxed italic">
                "A rare masterpiece of architectural scholarship. The photographs breathe with tactical presence and the typography is impeccable."
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
