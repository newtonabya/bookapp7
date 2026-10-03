import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveAppView, UserRole } from '../../types';
import {
  ArrowRight,
  CheckCircle,
  Database,
  ExternalLink,
  Filter,
  Key,
  Layers,
  Lock,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';

interface FlowNode {
  id: string;
  role: UserRole | 'COMMON';
  title: string;
  subtitle: string;
  targetView: ActiveAppView;
  targetRole: UserRole;
  category: 'ENTRY' | 'ACTION' | 'TRANSACTION' | 'MODERATION' | 'SECURITY';
  dbEntities: string[];
  securityNote: string;
  endpoint?: string;
  inputs: string[];
  outputs: string[];
  nextNodes: string[];
}

export const NavigationFlowDiagram: React.FC = () => {
  const { jumpToNode, currentRole } = useApp();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cust-checkout');
  const [searchQuery, setSearchQuery] = useState('');

  const FLOW_NODES: FlowNode[] = [
    // Customer Lane
    {
      id: 'cust-home',
      role: 'CUSTOMER',
      title: 'Storefront Landing',
      subtitle: 'Dynamic hero, curated carousel, brand narrative',
      targetView: 'store_home',
      targetRole: 'CUSTOMER',
      category: 'ENTRY',
      dbEntities: ['books (is_featured = true)'],
      securityNote: 'Public read-only query cache',
      endpoint: 'GET /api/catalog/featured',
      inputs: ['None (public)'],
      outputs: ['Featured books list', 'Category slugs'],
      nextNodes: ['cust-catalog', 'cust-pdp'],
    },
    {
      id: 'cust-catalog',
      role: 'CUSTOMER',
      title: 'Faceted Catalog & Search',
      subtitle: 'Multi-filter by genre, format, price slider, instant search',
      targetView: 'store_catalog',
      targetRole: 'CUSTOMER',
      category: 'ACTION',
      dbEntities: ['books (status = PUBLISHED)'],
      securityNote: 'Client-side debounced search with sanitized SQL queries',
      endpoint: 'GET /api/books?genre=&format=&minPrice=',
      inputs: ['Genre filter', 'Format (Hardcover/Paperback/E-book)', 'Search keyword'],
      outputs: ['Filtered catalog grid', 'Inventory count indicator'],
      nextNodes: ['cust-pdp'],
    },
    {
      id: 'cust-pdp',
      role: 'CUSTOMER',
      title: 'Book Details (PDP)',
      subtitle: 'High-res cover, metadata, stock level, customer reviews',
      targetView: 'store_book_detail',
      targetRole: 'CUSTOMER',
      category: 'ACTION',
      dbEntities: ['books', 'users (publisher)', 'reviews'],
      securityNote: 'Strict stock availability validation before cart commit',
      endpoint: 'GET /api/books/[id]',
      inputs: ['Book ID', 'Format selection', 'Quantity'],
      outputs: ['Contiguous purchase state', 'Cart badge increment'],
      nextNodes: ['cust-cart'],
    },
    {
      id: 'cust-cart',
      role: 'CUSTOMER',
      title: 'Persistent Cart & Bag',
      subtitle: 'Itemized summary, shipping calculation, tax estimate',
      targetView: 'store_cart',
      targetRole: 'CUSTOMER',
      category: 'ACTION',
      dbEntities: ['Session storage', 'cart_items'],
      securityNote: 'Recalculates subtotals against authoritative database prices',
      endpoint: 'POST /api/cart/verify',
      inputs: ['Cart item IDs', 'Quantities'],
      outputs: ['Verified subtotal', 'Tax & courier fee breakdown'],
      nextNodes: ['cust-checkout'],
    },
    {
      id: 'cust-checkout',
      role: 'CUSTOMER',
      title: 'Flutterwave Dynamic Checkout',
      subtitle: 'Customer details, payment method, DB keys injected in runtime',
      targetView: 'store_checkout',
      targetRole: 'CUSTOMER',
      category: 'TRANSACTION',
      dbEntities: ['system_settings (FLW keys)', 'orders (status: PENDING)'],
      securityNote: 'Keys decrypted on server memory only; never exposed to browser',
      endpoint: 'POST /api/payments/initialize-flutterwave',
      inputs: ['Name, Email, Delivery address', 'Payment method (Card/Mobile Money)'],
      outputs: ['Flutterwave standard checkout modal', 'Pending order record', 'tx_ref'],
      nextNodes: ['webhook-engine', 'cust-receipt'],
    },
    {
      id: 'cust-receipt',
      role: 'CUSTOMER',
      title: 'Order Confirmation & Library',
      subtitle: 'Verified receipt, instant ePub/PDF reader, shipment tracking',
      targetView: 'store_order_success',
      targetRole: 'CUSTOMER',
      category: 'ENTRY',
      dbEntities: ['orders (status: PAID)', 'order_items', 'downloads'],
      securityNote: 'Digital downloads protected by time-limited signed URLs',
      endpoint: 'GET /api/orders/[txRef]/receipt',
      inputs: ['Order ID / Flutterwave tx_ref'],
      outputs: ['Downloadable invoice', 'Digital library access', 'Courier tracker'],
      nextNodes: ['cust-portal'],
    },
    {
      id: 'cust-portal',
      role: 'CUSTOMER',
      title: 'Customer Library & Orders',
      subtitle: 'Lifetime book purchases, active shipment tracking, downloads',
      targetView: 'customer_portal',
      targetRole: 'CUSTOMER',
      category: 'ENTRY',
      dbEntities: ['orders', 'order_items'],
      securityNote: 'Customer user authentication & session verification',
      endpoint: 'GET /api/customer/orders',
      inputs: ['Customer User ID'],
      outputs: ['Purchase history', 'Digital asset readers'],
      nextNodes: [],
    },

    // Publisher Lane
    {
      id: 'pub-catalog',
      role: 'PUBLISHER',
      title: 'Publisher Catalog Hub',
      subtitle: 'Active book listings, stock levels, approval statuses',
      targetView: 'publisher_dashboard',
      targetRole: 'PUBLISHER',
      category: 'ENTRY',
      dbEntities: ['books (publisher_id = current_user)'],
      securityNote: 'RBAC: Publisher role verification; isolated to own titles only',
      endpoint: 'GET /api/publisher/books',
      inputs: ['Publisher Auth Token'],
      outputs: ['Status tags (Draft/Pending/Published)', 'Stock indicators'],
      nextNodes: ['pub-submit', 'pub-analytics'],
    },
    {
      id: 'pub-submit',
      role: 'PUBLISHER',
      title: 'Submit New Title',
      subtitle: 'Metadata, cover upload, PDF/ePub digital assets, physical stock',
      targetView: 'publisher_dashboard',
      targetRole: 'PUBLISHER',
      category: 'ACTION',
      dbEntities: ['books (status: PENDING_APPROVAL)'],
      securityNote: 'File mime-type validation and anti-virus scan on digital assets',
      endpoint: 'POST /api/publisher/books',
      inputs: ['Title, Author, ISBN, Price', 'PDF/ePub asset file', 'Stock count'],
      outputs: ['Created draft in moderation queue', 'Admin notification trigger'],
      nextNodes: ['admin-moderate', 'pub-catalog'],
    },
    {
      id: 'pub-analytics',
      role: 'PUBLISHER',
      title: 'Sales & Royalty Analytics',
      subtitle: 'Units sold, gross sales, 70% author royalty calculation',
      targetView: 'publisher_dashboard',
      targetRole: 'PUBLISHER',
      category: 'ACTION',
      dbEntities: ['order_items', 'orders (status: PAID)'],
      securityNote: 'Aggregated revenue computation isolating publisher sales',
      endpoint: 'GET /api/publisher/analytics',
      inputs: ['Date range filter'],
      outputs: ['Interactive sales graph', 'Accrued royalty balance'],
      nextNodes: ['pub-payout'],
    },
    {
      id: 'pub-payout',
      role: 'PUBLISHER',
      title: 'Request Royalty Payout',
      subtitle: 'Available balance withdrawal to registered bank account',
      targetView: 'publisher_dashboard',
      targetRole: 'PUBLISHER',
      category: 'TRANSACTION',
      dbEntities: ['payout_requests', 'users (bank_account)'],
      securityNote: 'Bank routing number verification and withdrawal cap checks',
      endpoint: 'POST /api/publisher/payouts/request',
      inputs: ['Withdrawal amount', 'Bank name & Account details'],
      outputs: ['Pending payout record in Finance queue'],
      nextNodes: ['fin-payouts'],
    },

    // Finance Lane
    {
      id: 'fin-transactions',
      role: 'FINANCE',
      title: 'Live Transaction Register',
      subtitle: 'Real-time feed of purchases, search by order ID, FLW status',
      targetView: 'finance_dashboard',
      targetRole: 'FINANCE',
      category: 'ENTRY',
      dbEntities: ['orders', 'system_settings'],
      securityNote: 'RBAC: Finance role required; displays transaction references',
      endpoint: 'GET /api/finance/transactions',
      inputs: ['Search query', 'Status filter (SUCCESS/PENDING/FAILED)'],
      outputs: ['Transaction ledger table', 'Flutterwave reference inspector'],
      nextNodes: ['fin-payouts', 'fin-revenue'],
    },
    {
      id: 'fin-payouts',
      role: 'FINANCE',
      title: 'Payout Reconciliation & Transfers',
      subtitle: 'Verify author bank details, approve, trigger Flutterwave transfer',
      targetView: 'finance_dashboard',
      targetRole: 'FINANCE',
      category: 'TRANSACTION',
      dbEntities: ['payout_requests', 'system_settings (FLW keys)'],
      securityNote: 'Flutterwave Batch Transfer API call using runtime decrypted key',
      endpoint: 'POST /api/finance/payouts/[id]/approve',
      inputs: ['Payout ID', 'Transfer approval token'],
      outputs: ['FLW transfer reference', 'Updated payout status to PAID'],
      nextNodes: ['fin-revenue'],
    },
    {
      id: 'fin-revenue',
      role: 'FINANCE',
      title: 'Revenue & GMV Analytics',
      subtitle: 'Gross Merchandise Value, 30% platform cut, 70% publisher net',
      targetView: 'finance_dashboard',
      targetRole: 'FINANCE',
      category: 'ACTION',
      dbEntities: ['orders', 'order_items'],
      securityNote: 'Read-only financial ledger metrics for reporting',
      endpoint: 'GET /api/finance/revenue/summary',
      inputs: ['Fiscal period selector'],
      outputs: ['GMV total', 'Platform revenue retention', 'Net payouts disbursed'],
      nextNodes: [],
    },

    // System Admin Lane
    {
      id: 'admin-keys',
      role: 'SYSTEM_ADMIN',
      title: 'Dynamic API Key Management',
      subtitle: 'AES-256-GCM encrypted Flutterwave keys in PostgreSQL DB',
      targetView: 'admin_dashboard',
      targetRole: 'SYSTEM_ADMIN',
      category: 'SECURITY',
      dbEntities: ['system_settings'],
      securityNote: 'Encrypted with master key at rest; zero plain text in .env or Git',
      endpoint: 'PUT /api/admin/settings/flutterwave',
      inputs: ['Public Key', 'Secret Key', 'Encryption Key', 'Webhook Secret Hash'],
      outputs: ['Encrypted IV + Ciphertext in DB', 'Verified runtime connection'],
      nextNodes: ['cust-checkout', 'admin-audit'],
    },
    {
      id: 'admin-moderate',
      role: 'SYSTEM_ADMIN',
      title: 'Catalog Moderation Queue',
      subtitle: 'Review publisher submissions, verify ISBN/pricing, approve or reject',
      targetView: 'admin_dashboard',
      targetRole: 'SYSTEM_ADMIN',
      category: 'MODERATION',
      dbEntities: ['books'],
      securityNote: 'Admin privilege check; sends status notification to publisher',
      endpoint: 'PATCH /api/admin/books/[id]/moderate',
      inputs: ['Book ID', 'Approval state', 'Reviewer note'],
      outputs: ['Status updated to PUBLISHED or REJECTED', 'Audit log entry'],
      nextNodes: ['cust-catalog', 'admin-audit'],
    },
    {
      id: 'admin-users',
      role: 'SYSTEM_ADMIN',
      title: 'User Provisioning & RBAC',
      subtitle: 'Assign roles (Admin, Finance, Publisher, Customer), toggle status',
      targetView: 'admin_dashboard',
      targetRole: 'SYSTEM_ADMIN',
      category: 'ACTION',
      dbEntities: ['users'],
      securityNote: 'Strict RBAC guard: prevents non-admins from role escalation',
      endpoint: 'PATCH /api/admin/users/[id]/role',
      inputs: ['User ID', 'New UserRole Enum', 'Active/Suspended toggle'],
      outputs: ['Updated user permission scope', 'Session invalidation if suspended'],
      nextNodes: ['admin-audit'],
    },
    {
      id: 'admin-audit',
      role: 'SYSTEM_ADMIN',
      title: 'System Audit Logs',
      subtitle: 'Immutable record of key rotations, role assignments, transactions',
      targetView: 'admin_dashboard',
      targetRole: 'SYSTEM_ADMIN',
      category: 'SECURITY',
      dbEntities: ['audit_logs'],
      securityNote: 'Append-only ledger with user IP address and cryptographic hash',
      endpoint: 'GET /api/admin/audit-logs',
      inputs: ['Category filter', 'Date range'],
      outputs: ['Chronological security audit trail'],
      nextNodes: [],
    },
  ];

  const filteredNodes = FLOW_NODES.filter((n) => {
    const matchesRole = selectedRoleFilter === 'ALL' || n.role === selectedRoleFilter;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.dbEntities.some((db) => db.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const selectedNode = FLOW_NODES.find((n) => n.id === selectedNodeId) || FLOW_NODES[0];

  const rolePillColors: Record<UserRole, { bg: string; text: string; border: string }> = {
    CUSTOMER: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    PUBLISHER: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    FINANCE: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    SYSTEM_ADMIN: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 transition-colors">
      
      {/* Header section with Intercom editorial style */}
      <div className="bg-white rounded-xl border border-[#d3cec6] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ebe7e1] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#ff5600] uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>Full-Stack Architecture & Navigation Map</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight">
              Comprehensive Navigation & User Flow Diagram
            </h1>
            <p className="text-sm text-[#626260] mt-1 max-w-3xl leading-relaxed">
              Interactive map linking the Storefront, Publisher Hub, Finance Register, and System Admin. Every node demonstrates real user journeys, dynamic Flutterwave payment injection, and database state transitions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#7b7b78]">Click any node to navigate:</span>
            <button
              onClick={() => jumpToNode(selectedNode.targetRole, selectedNode.targetView)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#111111] text-white text-xs font-medium hover:bg-black transition-colors"
            >
              <span>Test Selected Screen</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#ff5600]" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'CUSTOMER', 'PUBLISHER', 'FINANCE', 'SYSTEM_ADMIN'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRoleFilter(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedRoleFilter === r
                    ? 'bg-[#111111] text-white'
                    : 'bg-[#f5f1ec] text-[#626260] hover:text-[#111111] hover:bg-[#ebe7e1]'
                }`}
              >
                {r === 'ALL' ? 'All Roles (All Lanes)' : r.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#7b7b78] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search steps, endpoints, DB..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f5f1ec] border border-[#d3cec6] rounded-md text-[#111111] placeholder-[#7b7b78] focus:bg-white focus:outline-none focus:border-[#111111]"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Swimlanes Flow on Left + Node Detail Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Swimlanes Flow Map (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Legend Banner */}
          <div className="bg-[#ebe7e1] rounded-lg p-3.5 flex flex-wrap items-center justify-between text-xs text-[#626260] gap-3">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#111111]">Role Swimlanes:</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Customer</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Publisher</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Finance</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Admin</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#7b7b78]">
              <Database className="w-3.5 h-3.5" />
              <span>PostgreSQL entities indicated</span>
            </div>
          </div>

          {/* Swimlane 1: Customer Journey */}
          {(selectedRoleFilter === 'ALL' || selectedRoleFilter === 'CUSTOMER') && (
            <div className="bg-white rounded-xl border border-[#d3cec6] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#ebe7e1] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-semibold text-[#111111]">1. Customer / Guest Journey</h3>
                  <span className="text-xs text-[#7b7b78]">· Browsing, Bag, Checkout, Order Confirmation</span>
                </div>
                <button
                  onClick={() => jumpToNode('CUSTOMER', 'store_home')}
                  className="text-xs font-medium text-[#ff5600] hover:underline flex items-center gap-1"
                >
                  Enter Storefront →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {FLOW_NODES.filter((n) => n.role === 'CUSTOMER').map((node, idx) => {
                  const isSelected = node.id === selectedNodeId;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`cursor-pointer rounded-lg p-3.5 border transition-all text-left relative ${
                        isSelected
                          ? 'border-[#ff5600] bg-[#f5f1ec] shadow-sm'
                          : 'border-[#ebe7e1] bg-white hover:border-[#d3cec6] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#7b7b78] mb-1.5">
                        <span className="font-mono">Step 0{idx + 1}</span>
                        {isSelected && <span className="text-[#ff5600] font-semibold">SELECTED</span>}
                      </div>
                      <h4 className="text-xs font-semibold text-[#111111]">{node.title}</h4>
                      <p className="text-[11px] text-[#626260] mt-1 line-clamp-2 leading-relaxed">{node.subtitle}</p>
                      
                      <div className="mt-3 pt-2 border-t border-[#ebe7e1] flex items-center justify-between text-[10px]">
                        <span className="font-mono text-[#7b7b78] truncate max-w-[120px]">
                          {node.dbEntities[0]}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            jumpToNode(node.targetRole, node.targetView);
                          }}
                          className="text-[#ff5600] font-semibold hover:underline"
                        >
                          Jump →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Swimlane 2: Publisher Journey */}
          {(selectedRoleFilter === 'ALL' || selectedRoleFilter === 'PUBLISHER') && (
            <div className="bg-white rounded-xl border border-[#d3cec6] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#ebe7e1] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <h3 className="text-sm font-semibold text-[#111111]">2. Publisher Journey</h3>
                  <span className="text-xs text-[#7b7b78]">· Catalog Management, Digital Upload, Sales & Payouts</span>
                </div>
                <button
                  onClick={() => jumpToNode('PUBLISHER', 'publisher_dashboard')}
                  className="text-xs font-medium text-[#ff5600] hover:underline flex items-center gap-1"
                >
                  Enter Publisher Hub →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {FLOW_NODES.filter((n) => n.role === 'PUBLISHER').map((node, idx) => {
                  const isSelected = node.id === selectedNodeId;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`cursor-pointer rounded-lg p-3.5 border transition-all text-left ${
                        isSelected
                          ? 'border-[#ff5600] bg-[#f5f1ec] shadow-sm'
                          : 'border-[#ebe7e1] bg-white hover:border-[#d3cec6] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#7b7b78] mb-1.5">
                        <span className="font-mono">Step 0{idx + 1}</span>
                        {isSelected && <span className="text-[#ff5600] font-semibold">SELECTED</span>}
                      </div>
                      <h4 className="text-xs font-semibold text-[#111111]">{node.title}</h4>
                      <p className="text-[11px] text-[#626260] mt-1 line-clamp-2 leading-relaxed">{node.subtitle}</p>
                      
                      <div className="mt-3 pt-2 border-t border-[#ebe7e1] flex items-center justify-between text-[10px]">
                        <span className="font-mono text-[#7b7b78] truncate max-w-[90px]">
                          {node.dbEntities[0]}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            jumpToNode(node.targetRole, node.targetView);
                          }}
                          className="text-[#ff5600] font-semibold hover:underline"
                        >
                          Jump →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Swimlane 3: Finance Journey */}
          {(selectedRoleFilter === 'ALL' || selectedRoleFilter === 'FINANCE') && (
            <div className="bg-white rounded-xl border border-[#d3cec6] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#ebe7e1] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <h3 className="text-sm font-semibold text-[#111111]">3. Finance Officer Journey</h3>
                  <span className="text-xs text-[#7b7b78]">· Transactions, Author Payout Approvals, Flutterwave Transfers</span>
                </div>
                <button
                  onClick={() => jumpToNode('FINANCE', 'finance_dashboard')}
                  className="text-xs font-medium text-[#ff5600] hover:underline flex items-center gap-1"
                >
                  Enter Finance →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FLOW_NODES.filter((n) => n.role === 'FINANCE').map((node, idx) => {
                  const isSelected = node.id === selectedNodeId;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`cursor-pointer rounded-lg p-3.5 border transition-all text-left ${
                        isSelected
                          ? 'border-[#ff5600] bg-[#f5f1ec] shadow-sm'
                          : 'border-[#ebe7e1] bg-white hover:border-[#d3cec6] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#7b7b78] mb-1.5">
                        <span className="font-mono">Step 0{idx + 1}</span>
                        {isSelected && <span className="text-[#ff5600] font-semibold">SELECTED</span>}
                      </div>
                      <h4 className="text-xs font-semibold text-[#111111]">{node.title}</h4>
                      <p className="text-[11px] text-[#626260] mt-1 line-clamp-2 leading-relaxed">{node.subtitle}</p>
                      
                      <div className="mt-3 pt-2 border-t border-[#ebe7e1] flex items-center justify-between text-[10px]">
                        <span className="font-mono text-[#7b7b78] truncate max-w-[110px]">
                          {node.dbEntities[0]}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            jumpToNode(node.targetRole, node.targetView);
                          }}
                          className="text-[#ff5600] font-semibold hover:underline"
                        >
                          Jump →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Swimlane 4: System Admin Journey */}
          {(selectedRoleFilter === 'ALL' || selectedRoleFilter === 'SYSTEM_ADMIN') && (
            <div className="bg-white rounded-xl border border-[#d3cec6] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#ebe7e1] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500" />
                  <h3 className="text-sm font-semibold text-[#111111]">4. System Admin Journey</h3>
                  <span className="text-xs text-[#7b7b78]">· Dynamic Secret Injection, Catalog Moderation, RBAC, Audit</span>
                </div>
                <button
                  onClick={() => jumpToNode('SYSTEM_ADMIN', 'admin_dashboard')}
                  className="text-xs font-medium text-[#ff5600] hover:underline flex items-center gap-1"
                >
                  Enter Admin →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {FLOW_NODES.filter((n) => n.role === 'SYSTEM_ADMIN').map((node, idx) => {
                  const isSelected = node.id === selectedNodeId;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`cursor-pointer rounded-lg p-3.5 border transition-all text-left ${
                        isSelected
                          ? 'border-[#ff5600] bg-[#f5f1ec] shadow-sm'
                          : 'border-[#ebe7e1] bg-white hover:border-[#d3cec6] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#7b7b78] mb-1.5">
                        <span className="font-mono">Step 0{idx + 1}</span>
                        {isSelected && <span className="text-[#ff5600] font-semibold">SELECTED</span>}
                      </div>
                      <h4 className="text-xs font-semibold text-[#111111]">{node.title}</h4>
                      <p className="text-[11px] text-[#626260] mt-1 line-clamp-2 leading-relaxed">{node.subtitle}</p>
                      
                      <div className="mt-3 pt-2 border-t border-[#ebe7e1] flex items-center justify-between text-[10px]">
                        <span className="font-mono text-[#7b7b78] truncate max-w-[90px]">
                          {node.dbEntities[0]}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            jumpToNode(node.targetRole, node.targetView);
                          }}
                          className="text-[#ff5600] font-semibold hover:underline"
                        >
                          Jump →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Secret Injection Architecture Highlight Card */}
          <div className="bg-[#111111] text-white rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#ff5600]" />
                <h4 className="text-sm font-semibold tracking-wide">
                  PRD Highlight: Dynamic Secret Key Injection Lifecycle
                </h4>
              </div>
              <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded text-[#ebe7e1]">
                AES-256-GCM
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#9c9fa5]">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <p className="text-white font-medium mb-1">1. Admin Form Input</p>
                <p className="text-[11px] leading-relaxed">
                  Admin supplies live/test Flutterwave secret keys via Dashboard. Keys are encrypted client-to-server with AES-256-GCM.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <p className="text-white font-medium mb-1">2. Stored at Rest</p>
                <p className="text-[11px] leading-relaxed">
                  Ciphertext, IV, and auth tag written to PostgreSQL <code className="text-[#ff5600]">system_settings</code>. Zero plain keys in <code className="text-white">.env</code>.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <p className="text-white font-medium mb-1">3. Runtime Decryption</p>
                <p className="text-[11px] leading-relaxed">
                  During checkout or webhook verification, server queries DB, decrypts secret key in RAM, and signs Flutterwave payloads.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Step Inspector Drawer (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 bg-white rounded-xl border border-[#d3cec6] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#ebe7e1] pb-3">
            <div>
              <p className="text-[11px] font-mono text-[#7b7b78] uppercase">Node Inspector</p>
              <h3 className="text-base font-semibold text-[#111111]">{selectedNode.title}</h3>
            </div>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                rolePillColors[selectedNode.targetRole]?.bg || 'bg-gray-100'
              } ${rolePillColors[selectedNode.targetRole]?.text || 'text-gray-900'} ${
                rolePillColors[selectedNode.targetRole]?.border || 'border-gray-200'
              }`}
            >
              {selectedNode.targetRole}
            </span>
          </div>

          <p className="text-xs text-[#626260] leading-relaxed">
            {selectedNode.subtitle}
          </p>

          {/* Action button to test this screen */}
          <button
            onClick={() => jumpToNode(selectedNode.targetRole, selectedNode.targetView)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#ff5600] text-white text-xs font-semibold hover:bg-[#e04c00] transition-colors shadow-sm"
          >
            <span>Open This Screen ({selectedNode.targetRole})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Endpoint */}
          {selectedNode.endpoint && (
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#111111]">API Route / Action:</span>
              <div className="bg-[#f5f1ec] p-2 rounded text-[11px] font-mono text-[#111111] border border-[#d3cec6] break-all">
                {selectedNode.endpoint}
              </div>
            </div>
          )}

          {/* DB Entities */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#111111] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#ff5600]" />
              <span>PostgreSQL Entities Touched:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.dbEntities.map((ent) => (
                <span
                  key={ent}
                  className="bg-[#ebe7e1] text-[#111111] text-[10px] font-mono px-2 py-0.5 rounded border border-[#d3cec6]"
                >
                  {ent}
                </span>
              ))}
            </div>
          </div>

          {/* Security & RBAC */}
          <div className="space-y-1.5 bg-[#f5f1ec] p-3 rounded-lg border border-[#d3cec6]">
            <span className="text-[11px] font-semibold text-[#111111] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#ff5600]" />
              <span>Security & Integrity Guard:</span>
            </span>
            <p className="text-[11px] text-[#626260] leading-relaxed">
              {selectedNode.securityNote}
            </p>
          </div>

          {/* Inputs & Outputs */}
          <div className="space-y-2 pt-2 border-t border-[#ebe7e1] text-xs">
            <div>
              <span className="font-semibold text-[#111111] text-[11px]">Inputs:</span>
              <ul className="list-disc list-inside text-[11px] text-[#626260] mt-0.5">
                {selectedNode.inputs.map((inp, idx) => (
                  <li key={idx}>{inp}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold text-[#111111] text-[11px]">Outputs:</span>
              <ul className="list-disc list-inside text-[11px] text-[#626260] mt-0.5">
                {selectedNode.outputs.map((out, idx) => (
                  <li key={idx}>{out}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
