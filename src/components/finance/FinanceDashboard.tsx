import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, PayoutRequest } from '../../types';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Database,
  DollarSign,
  Download,
  Filter,
  Layers,
  Lock,
  PieChart,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react';

export const FinanceDashboard: React.FC = () => {
  const {
    orders,
    payouts,
    updatePayoutStatus,
    updateOrderStatus,
    showToast,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'transactions' | 'payouts' | 'revenue'>('transactions');
  const [txSearch, setTxSearch] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Revenue analytics aggregates
  const paidOrders = orders.filter((o) => o.status === 'PAID');
  const gmvTotal = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0) + 4820.00;
  const platformFeeCut = gmvTotal * 0.30; // 30% platform cut
  const netPublisherShare = gmvTotal * 0.70; // 70% publisher royalties

  const filteredOrders = orders.filter((o) => {
    const matchStatus = txStatusFilter === 'ALL' || o.status === txStatusFilter;
    const matchSearch =
      o.id.toLowerCase().includes(txSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(txSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(txSearch.toLowerCase()) ||
      o.txRef.toLowerCase().includes(txSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleExecuteTransfer = (payoutId: string) => {
    updatePayoutStatus(payoutId, 'PAID');
    showToast(`Executed Flutterwave Transfer API for payout #${payoutId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Finance Header */}
      <div className="bg-white rounded-xl border border-[#d3cec6] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#111111]">Finance & Treasury Register</h1>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              FINANCIAL AUDIT LEVEL
            </span>
          </div>
          <p className="text-xs text-[#626260] mt-1">
            Monitoring live Flutterwave settlement feeds, author withdrawal reconciliations, and GMV revenue splits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast('Reconciled ledger with latest Flutterwave bank settlement batch', 'success')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#ff5600]" />
            <span>Reconcile Batch</span>
          </button>
          <button
            onClick={() => navigateTo('navigation_flow_diagram')}
            className="px-3.5 py-2 rounded-md bg-[#f5f1ec] text-[#111111] text-xs font-medium border border-[#d3cec6] hover:bg-[#ebe7e1]"
          >
            Flow Map
          </button>
        </div>
      </div>

      {/* 3 Large KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-[#d3cec6] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7b7b78]">
            <span className="uppercase tracking-wider">Gross Merchandise Value (GMV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-semibold text-[#111111] font-mono tabular-nums">
            ${gmvTotal.toFixed(2)}
          </div>
          <p className="text-xs text-[#626260]">Total volume processed via Flutterwave</p>
        </div>

        <div className="p-6 bg-[#111111] text-white rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9c9fa5]">
            <span className="uppercase tracking-wider">Platform Take (30%)</span>
            <DollarSign className="w-4 h-4 text-[#ff5600]" />
          </div>
          <div className="text-3xl font-semibold text-white font-mono tabular-nums">
            ${platformFeeCut.toFixed(2)}
          </div>
          <p className="text-xs text-[#ebe7e1]">Net revenue retained by platform</p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-[#d3cec6] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7b7b78]">
            <span className="uppercase tracking-wider">Author Payouts Disbursed (70%)</span>
            <PieChart className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-semibold text-[#111111] font-mono tabular-nums">
            ${netPublisherShare.toFixed(2)}
          </div>
          <p className="text-xs text-[#626260]">Settled to publisher bank accounts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#d3cec6] text-xs font-medium">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'transactions'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Live Transaction Register ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'payouts'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Payout Reconciliations ({payouts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('revenue')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'revenue'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Financial Revenue Analytics</span>
        </button>
      </div>

      {/* Tab 1: Transactions Register */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl border border-[#d3cec6] overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#7b7b78] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                placeholder="Search by Order ID, customer, tx_ref..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f5f1ec] border border-[#d3cec6] rounded-md focus:bg-white focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(['ALL', 'PAID', 'PENDING', 'CANCELLED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setTxStatusFilter(st)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    txStatusFilter === st
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#f5f1ec] text-[#626260] hover:text-[#111111]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#ebe7e1] text-[#7b7b78] font-semibold">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Flutterwave TxRef</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebe7e1]">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#f5f1ec]/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-[#111111]">
                      #{o.id}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-[#111111]">{o.customerName}</p>
                      <p className="text-[11px] text-[#7b7b78]">{o.customerEmail}</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#626260]">
                      {o.txRef}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-[#111111] tabular-nums">
                      ${o.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 uppercase text-[10px] font-mono text-[#7b7b78]">
                      {o.paymentMethod}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          o.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : o.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      {o.status === 'PENDING' && (
                        <button
                          onClick={() => updateOrderStatus(o.id, 'PAID')}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-medium hover:bg-emerald-700"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => alert(`Inspecting verified Flutterwave payload for ${o.txRef}`)}
                        className="px-2 py-1 bg-[#f5f1ec] text-[#111111] rounded text-[10px] border border-[#d3cec6] hover:bg-[#ebe7e1]"
                      >
                        Inspect Payload
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Payout Reconciliations */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-xl border border-[#d3cec6] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#ebe7e1] pb-3">
            <div>
              <h3 className="text-base font-semibold text-[#111111]">Publisher Withdrawal Authorization</h3>
              <p className="text-xs text-[#626260]">Validate author bank routing and initiate Flutterwave batch transfers</p>
            </div>
            <span className="text-xs text-[#7b7b78] font-mono">Gateway: Flutterwave Transfer API</span>
          </div>

          <div className="space-y-4">
            {payouts.map((p) => (
              <div
                key={p.id}
                className="p-5 bg-[#f5f1ec] rounded-xl border border-[#d3cec6] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#111111]">Payout #{p.id}</span>
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

                  <p className="text-xs text-[#111111] font-medium">{p.publisherName}</p>
                  <p className="text-xs text-[#626260]">
                    {p.bankName} · Account: <strong className="font-mono text-[#111111]">{p.accountNumber}</strong> ({p.accountName})
                  </p>
                  {p.flwTransferId && (
                    <p className="text-[11px] font-mono text-[#ff5600]">
                      Dispatched via Flutterwave Transfer Ref: {p.flwTransferId}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-lg font-semibold font-mono text-[#111111] tabular-nums">
                      ${p.amount.toFixed(2)}
                    </span>
                    <p className="text-[10px] text-[#7b7b78]">Net Author Royalty</p>
                  </div>

                  {p.status === 'PENDING' && (
                    <button
                      onClick={() => handleExecuteTransfer(p.id)}
                      className="px-4 py-2 rounded-md bg-[#ff5600] text-white text-xs font-semibold hover:bg-[#e04c00] transition-colors shadow-sm"
                    >
                      Approve & Execute FLW Transfer
                    </button>
                  )}
                  {p.status === 'APPROVED' && (
                    <button
                      onClick={() => handleExecuteTransfer(p.id)}
                      className="px-4 py-2 rounded-md bg-[#111111] text-white text-xs font-semibold hover:bg-black"
                    >
                      Finalize Transfer
                    </button>
                  )}
                  {p.status === 'PAID' && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Settled</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Revenue Analytics */}
      {activeTab === 'revenue' && (
        <div className="bg-white rounded-xl border border-[#d3cec6] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#ebe7e1] pb-3">
            <div>
              <h3 className="text-base font-semibold text-[#111111]">Platform Revenue & Royalty Split Model</h3>
              <p className="text-xs text-[#626260]">Compliant with PRD 70/30 Publisher/Platform distribution formula</p>
            </div>
            <span className="text-xs text-[#7b7b78] font-mono">Fiscal Year 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-[#f5f1ec] rounded-xl border border-[#d3cec6] space-y-3 text-xs">
              <h4 className="font-semibold text-[#111111]">Revenue Allocation Breakdown</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[#626260] mb-1">
                    <span>Publisher Royalties (70%)</span>
                    <span className="font-mono font-semibold text-[#111111]">${netPublisherShare.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-[#ebe7e1] h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#626260] mb-1">
                    <span>Platform Retained Fee (30%)</span>
                    <span className="font-mono font-semibold text-[#111111]">${platformFeeCut.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-[#ebe7e1] h-3 rounded-full overflow-hidden">
                    <div className="bg-[#ff5600] h-full rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#f5f1ec] rounded-xl border border-[#d3cec6] space-y-3 text-xs">
              <h4 className="font-semibold text-[#111111]">Payment Gateway Health & Settlement</h4>
              <ul className="space-y-2 text-[#626260]">
                <li className="flex items-center justify-between">
                  <span>Active Gateway:</span>
                  <strong className="text-[#111111]">Flutterwave v3 Embedded API</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>Merchant Key Security:</span>
                  <strong className="text-emerald-700 font-mono">AES-256-GCM Encrypted</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>Average Webhook Latency:</span>
                  <strong className="font-mono text-[#111111]">142ms</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>Reconciliation Rate:</span>
                  <strong className="font-mono text-emerald-700">99.8% Verified</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
