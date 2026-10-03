import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Book, BookFormat } from '../../types';
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  DollarSign,
  Download,
  FileText,
  Filter,
  Layers,
  Lock,
  Plus,
  TrendingUp,
  Upload,
  Wallet,
  X,
} from 'lucide-react';

export const PublisherDashboard: React.FC = () => {
  const {
    books,
    submitBook,
    payouts,
    requestPayout,
    orders,
    showToast,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'submit' | 'analytics' | 'payouts'>('catalog');
  
  // Submit Book form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('978-0-8021-');
  const [newPrice, setNewPrice] = useState('32.00');
  const [newStock, setNewStock] = useState('50');
  const [newFormat, setNewFormat] = useState<BookFormat>('Hardcover');
  const [newGenre, setNewGenre] = useState('Architecture & Design');
  const [newDescription, setNewDescription] = useState('');
  const [newPages, setNewPages] = useState('288');
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('/src/assets/images/book_cover_arch_1791053806661.jpg');

  // Payout request modal / form
  const [payoutAmount, setPayoutAmount] = useState('1200.00');
  const [bankName, setBankName] = useState('Barclays Bank UK');
  const [accountNumber, setAccountNumber] = useState('4419 8820 1192');
  const [accountName, setAccountName] = useState('Atelier Press Ltd');

  // Filter publisher's books
  const publisherBooks = books.filter((b) => b.publisherId === 'user-pub-1' || b.publisherName.includes('Atelier'));

  // Publisher metrics
  const totalUnitsSold = 184;
  const lifetimeGrossSales = 7480.00;
  const royaltyShareRate = 0.70; // 70% direct royalty per PRD
  const lifetimeRoyalties = lifetimeGrossSales * royaltyShareRate; // $5,236.00
  const totalPaidOut = payouts
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);
  const availableBalance = Math.max(0, lifetimeRoyalties - totalPaidOut);

  const handleSubmitBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) {
      showToast('Please provide a title and author', 'error');
      return;
    }

    submitBook({
      publisherId: 'user-pub-1',
      publisherName: 'Atelier Press & Co.',
      title: newTitle,
      author: newAuthor,
      isbn: newIsbn,
      description: newDescription || 'A new scholarly edition published with archival binding.',
      price: parseFloat(newPrice) || 29.99,
      stockQuantity: parseInt(newStock, 10) || 25,
      coverImageUrl: coverPreviewUrl,
      fileUrl: '/assets/ebooks/sample-preview.pdf',
      isFeatured: false,
      status: 'PENDING_APPROVAL',
      format: newFormat,
      genres: [newGenre],
      publicationYear: 2026,
      pages: parseInt(newPages, 10) || 280,
    });

    // Reset form
    setNewTitle('');
    setNewAuthor('');
    setNewDescription('');
    setActiveTab('catalog');
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payoutAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please specify a valid amount', 'error');
      return;
    }
    if (amountNum > availableBalance) {
      showToast('Requested amount exceeds available balance', 'error');
      return;
    }

    requestPayout(amountNum, bankName, accountNumber, accountName);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Publisher Header */}
      <div className="bg-white rounded-xl border border-[#d3cec6] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#ebe7e1] border border-[#d3cec6] shrink-0">
            <img
              src="/src/assets/images/avatar_publisher_1791053836862.jpg"
              alt="Publisher Avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-[#111111]">Atelier Press & Co.</h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                VERIFIED PUBLISHER
              </span>
            </div>
            <p className="text-xs text-[#626260]">Managing 3 active titles · Direct 70% royalty terms</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('submit')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-[#ff5600] text-white text-xs font-semibold hover:bg-[#e04c00] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Book</span>
          </button>
          
          <button
            onClick={() => navigateTo('navigation_flow_diagram')}
            className="px-3.5 py-2.5 rounded-md bg-[#f5f1ec] text-[#111111] text-xs font-medium border border-[#d3cec6] hover:bg-[#ebe7e1]"
          >
            Flow Map
          </button>
        </div>
      </div>

      {/* 4 Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-[#d3cec6] space-y-1">
          <span className="text-xs text-[#7b7b78] uppercase tracking-wider">Catalog Titles</span>
          <div className="text-2xl font-semibold text-[#111111] font-mono tabular-nums">
            {publisherBooks.length}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">All active in circulation</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#d3cec6] space-y-1">
          <span className="text-xs text-[#7b7b78] uppercase tracking-wider">Total Units Sold</span>
          <div className="text-2xl font-semibold text-[#111111] font-mono tabular-nums">
            {totalUnitsSold}
          </div>
          <p className="text-[11px] text-[#7b7b78]">Across hardcovers & ePubs</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#d3cec6] space-y-1">
          <span className="text-xs text-[#7b7b78] uppercase tracking-wider">Accrued Royalties (70%)</span>
          <div className="text-2xl font-semibold text-[#111111] font-mono tabular-nums">
            ${lifetimeRoyalties.toFixed(2)}
          </div>
          <p className="text-[11px] text-[#7b7b78]">Gross Sales: ${lifetimeGrossSales.toFixed(2)}</p>
        </div>

        <div className="p-5 bg-[#111111] text-white rounded-xl space-y-1">
          <span className="text-xs text-[#9c9fa5] uppercase tracking-wider">Available Payout</span>
          <div className="text-2xl font-semibold text-white font-mono tabular-nums">
            ${availableBalance.toFixed(2)}
          </div>
          <button
            onClick={() => setActiveTab('payouts')}
            className="text-[11px] text-[#ff5600] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Request Withdrawal →</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#d3cec6] text-xs font-medium">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Catalog ({publisherBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('submit')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'submit'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Submit Title for Moderation</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Sales & Royalties</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'payouts'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Payout Requests ({payouts.length})</span>
        </button>
      </div>

      {/* Tab 1: Catalog Manager */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-xl border border-[#d3cec6] overflow-hidden">
          <div className="p-4 border-b border-[#ebe7e1] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#111111]">Active Catalog & Print Inventory</span>
            <span className="text-[#7b7b78]">Inventory automatically decremented on verified Flutterwave webhook</span>
          </div>

          <div className="divide-y divide-[#ebe7e1]">
            {publisherBooks.map((b) => (
              <div key={b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-16 rounded overflow-hidden bg-[#ebe7e1] border border-[#d3cec6] shrink-0">
                    <img
                      src={b.coverImageUrl}
                      alt={b.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#ff5600] uppercase font-semibold">
                        {b.format}
                      </span>
                      <span className="text-xs text-[#7b7b78]">·</span>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          b.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : b.status === 'PENDING_APPROVAL'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#111111]">{b.title}</h3>
                    <p className="text-xs text-[#626260]">by {b.author} · ISBN: {b.isbn}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-right self-end sm:self-auto">
                  <div>
                    <span className="text-[#7b7b78]">Print Stock:</span>
                    <p className="font-mono font-semibold text-[#111111]">{b.stockQuantity} units</p>
                  </div>
                  <div>
                    <span className="text-[#7b7b78]">Unit Price:</span>
                    <p className="font-mono font-semibold text-[#111111]">${b.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-[#7b7b78]">Author Royalty (70%):</span>
                    <p className="font-mono font-semibold text-emerald-700">${(b.price * 0.7).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => navigateTo('store_book_detail', b.id)}
                    className="p-1.5 rounded bg-[#f5f1ec] text-[#111111] hover:bg-[#ebe7e1] border border-[#d3cec6]"
                    title="View in Storefront"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Submit New Title */}
      {activeTab === 'submit' && (
        <div className="bg-white rounded-xl border border-[#d3cec6] p-6 sm:p-8 space-y-6 max-w-3xl">
          <div className="border-b border-[#ebe7e1] pb-4">
            <span className="text-xs font-semibold text-[#ff5600] uppercase tracking-wider">
              PRD Catalog Creation Workflow
            </span>
            <h2 className="text-xl font-semibold text-[#111111] tracking-tight">
              Submit New Book for Admin Catalog Approval
            </h2>
            <p className="text-xs text-[#626260] mt-1 leading-relaxed">
              Upload cover art, metadata, digital assets, and physical print inventory. Once submitted, System Admin reviews and approves the title for public purchase.
            </p>
          </div>

          <form onSubmit={handleSubmitBook} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">Book Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Modernist Typographic Systems"
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">Author Name(s) *</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Clara Vance"
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">ISBN-13</label>
                <input
                  type="text"
                  value={newIsbn}
                  onChange={(e) => setNewIsbn(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md font-mono focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">Retail Price ($ USD) *</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md font-mono focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">Format Edition</label>
                <select
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value as BookFormat)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md focus:bg-white focus:outline-none focus:border-[#111111]"
                >
                  <option value="Hardcover">Hardcover</option>
                  <option value="Paperback">Paperback</option>
                  <option value="E-book">E-book Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">Physical Stock Quantity</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md font-mono focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">Primary Genre</label>
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md focus:bg-white focus:outline-none focus:border-[#111111]"
                >
                  <option value="Architecture & Design">Architecture & Design</option>
                  <option value="Literary Fiction">Literary Fiction</option>
                  <option value="Technology & Society">Technology & Society</option>
                  <option value="Economics & Philosophy">Economics & Philosophy</option>
                  <option value="Art & Photography">Art & Photography</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">Page Count</label>
                <input
                  type="number"
                  value={newPages}
                  onChange={(e) => setNewPages(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md font-mono focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#111111]">Curator's Summary & Editorial Pitch</label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe thesis, materials, paper weight, and historical context..."
                className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md focus:bg-white focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Royalty Calculator Strip */}
            <div className="bg-[#f5f1ec] p-4 rounded-lg border border-[#d3cec6] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#111111]">Calculated Royalty Payout (70%):</span>
                <p className="text-[11px] text-[#626260]">
                  At ${parseFloat(newPrice || '0').toFixed(2)} retail, you receive{' '}
                  <strong className="text-emerald-700 font-mono">
                    ${(parseFloat(newPrice || '0') * 0.70).toFixed(2)}
                  </strong>{' '}
                  per copy sold.
                </p>
              </div>
              <span className="font-mono text-xs text-[#7b7b78]">Platform Fee: 30%</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-[#ff5600] text-white font-semibold hover:bg-[#e04c00] transition-colors shadow-sm"
            >
              Submit for Admin Moderation
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Sales Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-xl border border-[#d3cec6] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#ebe7e1] pb-4">
            <div>
              <h3 className="text-base font-semibold text-[#111111]">Sales Performance by Book</h3>
              <p className="text-xs text-[#626260]">Aggregated live units sold and verified royalties</p>
            </div>
            <span className="text-xs text-[#7b7b78] font-mono">Cycle: Q1 2026</span>
          </div>

          <div className="space-y-4">
            {publisherBooks.map((b) => {
              const estimatedUnits = b.id === 'book-001' ? 98 : b.id === 'book-002' ? 62 : 24;
              const grossVal = estimatedUnits * b.price;
              const netRoyalty = grossVal * 0.7;

              return (
                <div key={b.id} className="p-4 bg-[#f5f1ec] rounded-lg border border-[#d3cec6] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-semibold text-[#111111]">{b.title}</h4>
                      <p className="text-[11px] text-[#7b7b78]">{b.format} Edition · ${b.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold font-mono text-[#111111] text-sm tabular-nums">
                        ${netRoyalty.toFixed(2)}
                      </span>
                      <p className="text-[10px] text-emerald-700">70% Author Royalty</p>
                    </div>
                  </div>

                  {/* Visual Progress bar */}
                  <div className="w-full bg-[#ebe7e1] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#ff5600] h-full rounded-full"
                      style={{ width: `${Math.min(100, (estimatedUnits / 120) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#7b7b78] font-mono">
                    <span>{estimatedUnits} copies sold</span>
                    <span>Gross: ${grossVal.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Payout Requests */}
      {activeTab === 'payouts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Request Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#d3cec6] p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#111111] pb-2 border-b border-[#ebe7e1]">
              Request Royalty Withdrawal
            </h3>

            <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">Withdrawal Amount ($ USD)</label>
                <input
                  type="number"
                  step="10"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md font-mono focus:bg-white focus:outline-none focus:border-[#111111]"
                />
                <p className="text-[11px] text-[#7b7b78]">Max Available: ${availableBalance.toFixed(2)}</p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">Bank Institution</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">Account Number / IBAN</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md font-mono focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">Beneficiary Account Name</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-md bg-[#111111] text-white font-semibold hover:bg-black transition-colors"
              >
                Submit Withdrawal to Finance
              </button>
            </form>
          </div>

          {/* History (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#d3cec6] p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#111111] pb-2 border-b border-[#ebe7e1]">
              Withdrawal History & Reconciliation
            </h3>

            <div className="space-y-3">
              {payouts.map((p) => (
                <div key={p.id} className="p-4 bg-[#f5f1ec] rounded-lg border border-[#d3cec6] flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#111111]">Request #{p.id}</span>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          p.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : p.status === 'APPROVED'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7b7b78] mt-0.5">
                      {p.bankName} · {p.accountNumber} · Requested {new Date(p.requestedAt).toLocaleDateString()}
                    </p>
                    {p.flwTransferId && (
                      <p className="text-[10px] font-mono text-[#ff5600] mt-0.5">
                        Flutterwave Transfer: {p.flwTransferId}
                      </p>
                    )}
                  </div>

                  <span className="font-mono font-semibold text-[#111111] text-sm tabular-nums">
                    ${p.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
