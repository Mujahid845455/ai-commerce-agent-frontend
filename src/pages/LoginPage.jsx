import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CreditCard,
  FileCheck2,
  Key,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";
import { api } from "../services/client";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    if (loading) return;

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await api.login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 15% 15%, #1e1b4b 0%, #0f172a 45%, #020617 100%)",
        padding: "24px 16px",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        color: "#f8fafc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorative Mesh Glows */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "20%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(124, 92, 255, 0.18) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "15%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="login-responsive-container"
        style={{
          width: "100%",
          maxWidth: "1160px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "32px",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        {/* LEFT PANEL: APP SHOWCASE & HERO HIGHLIGHTS */}
        <div className="login-showcase-panel" style={{ padding: "16px 8px" }}>
          {/* Tag Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: "20px",
              background: "rgba(124, 92, 255, 0.15)",
              border: "1px solid rgba(124, 92, 255, 0.3)",
              color: "#a78bfa",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              marginBottom: "20px",
            }}
          >
            <Sparkles size={14} color="#c084fc" />
            <span>AI GROWTH & AGENTIC COMMERCE INFRASTRUCTURE</span>
          </div>

          <h1
            className="login-hero-heading"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              margin: "0 0 16px 0",
              background: "linear-gradient(135deg, #ffffff 30%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            The Future of E-Commerce is <span style={{ background: "linear-gradient(135deg, #c084fc, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Agentic.</span>
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "#94a3b8",
              lineHeight: 1.6,
              maxWidth: "520px",
              marginBottom: "32px",
            }}
          >
            AgentPay bridges merchant catalog intelligence with conversational AI, enabling Gemini-powered product discovery, policy-bounded checkouts, and instant Razorpay payment verification.
          </p>

          {/* Feature Showcase Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "14px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(124, 92, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#c084fc",
                  marginBottom: 10,
                }}
              >
                <Bot size={18} />
              </div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
                Conversational Discovery
              </h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: 1.45 }}>
                Natural language search across 1,100+ products with tokenized word fallbacks.
              </p>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(16, 185, 129, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#34d399",
                  marginBottom: 10,
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
                Bounded Spend Guardrails
              </h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: 1.45 }}>
                Strict ₹5,000 policy caps with real-time stock checks & audit logging.
              </p>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(59, 130, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#60a5fa",
                  marginBottom: 10,
                }}
              >
                <FileCheck2 size={18} />
              </div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
                5-Step Decision Tracing
              </h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: 1.45 }}>
                Transparent explainable decision timelines for every AI interaction.
              </p>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(245, 158, 11, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fbbf24",
                  marginBottom: 10,
                }}
              >
                <CreditCard size={18} />
              </div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
                Razorpay Payment Gate
              </h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: 1.45 }}>
                Explicit human-in-the-loop approval before any order verification.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#f8fafc" }}>1,100+</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Catalog Products</div>
            </div>
            <div style={{ width: "1px", background: "rgba(255,255,255,0.1)" }} />
            <div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#a78bfa" }}>₹5,000</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Max Policy Cap</div>
            </div>
            <div style={{ width: "1px", background: "rgba(255,255,255,0.1)" }} />
            <div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#34d399" }}>100%</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Auditable Traces</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: SLEEK LOGIN FORM CARD (MATCHING DARK SHOWCASE BACKGROUND) */}
        <section
          className="login-card-section"
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "28px",
            padding: "36px 32px",
            boxShadow: "0 25px 70px rgba(0,0,0,0.5)",
            color: "#f8fafc",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div className="brand-logo">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="brand-title" style={{ color: "#ffffff" }}>
                Agent<span style={{ color: "#60a5fa" }}>Pay</span>
              </div>
              <div className="brand-caption" style={{ color: "#94a3b8" }}>AI commerce infrastructure</div>
            </div>
          </div>

          <div className="section-kicker" style={{ color: "#c084fc", fontWeight: 700, fontSize: "11px", letterSpacing: "1px", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <ShieldCheck size={14} color="#c084fc" />
            SECURE SIGN IN
          </div>

          <h2 style={{ margin: "0 0 6px 0", fontSize: "24px", fontWeight: 800, color: "#ffffff" }}>
            Welcome back.
          </h2>
          <p style={{ marginBottom: 24, color: "#94a3b8", fontSize: "14px", lineHeight: 1.5 }}>
            Sign in to continue to your AgentPay AI commerce workspace.
          </p>

          <form onSubmit={handleLogin}>
            {/* Quick Demo Login Fill Buttons */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.5px" }}>
                1-CLICK DEMO CREDENTIALS:
              </div>
              <div className="login-demo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("customer@agentpay.demo");
                    setPassword("Customer@123");
                  }}
                  style={{
                    padding: "10px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 12,
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#f8fafc",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.2s ease"
                  }}
                >
                  <User size={14} color="#c084fc" />
                  Demo Customer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("merchant@agentpay.demo");
                    setPassword("Merchant@123");
                  }}
                  style={{
                    padding: "10px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 12,
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#f8fafc",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.2s ease"
                  }}
                >
                  <ShoppingBag size={14} color="#60a5fa" />
                  Demo Merchant
                </button>
              </div>
            </div>

            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 6,
                color: "#cbd5e1",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@agentpay.demo"
              autoComplete="email"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 12,
                marginBottom: 16,
                outline: "none",
                fontSize: "14px",
                color: "#ffffff",
                background: "rgba(255, 255, 255, 0.05)",
              }}
            />

            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 6,
                color: "#cbd5e1",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 12,
                marginBottom: 16,
                outline: "none",
                fontSize: "14px",
                color: "#ffffff",
                background: "rgba(255, 255, 255, 0.05)",
              }}
            />

            {error && (
              <div
                style={{
                  marginBottom: 16,
                  padding: 12,
                  borderRadius: 12,
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="primary-button full-width"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px 20px",
                fontSize: "14px",
                fontWeight: 700,
                borderRadius: 12,
                background: "linear-gradient(135deg, #7c5cff, #2563eb)",
                color: "white",
                border: 0,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(124, 92, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: 20,
              padding: "12px 14px",
              borderRadius: 12,
              background: "#f1f5f9",
              fontSize: 12,
              color: "#64748b",
              lineHeight: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ShieldCheck size={16} color="#7c5cff" style={{ flexShrink: 0 }} />
            <span>Payments run in <strong>Razorpay Test Mode</strong>. No real money is charged.</span>
          </div>
        </section>
      </div>
    </main>
  );
}

