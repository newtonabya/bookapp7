import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Book, BookFormat } from '../../types';
import { HERO_BANNER_IMG } from '../../data/mockData';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
} from 'lucide-react';

export const StorefrontView: React.FC = () => {
  const { books, navigateTo, addToCart } = useApp();
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'newest'>('featured');
  const [carouselIndex, setCarouselIndex] = useState(0);

  const featuredBooks = books.filter((b) => b.isFeatured && b.status === 'PUBLISHED');

  const genresList = [
    'All',
    'Architecture & Design',
    'Literary Fiction',
    'Technology & Society',
    'Economics & Philosophy',
    'Art & Photography',
  ];

  const filteredBooks = books
    .filter((b) => b.status === 'PUBLISHED')
    .filter((b) => {
      const matchGenre = selectedGenre === 'All' || b.genres.includes(selectedGenre);
      const matchFormat = selectedFormat === 'All' || b.format === selectedFormat;
      const matchSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.isbn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGenre && matchFormat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Landing Page Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-2xl overflow-hidden bg-[#111111] text-white border border-[#d3cec6] shadow-sm">
          {/* Background Hero Image with measured editorial gradient scrim */}
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src={HERO_BANNER_IMG}
              alt="Editorial Bookstore Reading Room"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-1" />

          {/* Hero Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#ff5600] tracking-wider uppercase">
              <span>Curated Literature & Independent Publishing</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.08] text-white">
              Books that challenge, endure, and inspire.
            </h1>

            <p className="text-sm sm:text-base text-[#ebe7e1] leading-relaxed max-w-lg">
              Discover authoritative monographs, poetic fiction, and independent voices. Physical hardcovers and immediate digital downloads, powered by seamless global payments.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  const element = document.getElementById('catalog-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-md bg-[#ff5600] text-white text-sm font-semibold hover:bg-[#e04c00] transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Browse Curated Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('navigation_flow_diagram')}
                className="px-5 py-3 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/20 transition-colors"
              >
                View Architecture Flow
              </button>
            </div>

            {/* Quick Proof Metrics adjacent to hero */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#9c9fa5] border-t border-white/10">
              <div>
                <span className="font-semibold text-white font-mono text-sm tabular-nums">48-Hr</span>
                <p className="text-[11px] text-[#ebe7e1]">Global Courier Dispatch</p>
              </div>
              <span className="text-white/20">|</span>
              <div>
                <span className="font-semibold text-white font-mono text-sm tabular-nums">Instant</span>
                <p className="text-[11px] text-[#ebe7e1]">PDF & ePub Delivery</p>
              </div>
              <span className="text-white/20">|</span>
              <div>
                <span className="font-semibold text-white font-mono text-sm tabular-nums">70%</span>
                <p className="text-[11px] text-[#ebe7e1]">Direct Author Royalties</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Books Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-[#d3cec6] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#626260] uppercase tracking-wider">Editor's Selection</span>
            <h2 className="text-2xl font-semibold text-[#111111] tracking-tight">Featured Titles</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCarouselIndex((prev) => Math.max(0, prev - 1))}
              disabled={carouselIndex === 0}
              className="p-2 rounded-md bg-white border border-[#d3cec6] text-[#111111] disabled:opacity-40 hover:bg-[#ebe7e1] transition-colors"
              aria-label="Previous featured books"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCarouselIndex((prev) => Math.min(featuredBooks.length - 1, prev + 1))}
              disabled={carouselIndex >= featuredBooks.length - 1}
              className="p-2 rounded-md bg-white border border-[#d3cec6] text-[#111111] disabled:opacity-40 hover:bg-[#ebe7e1] transition-colors"
              aria-label="Next featured books"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => navigateTo('store_book_detail', book.id)}
              className="group cursor-pointer bg-white rounded-xl border border-[#d3cec6] overflow-hidden p-5 flex flex-col justify-between hover:border-[#111111] transition-all"
            >
              <div className="space-y-4">
                {/* Book Cover frame */}
                <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#ebe7e1] relative">
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {book.format}
                  </div>
                </div>

                {/* Metadata */}
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#626260] mb-1">
                    <span>{book.genres[0]}</span>
                    <span>·</span>
                    <span>{book.publisherName}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#111111] group-hover:text-[#ff5600] transition-colors leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-xs text-[#7b7b78] mt-0.5">by {book.author}</p>
                </div>
              </div>

              {/* Price & Add Action */}
              <div className="mt-5 pt-3 border-t border-[#ebe7e1] flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold text-[#111111] font-mono tabular-nums">
                    ${book.price.toFixed(2)}
                  </span>
                  <p className="text-[10px] text-[#7b7b78]">In Stock ({book.stockQuantity})</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(book, book.format, 1);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111111] text-white text-xs font-medium hover:bg-black transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#ff5600]" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Catalog Section with Multi-Faceted Filters */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#d3cec6] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#626260] uppercase tracking-wider">Complete Collection</span>
            <h2 className="text-2xl font-semibold text-[#111111] tracking-tight">New Arrivals & Catalog</h2>
          </div>

          {/* Search bar & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#7b7b78] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, ISBN..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#d3cec6] rounded-md text-[#111111] placeholder-[#7b7b78] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-white border border-[#d3cec6] rounded-md px-3 py-1.5 text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Recently Published</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Faceted Filter Bar: Genres & Formats */}
        <div className="space-y-3 bg-white p-4 rounded-xl border border-[#d3cec6]">
          {/* Genre Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-[#111111] shrink-0 mr-1">Genre:</span>
            {genresList.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedGenre === genre
                    ? 'bg-[#111111] text-white'
                    : 'bg-[#f5f1ec] text-[#626260] hover:text-[#111111] hover:bg-[#ebe7e1]'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Format Row */}
          <div className="flex items-center gap-2 border-t border-[#ebe7e1] pt-3 overflow-x-auto">
            <span className="text-xs font-semibold text-[#111111] shrink-0 mr-1">Format:</span>
            {(['All', 'Hardcover', 'Paperback', 'E-book'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedFormat === fmt
                    ? 'bg-[#111111] text-white'
                    : 'bg-[#f5f1ec] text-[#626260] hover:text-[#111111] hover:bg-[#ebe7e1]'
                }`}
              >
                {fmt}
              </button>
            ))}
            <span className="text-xs text-[#7b7b78] ml-auto font-mono">
              Showing {filteredBooks.length} titles
            </span>
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#d3cec6] p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-[#9c9fa5] mx-auto" />
            <h3 className="text-base font-semibold text-[#111111]">No titles match your criteria</h3>
            <p className="text-xs text-[#626260] max-w-sm mx-auto">
              Try adjusting your genre filters or search keywords to find available editions.
            </p>
            <button
              onClick={() => {
                setSelectedGenre('All');
                setSelectedFormat('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-md bg-[#111111] text-white text-xs font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => navigateTo('store_book_detail', book.id)}
                className="group cursor-pointer bg-white rounded-xl border border-[#d3cec6] p-4 flex flex-col justify-between hover:border-[#111111] transition-all"
              >
                <div className="space-y-3">
                  <div className="aspect-[3/4] w-full rounded-md overflow-hidden bg-[#ebe7e1] relative">
                    <img
                      src={book.coverImageUrl}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/75 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                      {book.format}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#7b7b78]">
                      <span>{book.genres[0]}</span>
                      <span>·</span>
                      <span>{book.publicationYear}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#111111] group-hover:text-[#ff5600] transition-colors leading-snug line-clamp-1 mt-0.5">
                      {book.title}
                    </h4>
                    <p className="text-xs text-[#626260] line-clamp-1">by {book.author}</p>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#ebe7e1] flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#111111] font-mono tabular-nums">
                    ${book.price.toFixed(2)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(book, book.format, 1);
                    }}
                    className="p-1.5 rounded-md bg-[#111111] text-white hover:bg-black transition-colors"
                    title="Add to Cart"
                    aria-label={`Add ${book.title} to Cart`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#ff5600]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Publisher Invitation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#ebe7e1] rounded-2xl border border-[#d3cec6] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-semibold text-[#ff5600] uppercase tracking-wider">Independent Press Portal</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight">
              Publish with Folio & Spine
            </h2>
            <p className="text-sm text-[#626260] leading-relaxed">
              Retain 70% direct royalties, manage physical print runs, upload instant digital ePub/PDF assets, and track real-time sales through your dedicated publisher dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => {
                navigateTo('publisher_dashboard');
              }}
              className="px-6 py-3 rounded-md bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors shadow-sm"
            >
              Enter Publisher Hub
            </button>
            <button
              onClick={() => navigateTo('navigation_flow_diagram')}
              className="px-5 py-3 rounded-md bg-white border border-[#d3cec6] text-[#111111] text-xs font-medium hover:bg-[#f5f1ec] transition-colors"
            >
              Inspect Workflow Diagram
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
