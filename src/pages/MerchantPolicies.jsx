import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle,
  Edit2,
  Lock,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  User,
  X,
  Zap,
} from "lucide-react";
import { api } from "../services/client";

export default function MerchantPolicies() {
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("agentpay_active_campaign") || "null");
    } catch {
      return null;
    }
  });

  const [campaignForm, setCampaignForm] = useState({
    title: "Low-Stock Inventory Surge Clearout",
    target: "Low-Stock Inventory (Stock <= 10)",
    strategy: "10% Instant Bundle Discount",
    budget: 20000,
  });

  // Load stored policy configuration
  const storedPolicy = (() => {
    try {
      return JSON.parse(localStorage.getItem("agentpay_policy_config") || "null");
    } catch {
      return null;
    }
  })();

  const [maxLimit, setMaxLimit] = useState(storedPolicy?.maxLimit || 5000);
  const [upsellStrategy, setUpsellStrategy] = useState(storedPolicy?.upsellStrategy || "Balanced");
  const [maxDiscount, setMaxDiscount] = useState(storedPolicy?.maxDiscount || 10);
  const [savedConfig, setSavedConfig] = useState(false);

  const [newTrigger, setNewTrigger] = useState("");
  const [newAction, setNewAction] = useState("");

  const [rules, setRules] = useState(storedPolicy?.rules || [
    { id: 1, trigger: "When Footwear selected", action: "Suggest Sports Socks or Hydration Bottle", status: "Active" },
    { id: 2, trigger: "When Laptop selected", action: "Suggest Laptop Bag or Wireless Mouse", status: "Active" },
    { id: 3, trigger: "When Smartphone selected", action: "Suggest Protective Case or Wireless Earbuds", status: "Active" },
    { id: 4, trigger: "Max Transaction Cap", action: "Reject any AI order exceeding configured limit", status: "Strict Enforcement" },
    { id: 5, trigger: "Low Stock Alert", action: "Prioritize clearing stock <= 5 items", status: "Active" },
  ]);

  function handleStartCampaign(e) {
    e.preventDefault();
    const config = {
      id: "cmp_" + Date.now(),
      title: campaignForm.title || "AI Growth Campaign",
      target: campaignForm.target,
      strategy: campaignForm.strategy,
      budget: campaignForm.budget,
      status: "RUNNING",
      pitchesCount: 18,
      conversionsCount: 6,
      revenueGeneratedInr: 11994,
      createdAt: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    setActiveCampaign(config);
    localStorage.setItem("agentpay_active_campaign", JSON.stringify(config));

    // Prepend rule
    setRules((prev) => [
      {
        id: Date.now(),
        trigger: `🚀 Campaign: ${config.title}`,
        action: `Pitch ${config.target} with ${config.strategy}`,
        status: "Active Campaign",
      },
      ...prev,
    ]);

    setShowCampaignModal(false);
  }

  function handleStopCampaign() {
    setActiveCampaign(null);
    localStorage.removeItem("agentpay_active_campaign");
  }

  function handleTogglePause() {
    if (!activeCampaign) return;
    const newStatus = activeCampaign.status === "RUNNING" ? "PAUSED" : "RUNNING";
    const updated = { ...activeCampaign, status: newStatus };
    setActiveCampaign(updated);
    localStorage.setItem("agentpay_active_campaign", JSON.stringify(updated));
  }

  function handleSaveBehavior(e) {
    e.preventDefault();

    const policyPayload = {
      maxLimit,
      upsellStrategy,
      maxDiscount,
      rules,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("agentpay_policy_config", JSON.stringify(policyPayload));

    setSavedConfig(true);
    setTimeout(() => setSavedConfig(false), 4000);
  }

  function handleAddRule(e) {
    e.preventDefault();
    if (!newTrigger.trim() || !newAction.trim()) return;

    const newRuleItem = {
      id: Date.now(),
      trigger: newTrigger.trim(),
      action: newAction.trim(),
      status: "Active",
    };

    const updatedRules = [...rules, newRuleItem];
    setRules(updatedRules);
    setNewTrigger("");
    setNewAction("");

    // Auto-persist rule additions
    const policyPayload = {
      maxLimit,
      upsellStrategy,
      maxDiscount,
      rules: updatedRules,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("agentpay_policy_config", JSON.stringify(policyPayload));
  }

  function handleDeleteRule(ruleId) {
    const updatedRules = rules.filter((r) => r.id !== ruleId);
    setRules(updatedRules);

    const policyPayload = {
      maxLimit,
      upsellStrategy,
      maxDiscount,
      rules: updatedRules,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("agentpay_policy_config", JSON.stringify(policyPayload));
  }

  function handleToggleRuleStatus(ruleId) {
    const updatedRules = rules.map((r) => {
      if (r.id === ruleId) {
        const nextStatus = r.status === "Active" ? "Paused" : r.status === "Paused" ? "Strict Enforcement" : "Active";
        return { ...r, status: nextStatus };
      }
      return r;
    });
    setRules(updatedRules);

    const policyPayload = {
      maxLimit,
      upsellStrategy,
      maxDiscount,
      rules: updatedRules,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("agentpay_policy_config", JSON.stringify(policyPayload));
  }

  return (
    <div className="policies-page">

      {/* Top Header */}
      <div className="policies-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#0f172a' }}>Campaign Orchestrator & Safety Policies</h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>Configure autonomous agent policies, spending bounds, and AI growth campaigns.</p>
        </div>

        <button
          className="primary-button policies-header-btn"
          onClick={() => setShowCampaignModal(true)}
          style={{ padding: '10px 20px', background: activeCampaign?.status === "RUNNING" ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #7c5cff, #2563eb)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(124, 92, 255, 0.25)' }}
        >
          <Sparkles size={16} /> {activeCampaign?.status === "RUNNING" ? "🟢 Campaign Running (Manage)" : "Launch AI Inventory Campaign"}
        </button>
      </div>

      {/* ACTIVE CAMPAIGN MONITOR BANNER */}
      {activeCampaign && (
        <div className="active-campaign-banner" style={{ background: activeCampaign.status === "RUNNING" ? "linear-gradient(135deg, #0f172a, #1e1b4b)" : "#1e293b", color: "white", padding: "24px", borderRadius: "16px", marginBottom: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid rgba(124, 92, 255, 0.3)" }}>
          <div className="campaign-banner-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: "16px" }}>
            <div className="campaign-title-wrap" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: activeCampaign.status === "RUNNING" ? "#10b981" : "#f59e0b", boxShadow: activeCampaign.status === "RUNNING" ? "0 0 10px #10b981" : "none" }} />
              <strong style={{ fontSize: "16px", fontWeight: "800" }}>ACTIVE CAMPAIGN: {activeCampaign.title}</strong>
              <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px", background: "rgba(255,255,255,0.15)", fontWeight: "700" }}>
                {activeCampaign.status}
              </span>
            </div>

            <div className="campaign-banner-actions" style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleTogglePause}
                style={{ padding: "6px 14px", background: "rgba(255,255,255,0.15)", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
              >
                {activeCampaign.status === "RUNNING" ? "⏸️ Pause" : "▶️ Resume"}
              </button>
              <button
                onClick={handleStopCampaign}
                style={{ padding: "6px 14px", background: "rgba(239,68,68,0.2)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "8px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
              >
                🔴 Stop Campaign
              </button>
            </div>
          </div>

          <div className="campaign-banner-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
            <div style={{ background: "rgba(255,255,255,0.06)", padding: "12px 16px", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>PITCHES GENERATED</span>
              <strong style={{ fontSize: "20px", color: "#7c5cff" }}>{activeCampaign.pitchesCount}</strong>
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", padding: "12px 16px", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>UPSELLS ACCEPTED</span>
              <strong style={{ fontSize: "20px", color: "#10b981" }}>{activeCampaign.conversionsCount}</strong>
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", padding: "12px 16px", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>REVENUE GENERATED</span>
              <strong style={{ fontSize: "20px", color: "#38bdf8" }}>₹{activeCampaign.revenueGeneratedInr.toLocaleString("en-IN")}</strong>
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", padding: "12px 16px", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>TARGET INVENTORY</span>
              <strong className="campaign-target-text" style={{ fontSize: "13px", color: "#e2e8f0", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeCampaign.target}</strong>
            </div>
          </div>
        </div>
      )}

      {savedConfig && (
        <div style={{ padding: '14px 18px', background: '#dcfce7', color: '#15803d', borderRadius: 12, marginBottom: 20, border: '1px solid #bbf7d0', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, boxShadow: "0 4px 12px rgba(16, 185, 129, 0.12)" }}>
          <CheckCircle size={18} color="#16a34a" />
          <span>✓ Agent Behavior Configuration saved successfully! Max Cap: <strong>₹{maxLimit.toLocaleString("en-IN")}</strong>. Live AI agents will immediately enforce these rules.</span>
        </div>
      )}

      {/* AGENT BEHAVIOR FORM */}
      <div style={{ background: 'white', padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bot size={18} color="#7c5cff" /> Configure AI Agent Behavior & Guardrails
        </h3>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Control how aggressively the AI agent searches products, pitches upsells, and caps transaction amounts.</p>

        <form onSubmit={handleSaveBehavior} className="policies-form-grid" style={{ marginTop: 20 }}>
          {/* DUAL EDITABLE MAX LIMIT INPUT */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
                Max Single Transaction Limit (Cap)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#2563eb' }}>₹</span>
                <input
                  type="number"
                  min="500"
                  max="50000"
                  step="100"
                  value={maxLimit}
                  onChange={(e) => setMaxLimit(Math.max(100, Number(e.target.value)))}
                  style={{ width: "90px", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: "800", color: "#2563eb", outline: "none" }}
                />
              </div>
            </div>

            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={Math.min(maxLimit, 20000)}
              onChange={(e) => setMaxLimit(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#7c5cff', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 4, fontWeight: 700, color: '#64748b' }}>
              <span>₹1,000</span>
              <span style={{ color: '#7c5cff', fontWeight: 800 }}>Active Cap: ₹{maxLimit.toLocaleString("en-IN")}</span>
              <span>₹20,000</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
              Cross-Sell Strategy
            </label>
            <select
              value={upsellStrategy}
              onChange={(e) => setUpsellStrategy(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            >
              <option value="Conservative">Conservative (Only when requested)</option>
              <option value="Balanced">Balanced (Recommended - 1 relevant add-on)</option>
              <option value="Aggressive">Aggressive (Multiple bundle offers)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
              Max AI Discount Authorization
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                min="0"
                max="20"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
              <span style={{ fontWeight: 700, fontSize: 14 }}>%</span>
            </div>
          </div>

          <div className="policies-form-save">
            <button
              type="submit"
              style={{ padding: '10px 22px', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer', fontSize: 13, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <ShieldCheck size={16} color="#38bdf8" /> Save Agent Behavior Configuration
            </button>
          </div>
        </form>
      </div>

      <div className="policies-two-col">
        {/* Safety Bounds Card */}
        <div className="policies-card" style={{ background: 'white', padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={18} color="#2563eb" /> Security & Bounded Rules
          </h3>
          <p style={{ fontSize: 13, color: '#64748b' }}>Every money action initiated by the AI is strictly bounded and requires explicit user confirmation.</p>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: 13, display: 'block' }}>Max Single Transaction Limit</strong>
                <span style={{ fontSize: 11, color: '#64748b' }}>Orders exceeding this fail gracefully with a 403 error.</span>
              </div>
              <span style={{ fontWeight: 800, color: '#2563eb', fontSize: 15 }}>₹{maxLimit.toLocaleString("en-IN")}</span>
            </div>

            <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: 13, display: 'block' }}>Human Approval Gate</strong>
                <span style={{ fontSize: 11, color: '#64748b' }}>User must explicitly click "Pay Now" modal.</span>
              </div>
              <span style={{ fontWeight: 700, color: '#16a34a', fontSize: 12, background: '#dcfce7', padding: '2px 8px', borderRadius: 4 }}>ENFORCED</span>
            </div>
          </div>
        </div>

        {/* Campaign Rules Card */}
        <div className="policies-card" style={{ background: 'white', padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={18} color="#7c5cff" /> Active Agent Rules & Custom Triggers
          </h3>
          <p style={{ fontSize: 13, color: '#64748b' }}>Rules evaluated by the AI model during customer intent analysis.</p>

          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
            {rules.map((r) => (
              <div key={r.id} className="policy-rule-item" style={{ padding: 10, border: '1px solid #f1f5f9', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="rule-trigger-text" style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.trigger}</div>
                  <div className="rule-action-text" style={{ fontSize: 11, color: '#64748b', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>↳ {r.action}</div>
                </div>

                <div className="policy-rule-actions" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => handleToggleRuleStatus(r.id)}
                    style={{ fontSize: 10, fontWeight: 700, border: "none", cursor: "pointer", color: r.status.includes("Campaign") ? "#16a34a" : r.status === "Paused" ? "#64748b" : "#2563eb", background: r.status.includes("Campaign") ? "#dcfce7" : r.status === "Paused" ? "#f1f5f9" : "#eef4ff", padding: '3px 8px', borderRadius: 4 }}
                    title="Click to toggle status"
                  >
                    {r.status}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteRule(r.id)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px" }}
                    title="Delete rule"
                  >
                    <Trash2 size={13} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddRule} className="add-rule-form" style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input
              type="text"
              placeholder="When [Trigger e.g. Laptop]..."
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              style={{ flex: 1, padding: '7px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #cbd5e1', outline: "none" }}
            />
            <input
              type="text"
              placeholder="Suggest [Action e.g. Free Bag]..."
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              style={{ flex: 1, padding: '7px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #cbd5e1', outline: "none" }}
            />
            <button
              type="submit"
              style={{ padding: '7px 14px', background: '#7c5cff', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: "nowrap" }}
            >
              Add Rule
            </button>
          </form>
        </div>
      </div>

      {/* LAUNCH CAMPAIGN POPUP MODAL */}
      {showCampaignModal && (
        <div
          className="campaign-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            className="campaign-modal-inner"
            style={{
              background: "white",
              borderRadius: 20,
              maxWidth: 540,
              width: "100%",
              padding: 28,
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Sparkles size={22} color="#7c5cff" />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Launch AI Inventory Campaign</h3>
              </div>
              <button
                onClick={() => setShowCampaignModal(false)}
                style={{ border: 0, background: "transparent", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleStartCampaign} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>
                  CAMPAIGN TITLE
                </label>
                <input
                  type="text"
                  value={campaignForm.title}
                  onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>
                  TARGET INVENTORY CATEGORY
                </label>
                <select
                  value={campaignForm.target}
                  onChange={(e) => setCampaignForm({ ...campaignForm, target: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                >
                  <option value="Low-Stock Inventory (Stock <= 10)">🔥 Low-Stock Inventory Clearance (Stock &lt;= 10)</option>
                  <option value="High Margin Electronics">⚡ High Margin Electronics Upsell</option>
                  <option value="Sports & Active Accessories">🎒 Sports &amp; Active Accessories Bundle</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>
                  AI PITCH & DISCOUNT STRATEGY
                </label>
                <select
                  value={campaignForm.strategy}
                  onChange={(e) => setCampaignForm({ ...campaignForm, strategy: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                >
                  <option value="10% Instant Bundle Discount">10% Instant Bundle Discount</option>
                  <option value="Free Express Shipping Add-On">Free Express Shipping Add-On</option>
                  <option value="Buy 1 Get 1 Accessory 50% Off">Buy 1 Get 1 Accessory 50% Off</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>
                  CAMPAIGN BUDGET / DISCOUNT CAP
                </label>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="2500"
                  value={campaignForm.budget}
                  onChange={(e) => setCampaignForm({ ...campaignForm, budget: Number(e.target.value) })}
                  style={{ width: "100%", accentColor: "#7c5cff" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#2563eb", marginTop: 4 }}>
                  <span>₹5,000</span>
                  <span>Cap: ₹{campaignForm.budget.toLocaleString("en-IN")}</span>
                  <span>₹50,000</span>
                </div>
              </div>

              <div className="campaign-modal-buttons" style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <button
                  type="submit"
                  style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #7c5cff, #2563eb)", color: "white", border: 0, borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 }}
                >
                  🚀 Launch Campaign Now
                </button>
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  style={{ padding: "12px 18px", background: "#f1f5f9", color: "#334155", border: 0, borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PLACEHOLDER
========================================================= */

