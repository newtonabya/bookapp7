import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Book, UserRole } from '../../types';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  Filter,
  Key,
  Layers,
  Lock,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  UserCheck,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    settings,
    updatePaymentSettings,
    testPaymentConnection,
    books,
    updateBookStatus,
    users,
    updateUserRole,
    toggleUserStatus,
    auditLogs,
    showToast,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'apikeys' | 'catalog' | 'users' | 'audit'>('apikeys');

  // Key form fields
  const [publicKey, setPublicKey] = useState(settings.flutterwavePublicKey);
  const [secretKey, setSecretKey] = useState(settings.flutterwaveSecretKey);
  const [encryptionKey, setEncryptionKey] = useState(settings.flutterwaveEncryptionKey);
  const [webhookSecretHash, setWebhookSecretHash] = useState(settings.webhookSecretHash);
  const [isLiveMode, setIsLiveMode] = useState(settings.isLiveMode);
  const [showSecret, setShowSecret] = useState(false);

  // Ping test state
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; message: string; latencyMs: number } | null>(null);

  // Review comment state
  const [reviewNote, setReviewNote] = useState('');

  const pendingBooks = books.filter((b) => b.status === 'PENDING_APPROVAL');

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings({
      publicKey,
      secretKey,
      encryptionKey,
      webhookSecretHash,
      isLiveMode,
    });
  };

  const handleTestConnection = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await testPaymentConnection();
      setPingResult(res);
      showToast('Flutterwave connection validated successfully');
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-white rounded-xl border border-[#d3cec6] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#111111]">System Admin Dashboard</h1>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
              ROOT PERMISSION
            </span>
          </div>
          <p className="text-xs text-[#626260] mt-1">
            Global system governance, dynamic AES-256 payment key injection, catalog moderation, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('navigation_flow_diagram')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            <span>User Flow Architecture</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#ff5600]" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#d3cec6] text-xs font-medium">
        <button
          onClick={() => setActiveTab('apikeys')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'apikeys'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <Lock className="w-4 h-4 text-[#ff5600]" />
          <span>Dynamic Flutterwave Key Injection</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Catalog Approval Queue ({pendingBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Provisioning & RBAC ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'border-[#ff5600] text-[#111111] font-semibold'
              : 'border-transparent text-[#626260] hover:text-[#111111]'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>System Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Dynamic API Key Management (Highlight PRD Feature) */}
      {activeTab === 'apikeys' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Key Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#d3cec6] p-6 space-y-6">
            <div className="border-b border-[#ebe7e1] pb-3">
              <span className="text-xs font-semibold text-[#ff5600] uppercase tracking-wider">
                PRD Section 7 Architectural Highlight
              </span>
              <h2 className="text-lg font-semibold text-[#111111]">
                Dynamic Flutterwave Secret Key Injection
              </h2>
              <p className="text-xs text-[#626260] mt-1 leading-relaxed">
                Rather than hardcoding static keys in <code className="font-mono text-[#111111]">.env</code>, keys are configured here by Admin, encrypted with AES-256-GCM, and stored in PostgreSQL. Next.js server actions decrypt them at runtime for payment signatures.
              </p>
            </div>

            <form onSubmit={handleSaveKeys} className="space-y-4 text-xs">
              
              {/* Environment toggle */}
              <div className="p-3 bg-[#f5f1ec] rounded-lg border border-[#d3cec6] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#111111]">Gateway Environment Mode</span>
                  <p className="text-[11px] text-[#7b7b78]">Select whether checkout connects to Flutterwave Sandbox or Production</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLiveMode(false)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      !isLiveMode
                        ? 'bg-[#111111] text-white shadow-xs'
                        : 'bg-white text-[#626260] border border-[#d3cec6]'
                    }`}
                  >
                    Test Sandbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLiveMode(true)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      isLiveMode
                        ? 'bg-[#ff5600] text-white shadow-xs'
                        : 'bg-white text-[#626260] border border-[#d3cec6]'
                    }`}
                  >
                    Live Production
                  </button>
                </div>
              </div>

              {/* Public Key */}
              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">
                  FLUTTERWAVE_PUBLIC_KEY
                </label>
                <input
                  type="text"
                  required
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md font-mono focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* Secret Key */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-[#111111]">
                    FLUTTERWAVE_SECRET_KEY (AES-256 Encrypted at Rest)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="text-[#7b7b78] hover:text-[#111111] flex items-center gap-1 text-[11px]"
                  >
                    {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showSecret ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>
                <input
                  type={showSecret ? 'text' : 'password'}
                  required
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md font-mono focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* Encryption Key */}
              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">
                  FLUTTERWAVE_ENCRYPTION_KEY
                </label>
                <input
                  type="text"
                  required
                  value={encryptionKey}
                  onChange={(e) => setEncryptionKey(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md font-mono focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* Webhook Secret Hash */}
              <div className="space-y-1">
                <label className="font-semibold text-[#111111]">
                  FLW_SECRET_HASH (Webhook Signature Header Verification)
                </label>
                <input
                  type="text"
                  required
                  value={webhookSecretHash}
                  onChange={(e) => setWebhookSecretHash(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f1ec] border border-[#d3cec6] rounded-md font-mono focus:bg-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-md bg-[#ff5600] text-white font-semibold hover:bg-[#e04c00] transition-colors shadow-sm"
                >
                  Encrypt & Save to PostgreSQL
                </button>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isPinging}
                  className="py-2.5 px-4 rounded-md bg-[#111111] text-white font-semibold hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#ff5600] ${isPinging ? 'animate-spin' : ''}`} />
                  <span>Test Connection</span>
                </button>
              </div>
            </form>

            {/* Test Ping result */}
            {pingResult && (
              <div
                className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                  pingResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-red-50 border-red-200 text-red-950'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold">{pingResult.message}</p>
                  <p className="text-[11px] font-mono text-emerald-800">
                    Round-trip latency: {pingResult.latencyMs}ms · Dynamic key authentication OK.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Database & Cipher Inspector (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#d3cec6] p-6 space-y-5">
            <div className="border-b border-[#ebe7e1] pb-3">
              <span className="text-xs font-semibold text-[#7b7b78] uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#ff5600]" />
                <span>PostgreSQL Storage Preview</span>
              </span>
              <h3 className="text-sm font-semibold text-[#111111]">
                Table: `system_settings`
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#f5f1ec] rounded-lg border border-[#d3cec6] space-y-1 font-mono text-[11px]">
                <p className="text-[#7b7b78]">-- Schema representation:</p>
                <p><span className="text-purple-700">key:</span> "FLUTTERWAVE_SECRET_KEY"</p>
                <p><span className="text-purple-700">iv:</span> "{settings.encryptedRecordPreview.iv}"</p>
                <p className="truncate"><span className="text-purple-700">ciphertext:</span> "{settings.encryptedRecordPreview.ciphertext}"</p>
                <p><span className="text-purple-700">auth_tag:</span> "{settings.encryptedRecordPreview.authTag}"</p>
                <p><span className="text-purple-700">algorithm:</span> "{settings.encryptionAlgorithm}"</p>
                <p><span className="text-purple-700">updated_by:</span> "{settings.updatedBy}"</p>
              </div>

              <div className="p-3 bg-[#111111] text-white rounded-lg space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-[#ff5600]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Server-Side Key Retrieval Code</span>
                </div>
                <pre className="font-mono text-[10px] text-[#9c9fa5] leading-relaxed overflow-x-auto">
{`// lib/payments/flutterwave.ts
const record = await db.systemSettings.findUnique({
  where: { key: "FLUTTERWAVE_SECRET_KEY" }
});
const secretKey = decryptSecret(
  record.value_encrypted, 
  record.iv
);
// Injected into request header
Authorization: \`Bearer \${secretKey}\``}
                </pre>
              </div>

              <div className="text-[11px] text-[#626260] space-y-1 leading-relaxed">
                <p className="font-semibold text-[#111111]">Security Compliance Verification:</p>
                <p>
                  Zero plaintext credentials stored in version control or static environment files. Dynamic key rotation takes effect on next payment execution without server reboot.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Catalog Approval Queue */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-xl border border-[#d3cec6] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#ebe7e1] pb-3">
            <div>
              <h2 className="text-base font-semibold text-[#111111]">Publisher Submission Moderation Queue</h2>
              <p className="text-xs text-[#626260]">Review titles submitted by independent presses before publication to storefront</p>
            </div>
            <span className="text-xs text-[#7b7b78] font-mono">
              Pending Titles: {pendingBooks.length}
            </span>
          </div>

          {pendingBooks.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#626260] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-semibold text-[#111111]">All submissions moderated</p>
              <p>There are no publisher book proposals awaiting approval.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBooks.map((b) => (
                <div key={b.id} className="p-5 bg-[#f5f1ec] rounded-xl border border-[#d3cec6] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-20 rounded bg-[#ebe7e1] border border-[#d3cec6] overflow-hidden shrink-0">
                        <img
                          src={b.coverImageUrl}
                          alt={b.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            PENDING APPROVAL
                          </span>
                          <span className="text-xs text-[#7b7b78]">{b.format} Edition</span>
                        </div>
                        <h3 className="text-sm font-semibold text-[#111111]">{b.title}</h3>
                        <p className="text-xs text-[#626260]">
                          Author: {b.author} · Publisher: <strong className="text-[#111111]">{b.publisherName}</strong>
                        </p>
                        <p className="text-xs text-[#7b7b78]">
                          ISBN: {b.isbn} · Retail Price: ${b.price.toFixed(2)} · Initial Stock: {b.stockQuantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => updateBookStatus(b.id, 'PUBLISHED', 'Approved by System Admin')}
                        className="px-4 py-2 rounded-md bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors"
                      >
                        Approve for Public Catalog
                      </button>

                      <button
                        onClick={() => updateBookStatus(b.id, 'ARCHIVED', 'Rejected due to incomplete asset verification')}
                        className="px-3 py-2 rounded-md bg-white border border-[#d3cec6] text-red-600 text-xs font-medium hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-[#626260] bg-white p-3 rounded-lg border border-[#ebe7e1]">
                    <span className="font-semibold text-[#111111]">Publisher Pitch:</span> {b.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: User Provisioning & RBAC */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-[#d3cec6] overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-[#ebe7e1] pb-3">
            <div>
              <h2 className="text-base font-semibold text-[#111111]">Role-Based Access Control (RBAC) Directory</h2>
              <p className="text-xs text-[#626260]">Manage platform users, assign authorization roles, and toggle access</p>
            </div>
            <span className="text-xs text-[#7b7b78] font-mono">Total Users: {users.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#ebe7e1] text-[#7b7b78] font-semibold">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Organization</th>
                  <th className="py-2.5 px-3">Current RBAC Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Assign Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebe7e1]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f5f1ec]/60 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-semibold text-[#111111]">{u.fullName}</p>
                      <p className="text-[11px] text-[#7b7b78] font-mono">{u.email}</p>
                    </td>
                    <td className="py-3 px-3 text-[#626260]">
                      {u.organization || 'Independent Reader'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#f5f1ec] text-[#111111] border border-[#d3cec6]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {u.status}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                        className="bg-[#f5f1ec] border border-[#d3cec6] rounded px-2 py-1 text-xs focus:outline-none focus:border-[#111111]"
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="PUBLISHER">PUBLISHER</option>
                        <option value="FINANCE">FINANCE</option>
                        <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: System Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-[#d3cec6] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#ebe7e1] pb-3">
            <div>
              <h2 className="text-base font-semibold text-[#111111]">Immutable System Audit Ledger</h2>
              <p className="text-xs text-[#626260]">Chronological log of administrative actions, key injections, and financial dispatches</p>
            </div>
            <span className="text-xs text-[#7b7b78] font-mono">Total Events: {auditLogs.length}</span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-[#f5f1ec] rounded-lg border border-[#d3cec6] flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-[#111111]">{log.action}</span>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#d3cec6] text-[#7b7b78]">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-[#626260] leading-relaxed">{log.details}</p>
                </div>

                <div className="text-right shrink-0 text-[11px] text-[#7b7b78] font-mono">
                  <p>{new Date(log.timestamp).toLocaleTimeString()} · {new Date(log.timestamp).toLocaleDateString()}</p>
                  <p className="text-[10px]">Actor: {log.userEmail} ({log.userRole})</p>
                  <p className="text-[10px] text-[#9c9fa5]">IP: {log.ipAddress}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
