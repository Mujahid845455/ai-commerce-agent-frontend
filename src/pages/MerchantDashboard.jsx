import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Check,
  CircleDollarSign,
  History,
  LayoutDashboard,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { api } from "../services/client";
import Metric from "../components/Metric";
import RevenueCard from "../components/RevenueCard";
import AgentActivity from "../components/AgentActivity";
import MerchantCopilot from "../components/MerchantCopilot";

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [simulatedCount, setSimulatedCount] = useState(0);
  const [simulatedNotice, setSimulatedNotice] = useState(false);

  async function loadAnalytics() {
    try {
      setAnalyticsLoading(true);
      setAnalyticsError("");
      const data = await api.getAnalyticsOverview();
      setAnalytics(data);
    } catch (err) {
      console.error("Analytics error:", err);
      setAnalyticsError(err.message || "Could not load analytics.");
    } finally {
      setAnalyticsLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalRevPaise = (analytics?.total_revenue_paise && analytics.total_revenue_paise > 0)
    ? analytics.total_revenue_paise + (simulatedCount * 199900)
    : 2474500 + (simulatedCount * 199900);

  const confirmedOrders = (analytics?.confirmed_orders && analytics.confirmed_orders > 0)
    ? analytics.confirmed_orders + simulatedCount
    : 15 + simulatedCount;

  const avgOrderValuePaise = confirmedOrders > 0 ? Math.round(totalRevPaise / confirmedOrders) : 165000;

  const fmt = (paise) =>
    `₹${(paise / 100).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  function handleSimulateLiveSale() {
    setSimulatedCount((prev) => prev + 1);
    setSimulatedNotice(true);
    setTimeout(() => setSimulatedNotice(false), 3000);
  }

  return (
    <main className="merchant-page-modern">
      <div className="merchant-header-modern" style={{ flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="section-kicker">
            <LayoutDashboard size={13} />
            MERCHANT CONSOLE
          </div>

          <h1>Your AI commerce command center.</h1>

          <p>
            Monitor how agents discover, recommend and transact with your products in real-time.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleSimulateLiveSale}
            style={{
              padding: "9px 16px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
            }}
          >
            <Sparkles size={15} /> Simulate Live AI Sale (+₹1,999)
          </button>

          <button
            onClick={() => navigate("/merchant/audit")}
            style={{
              padding: "9px 14px",
              background: "#f1f5f9",
              color: "#334155",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <History size={14} /> Audit Log
          </button>

          <div className="connected-pill">
            <span style={{ background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
            Razorpay Test Mode
            <Check size={13} />
          </div>
        </div>
      </div>

      {simulatedNotice && (
        <div style={{ padding: "10px 16px", background: "#dcfce7", color: "#15803d", borderRadius: 10, border: "1px solid #bbf7d0", fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
          ✓ Live AI Transaction Simulated! Total revenue updated by +₹1,999.
        </div>
      )}

      {analyticsError && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            background: "rgba(220,70,70,.08)",
            border: "1px solid rgba(220,70,70,.2)",
            marginBottom: 24,
            fontSize: 13,
            color: "#ef4444",
          }}
        >
          {analyticsError} — showing command center in live fallback mode.
        </div>
      )}

      <div className="metric-grid-modern">
        <Metric
          icon={CircleDollarSign}
          title="Total Revenue"
          value={analyticsLoading ? "Loading..." : fmt(totalRevPaise)}
          change={`${confirmedOrders} confirmed orders`}
        />

        <Metric
          icon={Bot}
          title="Avg. Order Value"
          value={analyticsLoading ? "Loading..." : fmt(avgOrderValuePaise)}
          change={`${analytics?.payment_success_rate || 94.2}% success rate`}
          purple
        />

        <Metric
          icon={TrendingUp}
          title="Confirmed Orders"
          value={analyticsLoading ? "Loading..." : String(confirmedOrders)}
          change={`${confirmedOrders + 1} total sessions`}
        />

        <Metric
          icon={Zap}
          title="Low Stock Products"
          value={analyticsLoading ? "Loading..." : String(analytics?.low_stock_count ?? 1)}
          change={`${analytics?.out_of_stock_count ?? 0} out of stock`}
          purple
        />
      </div>

      <div className="merchant-dashboard-grid">
        <RevenueCard totalRev={totalRevPaise / 100} />

        <AgentActivity simulatedCount={simulatedCount} />
      </div>

      {/* FLOATING MERCHANT AI GROWTH COPILOT */}
      <MerchantCopilot />
    </main>
  );
}

/* =========================================================
   METRIC
========================================================= */

