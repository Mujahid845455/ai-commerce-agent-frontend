import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle,
  ChevronRight,
  Clock3,
  Copy,
  FileText,
  Filter,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { api } from "../services/client";

export default function MerchantOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await api.getAnalyticsOrders(50);
      setOrders(data);
    } catch (err) {
      setError("Failed to load merchant orders: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyId(id) {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  }

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.items && o.items.some((i) => i.product_name.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "CONFIRMED" && o.status === "CONFIRMED") ||
      (statusFilter === "PENDING" && o.status === "PENDING");

    return matchesSearch && matchesStatus;
  });

  const totalValueInr = orders.reduce((sum, o) => sum + (o.total_amount_inr || 0), 0);
  const confirmedCount = orders.filter((o) => o.status === "CONFIRMED").length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div style={{ padding: '24px', maxWidth: '1240px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#0f172a' }}>Order Management Console</h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>Real-time audit log of customer transactions, payment statuses, and AI agent checkouts.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, background: '#dcfce7', padding: '6px 12px', borderRadius: 20 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} /> Live Feed Active
          </span>

          <button
            className="secondary-button"
            onClick={loadOrders}
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, borderRadius: 10, border: '1px solid #cbd5e1', background: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh Orders
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', padding: '18px 20px', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase' }}>TOTAL TRANSACTIONS</span>
          <strong style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4, display: 'block' }}>{orders.length} Orders</strong>
        </div>

        <div style={{ background: 'white', padding: '18px 20px', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', display: 'block', textTransform: 'uppercase' }}>CONFIRMED (PAID)</span>
          <strong style={{ fontSize: 24, fontWeight: 800, color: '#16a34a', marginTop: 4, display: 'block' }}>{confirmedCount} Orders</strong>
        </div>

        <div style={{ background: 'white', padding: '18px 20px', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#d97706', display: 'block', textTransform: 'uppercase' }}>PENDING CHECKOUT</span>
          <strong style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4, display: 'block' }}>{pendingCount} Orders</strong>
        </div>

        <div style={{ background: 'white', padding: '18px 20px', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#7c5cff', display: 'block', textTransform: 'uppercase' }}>TOTAL VALUE</span>
          <strong style={{ fontSize: 24, fontWeight: 800, color: '#7c5cff', marginTop: 4, display: 'block' }}>₹{totalValueInr.toLocaleString("en-IN")}</strong>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div style={{ background: 'white', padding: '16px 20px', borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>

        {/* Search Box */}
        <div style={{ position: 'relative', width: '320px' }}>
          <input
            type="text"
            placeholder="Search Order ID or Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13, outline: 'none' }}
          />
          <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: 8 }}>
          {["ALL", "CONFIRMED", "PENDING"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: statusFilter === st ? '1px solid #7c5cff' : '1px solid #e2e8f0',
                background: statusFilter === st ? '#7c5cff' : 'white',
                color: statusFilter === st ? 'white' : '#475569',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {st === "ALL" ? "All Orders" : st === "CONFIRMED" ? "Confirmed (Paid)" : "Pending Checkouts"}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={{ padding: 14, background: '#fef2f2', color: '#ef4444', borderRadius: 10, marginBottom: 16, border: '1px solid #fecaca', fontSize: 13 }}>{error}</div>}

      {/* ORDERS TABLE */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748b', background: 'white', borderRadius: 14 }}>Loading merchant orders...</div>
      ) : (
        <div className="table-responsive-container" style={{ background: 'white', borderRadius: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Order ID</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Date & Time</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Purchased Items</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Total Amount</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Status</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Channel</th>
                <th style={{ padding: '14px 18px', fontWeight: 800, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>

                  {/* Order ID */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: 6 }}>
                        #{o.id.slice(0, 8)}
                      </span>
                      <button
                        onClick={() => handleCopyId(o.id)}
                        style={{ border: 0, background: 'transparent', cursor: 'pointer', color: copiedId === o.id ? '#16a34a' : '#94a3b8' }}
                        title="Copy Order ID"
                      >
                        {copiedId === o.id ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td style={{ padding: '14px 18px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {new Date(o.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "2-digit" })} · {new Date(o.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </td>

                  {/* Items */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {o.items && o.items.length > 0 ? (
                        o.items.map((item, idx) => (
                          <span key={idx} style={{ background: '#f1f5f9', color: '#1e293b', padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                            🛒 {item.product_name} <strong style={{ color: '#7c5cff' }}>(x{item.quantity})</strong>
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#64748b', fontSize: 12 }}>Product Order</span>
                      )}
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0f172a', fontSize: 14 }}>
                    ₹{o.total_amount_inr.toLocaleString("en-IN")}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: o.status === 'CONFIRMED' ? '#dcfce7' : o.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                      color: o.status === 'CONFIRMED' ? '#15803d' : o.status === 'PENDING' ? '#b45309' : '#b91c1c'
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: o.status === 'CONFIRMED' ? '#16a34a' : '#d97706' }} />
                      {o.status === 'CONFIRMED' ? 'CONFIRMED (PAID)' : 'PENDING CHECKOUT'}
                    </span>
                  </td>

                  {/* Channel */}
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff' }}>
                      🤖 AI Checkout Agent
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedInvoice(o)}
                      style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <FileText size={14} /> Receipt
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>No matching orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* DIGITAL INVOICE RECEIPT MODAL */}
      {selectedInvoice && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 20, maxWidth: 520, width: '100%', padding: 28, boxShadow: '0 20px 50px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={22} color="#7c5cff" />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>AgentPay Digital Invoice</h3>
              </div>
              <button onClick={() => setSelectedInvoice(null)} style={{ border: 0, background: 'transparent', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 16, fontSize: 12, lineHeight: 1.6 }}>
              <div><strong>ORDER ID:</strong> #{selectedInvoice.id}</div>
              <div><strong>DATE:</strong> {new Date(selectedInvoice.created_at).toLocaleString()}</div>
              <div><strong>STATUS:</strong> <span style={{ color: selectedInvoice.status === 'CONFIRMED' ? '#16a34a' : '#d97706', fontWeight: 800 }}>{selectedInvoice.status}</span></div>
              <div><strong>CHANNEL:</strong> Autonomous AI Commerce Agent</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <strong style={{ fontSize: 13, color: '#475569', display: 'block', marginBottom: 8 }}>ITEMIZED BREAKDOWN</strong>
              {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                selectedInvoice.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                    <span>{item.product_name} x{item.quantity}</span>
                    <strong style={{ color: '#0f172a' }}>₹{((item.price_paise || 0) / 100).toLocaleString("en-IN")}</strong>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 13, color: '#64748b' }}>Standard Product Checkout Order</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, borderTop: '2px dashed #e2e8f0', paddingTop: 14, marginTop: 14 }}>
              <span>Total Amount</span>
              <span style={{ color: '#2563eb' }}>₹{selectedInvoice.total_amount_inr.toLocaleString("en-IN")}</span>
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button onClick={() => window.print()} style={{ flex: 1, padding: 10, background: '#0f172a', color: 'white', border: 0, borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                🖨️ Print Receipt
              </button>
              <button onClick={() => setSelectedInvoice(null)} style={{ padding: '10px 18px', background: '#f1f5f9', color: '#334155', border: 0, borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MERCHANT REVENUE INTELLIGENCE
========================================================= */

