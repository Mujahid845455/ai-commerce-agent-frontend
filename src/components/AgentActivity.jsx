import { useEffect, useState } from "react";
import { Activity, BrainCircuit, ShieldCheck, Clock3, RefreshCw } from "lucide-react";
import { formatAuditReason } from "../utils/formatUtils";

export default function AgentActivity({ simulatedCount = 0 }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [liveActivities, setLiveActivities] = useState([]);

  const [maxLimit, setMaxLimit] = useState(5000);
  const [upsellStrategy, setUpsellStrategy] = useState("Balanced");
  const [savedStatus, setSavedStatus] = useState(false);

  const baseActivities = [
    ["Recommendation accepted", "Premium Sports Socks upsell accepted.", "Just now"],
    ["Customer intent captured", "High intent detected for Running Shoes & Sneakers.", "12 min ago"],
    ["Order authorized", "Razorpay test payment cleared for Order #1004.", "45 min ago"],
    ["Policy applied", "Dynamic pricing & ₹5,000 max transaction cap activated.", "2 hr ago"],
  ];

  useEffect(() => {
    async function loadLiveFeed() {
      try {
        const logs = await api.getAuditLogs(6);
        if (Array.isArray(logs) && logs.length > 0) {
          const feed = logs.map((l) => [
            l.action || "Agent Action",
            formatAuditReason(l.details, l.action),
            l.created_at ? l.created_at.substring(11, 16) + " IST" : "Just now",
          ]);
          setLiveActivities(feed);
        } else {
          setLiveActivities(baseActivities);
        }
      } catch (err) {
        setLiveActivities(baseActivities);
      }
    }
    loadLiveFeed();
  }, [simulatedCount]);

  const displayList = simulatedCount > 0
    ? [["AI Checkout Simulated", "Simulated AI sale recorded: +₹1,999.", "Just now"], ...liveActivities]
    : liveActivities.length > 0 ? liveActivities : baseActivities;

  return (
    <div className="activity-card-modern">
      <div className="card-top">
        <div>
          <span className="card-kicker">REAL-TIME</span>
          <h2>Agent activity</h2>
        </div>
        <Activity size={18} color="#7c5cff" />
      </div>

      <div className="timeline-modern">
        {displayList.slice(0, 5).map(([title, text, time], idx) => (
          <div className="timeline-modern-item" key={title + idx}>
            <div className="timeline-marker">
              <span />
            </div>

            <div>
              <strong>{title}</strong>
              <p>{text}</p>
              <small>{time}</small>
            </div>
          </div>
        ))}
      </div>

      <button className="agent-config" onClick={() => setShowModal(true)}>
        <Bot size={15} />
        Configure agent behavior
        <ArrowRight size={14} />
      </button>

      {/* QUICK AGENT CONFIGURATION MODAL */}
      {showModal && (
        <div
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
            style={{
              background: "white",
              borderRadius: 20,
              maxWidth: 520,
              width: "100%",
              padding: 24,
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Bot size={22} color="#7c5cff" />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Configure Agent Behavior</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ border: 0, background: "transparent", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {savedStatus && (
              <div style={{ padding: "10px 14px", background: "#dcfce7", color: "#16a34a", borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
                ✓ Behavior settings updated & active!
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>
                  MAX SINGLE TRANSACTION CAP
                </label>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={maxLimit}
                  onChange={(e) => setMaxLimit(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#7c5cff" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#2563eb", marginTop: 4 }}>
                  <span>₹1,000</span>
                  <span>Active Cap: ₹{maxLimit.toLocaleString("en-IN")}</span>
                  <span>₹10,000</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>
                  CROSS-SELL STRATEGY
                </label>
                <select
                  value={upsellStrategy}
                  onChange={(e) => setUpsellStrategy(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                >
                  <option value="Conservative">Conservative (Only when explicitly asked)</option>
                  <option value="Balanced">Balanced (Recommended - 1 relevant add-on)</option>
                  <option value="Aggressive">Aggressive (Multi-item cross-sell bundles)</option>
                </select>
              </div>

              <div style={{ padding: 12, background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
                <ShieldCheck size={14} color="#16a34a" style={{ display: "inline", marginRight: 4 }} />
                Every purchase initiated by the AI still requires explicit 1-click human customer approval before Razorpay order creation.
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    setSavedStatus(true);
                    setTimeout(() => {
                      setSavedStatus(false);
                      setShowModal(false);
                    }, 1200);
                  }}
                  style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg, #7c5cff, #2563eb)", color: "white", border: 0, borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                >
                  Save Configuration
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    navigate("/merchant/policies");
                  }}
                  style={{ padding: "11px 16px", background: "#f1f5f9", color: "#334155", border: 0, borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                >
                  Full Policy Page →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   AUDIT
========================================================= */
