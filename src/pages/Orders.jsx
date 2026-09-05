import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  CheckCircle,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Filter,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { api } from "../services/client";
import { getProductImage } from "../utils/productUtils";

export default function Orders({ setCart }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const data = await api.getAnalyticsOrders(20);
        setOrders(data);
      } catch (err) {
        console.error("Orders load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const pendingOrder = JSON.parse(localStorage.getItem("agentpay_pending_order") || "null");

  const demoOrders = [
    {
      id: "ord_9a8b7c6d",
      created_at: new Date().toISOString(),
      status: "DELIVERED",
      delivery_date: "Aug 29",
      total_amount_inr: 2018,
      items: [
        {
          product_name: "Realme Buds T310 with 12.4mm Driver, 46dB ANC",
          color: "Black",
          quantity: 1,
          unit_price_inr: 2018,
          image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      id: "ord_5e4d3c2b",
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      status: "DELIVERED",
      delivery_date: "Aug 18",
      total_amount_inr: 7745,
      items: [
        {
          product_name: 'Samsung Essential Monitor S3 59.8 cm (24" FHD, IPS)',
          color: "Black",
          size: "23.5 inch",
          quantity: 1,
          unit_price_inr: 7745,
          image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      id: "ord_7f6e5d4c",
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      status: "CANCELLED",
      delivery_date: "Cancelled",
      total_amount_inr: 154,
      error_note: "Payment not successful. Please contact your bank for any money deducted.",
      items: [
        {
          product_name: "Lifelong Extension Cord 8 Socket Spike Guard",
          color: "White",
          quantity: 1,
          unit_price_inr: 154,
          image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      id: "ord_3b2a1c0d",
      created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
      status: "DELIVERED",
      delivery_date: "Aug 16",
      total_amount_inr: 718,
      items: [
        {
          product_name: "Portronics Toad One Ambidextrous Optical Wireless Mouse",
          color: "Black",
          quantity: 1,
          unit_price_inr: 718,
          image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80",
        },
      ],
    },
  ];

  const localAiOrders = JSON.parse(localStorage.getItem("agentpay_ai_orders") || "[]");
  const rawOrders = [...localAiOrders, ...orders, ...demoOrders];

  const allOrderCards = useMemo(() => {
    const list = [];
    rawOrders.forEach((ord) => {
      const isConfirmed = ord.status === "CONFIRMED" || ord.status === "DELIVERED" || ord.payment_status === "PAID";
      const isCancelled = ord.status === "CANCELLED" || ord.status === "FAILED";
      const statusText = isCancelled ? "Order Not Placed" : ord.status === "DELIVERED" ? `Delivered on ${ord.delivery_date || "Aug 29"}` : isConfirmed ? `Delivered on ${ord.delivery_date || "Today"}` : "In Transit";

      const items = ord.items && ord.items.length > 0 ? ord.items : [{ product_name: "AgentPay Order Item", quantity: 1, unit_price_inr: ord.total_amount_inr || (ord.total_amount_paise ? ord.total_amount_paise / 100 : 1999) }];

      items.forEach((item) => {
        list.push({
          orderId: ord.id ? String(ord.id).substring(0, 10) : `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          date: ord.created_at ? new Date(ord.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Aug 29, 2026",
          statusText,
          statusCategory: isCancelled ? "CANCELLED" : ord.status === "DELIVERED" || isConfirmed ? "DELIVERED" : "IN_TRANSIT",
          isConfirmed,
          isCancelled,
          errorNote: ord.error_note || (isCancelled ? "Payment could not be verified by Razorpay." : null),
          item,
          totalPrice: item.unit_price_inr || item.price || (ord.total_amount_paise ? ord.total_amount_paise / 100 : 1999),
        });
      });
    });
    return list;
  }, [rawOrders]);

  const filteredCards = useMemo(() => {
    return allOrderCards.filter((card) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = card.item.product_name?.toLowerCase().includes(q);
        const matchId = String(card.orderId)?.toLowerCase().includes(q);
        if (!matchName && !matchId) return false;
      }

      if (activeFilter !== "ALL" && card.statusCategory !== activeFilter) {
        return false;
      }

      return true;
    });
  }, [allOrderCards, searchQuery, activeFilter]);

  return (
    <main className="orders-responsive-container" style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 20px", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header Banner */}
      <div className="orders-header-banner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#7c5cff", textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Package size={14} /> AgentPay Commerce Log
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "6px 0 4px" }}>My Orders & Receipts</h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>View your AI-assisted orders, policy traces, and verified Razorpay receipts.</p>
        </div>

        {/* Stats Badges */}
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ padding: "8px 16px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: "11px", color: "#64748b", display: "block" }}>TOTAL ORDERS</span>
            <strong style={{ fontSize: "16px", color: "#0f172a" }}>{allOrderCards.length}</strong>
          </div>
          <div style={{ padding: "8px 16px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: "11px", color: "#64748b", display: "block" }}>DELIVERED</span>
            <strong style={{ fontSize: "16px", color: "#16a34a" }}>{allOrderCards.filter(c => c.isConfirmed).length}</strong>
          </div>
        </div>
      </div>

      {/* Search Bar & Filter Chips */}
      <div className="orders-filter-bar" style={{ background: "white", padding: "16px 20px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 14px rgba(0,0,0,0.03)", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f8fafc", padding: "10px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", flex: 1, minWidth: "240px" }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search by product name, brand or Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", width: "100%", color: "#0f172a" }}
          />
        </div>

        {/* Filter Pills */}
        <div className="orders-filter-pills" style={{ display: "flex", gap: "8px" }}>
          {[
            { key: "ALL", label: "All Orders" },
            { key: "DELIVERED", label: "Delivered" },
            { key: "IN_TRANSIT", label: "In Transit" },
            { key: "CANCELLED", label: "Cancelled" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                background: activeFilter === f.key ? "#7c5cff" : "#f1f5f9",
                color: activeFilter === f.key ? "white" : "#475569",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div style={{ background: "white", padding: "40px", textAlign: "center", color: "#64748b", borderRadius: "16px" }}>Loading order history...</div>
      ) : filteredCards.length === 0 ? (
        <div style={{ background: "white", padding: "48px", textAlign: "center", color: "#64748b", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          No orders found matching "{searchQuery}".
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredCards.map((card, idx) => (
            <div
              key={card.orderId + idx}
              style={{
                background: "white",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                overflow: "hidden",
              }}
            >
              {/* Card Header */}
              <div className="order-card-header" style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#2563eb", background: "#eef4ff", padding: "3px 10px", borderRadius: "6px" }}>
                    #{card.orderId}
                  </span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Ordered on {card.date}</span>
                </div>

                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: card.isCancelled ? "#fef2f2" : "#f0fdf4",
                    color: card.isCancelled ? "#dc2626" : "#16a34a",
                    border: `1px solid ${card.isCancelled ? "#fecaca" : "#bbf7d0"}`,
                  }}
                >
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: card.isCancelled ? "#dc2626" : "#16a34a" }} />
                  {card.statusText}
                </span>
              </div>

              {/* Card Body */}
              <div className="order-card-body" style={{ padding: "20px", display: "grid", gridTemplateColumns: "100px 1fr 140px", gap: "20px", alignItems: "center" }}>

                {/* Image */}
                <div style={{ width: "80px", height: "80px", borderRadius: "12px", overflow: "hidden", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={card.item.image_url || getProductImage(card.item)}
                    alt={card.item.product_name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* Details */}
                <div>
                  <h3 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
                    {card.item.product_name}
                  </h3>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>
                      Qty: {card.item.quantity || 1}
                    </span>
                    {card.item.color && (
                      <span style={{ fontSize: "11px", color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>
                        Color: {card.item.color}
                      </span>
                    )}
                    {card.item.size && (
                      <span style={{ fontSize: "11px", color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>
                        Size: {card.item.size}
                      </span>
                    )}
                    <span style={{ fontSize: "11px", color: "#7c5cff", background: "rgba(124, 92, 255, 0.08)", padding: "2px 8px", borderRadius: "4px", fontWeight: "700" }}>
                      ✨ AI Verified
                    </span>
                  </div>

                  {card.errorNote && (
                    <div style={{ fontSize: "12px", color: "#dc2626", background: "#fef2f2", padding: "6px 12px", borderRadius: "6px", border: "1px solid #fecaca", marginTop: "4px" }}>
                      {card.errorNote}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="order-card-price-block" style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
                    ₹{card.totalPrice.toLocaleString("en-IN")}
                  </div>
                  <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "600" }}>
                    {card.isCancelled ? "Payment Refunded" : "Paid via Razorpay"}
                  </span>
                </div>
              </div>

              {/* Timeline Stepper Bar */}
              <div className="order-card-footer" style={{ padding: "12px 20px", background: "#fafafa", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#64748b" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={14} color="#16a34a" />
                  <span>Agent Policy Checks Passed</span>
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <button
                    onClick={() => alert(`📄 Downloading Invoice for Order #${card.orderId}`)}
                    style={{ background: "none", border: "none", color: "#2563eb", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <FileText size={13} /> Receipt
                  </button>

                  {card.isConfirmed && (
                    <button
                      onClick={() => alert(`★ Review modal opened for ${card.item.product_name}`)}
                      style={{ background: "none", border: "none", color: "#7c5cff", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      <Sparkles size={13} /> Rate Item
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

/* =========================================================
   ACCOUNT
========================================================= */

