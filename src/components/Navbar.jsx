import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BrainCircuit,
  ChevronRight,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { api } from "../services/client";

export default function Navbar({ cartCount, mode, setMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const customerLinks = [
    {
      label: "AI Shopping",
      path: "/",
      icon: Sparkles,
    },
    {
      label: "Orders",
      path: "/orders",
      icon: Package,
    },
    {
      label: "Cart",
      path: "/cart",
      icon: ShoppingCart,
      count: cartCount,
    },
    {
      label: "Account",
      path: "/account",
      icon: User,
    },
  ];

  const merchantLinks = [
    {
      label: "Overview",
      path: "/merchant",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/merchant/products",
      icon: Package,
    },
    {
      label: "Orders",
      path: "/merchant/orders",
      icon: ShoppingBag,
    },
    {
      label: "AI Transcripts",
      path: "/merchant/recommendations",
      icon: BrainCircuit,
    },
    {
      label: "Revenue",
      path: "/merchant/revenue",
      icon: TrendingUp,
    },
    {
      label: "Policies",
      path: "/merchant/policies",
      icon: ShieldCheck,
    },
    {
      label: "Audit",
      path: "/merchant/audit",
      icon: History,
    },
  ];

  const links = mode === "customer" ? customerLinks : merchantLinks;

  return (
    <header className="topbar">
      <div
        className="brand"
        onClick={() => navigate(mode === "customer" ? "/" : "/merchant")}
      >
        <div className="brand-logo">
          <Sparkles size={18} />
        </div>

        <div>
          <div className="brand-title">
            Agent<span>Pay</span>
          </div>

          <div className="brand-caption">AI commerce infrastructure</div>
        </div>
      </div>

      <nav className="main-nav">
        {links.map((item) => {
          const Icon = item.icon;

          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

          return (
            <button
              key={item.path}
              className={`nav-item ${active ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={15} />
              <span>{item.label}</span>

              {item.count > 0 && (
                <span className="nav-count">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="topbar-right">
        <div className="environment-pill">
          <span className="status-dot" />
          TEST MODE
        </div>

        <div className="mode-toggle">
          <button
            className={mode === "customer" ? "active" : ""}
            onClick={() => {
              setMode("customer");
              navigate("/");
            }}
          >
            Customer
          </button>

          <button
            className={mode === "merchant" ? "active" : ""}
            onClick={() => {
              setMode("merchant");
              navigate("/merchant");
            }}
          >
            Merchant
          </button>
        </div>

        <div className="security-icon" title="Security & Spend Policy Active">
          <ShieldCheck size={16} />
        </div>

        <div
          className="user-avatar"
          onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
          title="Click for Profile & Pages Menu"
        >
          {mode === "customer" ? "C" : "M"}
        </div>
      </div>

      {/* MOBILE DROP DOWN MENU ON USER AVATAR CLICK */}
      {avatarMenuOpen && (
        <div
          className="mobile-avatar-dropdown"
          style={{
            position: "fixed",
            top: 56,
            right: 10,
            width: 250,
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
            border: "1px solid #e2e8f0",
            zIndex: 10000,
            padding: 14,
            fontFamily: "Inter, system-ui, sans-serif",
            color: "#0f172a",
          }}
        >
          {/* User Badge Info */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, borderBottom: "1px solid #f1f5f9", marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7c5cff, #2563eb)", color: "white", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12 }}>
              {mode === "customer" ? "C" : "M"}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
                {mode === "customer" ? "Demo Customer" : "Demo Merchant"}
              </div>
              <div style={{ fontSize: 10, color: "#64748b" }}>
                {mode === "customer" ? "customer@agentpay.demo" : "merchant@agentpay.demo"}
              </div>
            </div>
          </div>

          {/* Mode Switcher inside Menu */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>WORKSPACE MODE</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, background: "#f8fafc", padding: 3, borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <button
                onClick={() => {
                  setMode("customer");
                  setAvatarMenuOpen(false);
                  navigate("/");
                }}
                style={{ padding: "5px", fontSize: 10, fontWeight: 700, border: 0, borderRadius: 6, cursor: "pointer", background: mode === "customer" ? "#7c5cff" : "transparent", color: mode === "customer" ? "white" : "#64748b" }}
              >
                Customer
              </button>
              <button
                onClick={() => {
                  setMode("merchant");
                  setAvatarMenuOpen(false);
                  navigate("/merchant");
                }}
                style={{ padding: "5px", fontSize: 10, fontWeight: 700, border: 0, borderRadius: 6, cursor: "pointer", background: mode === "merchant" ? "#2563eb" : "transparent", color: mode === "merchant" ? "white" : "#64748b" }}
              >
                Merchant
              </button>
            </div>
          </div>

          {/* List of All Pages */}
          <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>ALL PAGES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { label: "💬 AI Assistant (Chat)", path: "/" },
              { label: "🛍️ Products Catalog", path: "/merchant/products" },
              { label: "📦 My Orders & Receipts", path: "/orders" },
              { label: "📋 AI Transcripts & Audit", path: "/merchant/audit" },
              { label: "📈 Revenue Analytics", path: "/merchant/revenue" },
              { label: "⚙️ Policy Rules", path: "/merchant/policies" },
            ].map((p) => (
              <button
                key={p.path}
                onClick={() => {
                  navigate(p.path);
                  setAvatarMenuOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "7px 9px",
                  textAlign: "left",
                  background: location.pathname === p.path ? "#eef4ff" : "transparent",
                  color: location.pathname === p.path ? "#2563eb" : "#334155",
                  border: 0,
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{p.label}</span>
                <ChevronRight size={13} color="#94a3b8" />
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setAvatarMenuOpen(false);
              api.logout();
              navigate("/login");
            }}
            style={{ width: "100%", marginTop: 8, padding: "7px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <LogOut size={12} /> Sign Out Workspace
          </button>
        </div>
      )}
    </header>
  );
}
