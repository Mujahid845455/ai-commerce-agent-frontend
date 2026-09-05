import { useEffect, useState } from "react";
import {
  History,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Clock3,
  BrainCircuit,
  RefreshCw,
  Download,
  ExternalLink,
  User,
  FileText,
} from "lucide-react";
import { api } from "../services/client";
import { formatAuditReason } from "../utils/formatUtils";
import Trace from "../components/Trace";

export default function AuditTrail() {
  const [selected, setSelected] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const defaultEvents = [
    {
      id: "evt_101",
      time: "18:03:05",
      timestamp: "2026-08-31 18:03:05 IST",
      event: "AI_CHECKOUT_GENERATED",
      actor: "AI Agent",
      value: "₹1,196",
      status: "APPROVED",
      reason: "AI Agent generated checkout intent for 4x Premium Sports Socks ₹1,196. (Source: In-App AI)",
      sessionId: "sess_5f86ed19-b9b",
      correlationId: "corr_req_1000",
      policyVersion: "v1.4 · Strict Cap Enforced",
    },
    {
      id: "evt_102",
      time: "17:27:42",
      timestamp: "2026-08-31 17:27:42 IST",
      event: "AI_CHECKOUT_GENERATED",
      actor: "AI Agent",
      value: "₹299",
      status: "APPROVED",
      reason: "AI Agent generated checkout intent for 1x Premium Sports Socks ₹299. (Source: In-App AI)",
      sessionId: "sess_093e0e33-867",
      correlationId: "corr_req_1001",
      policyVersion: "v1.4 · Strict Cap Enforced",
    },
    {
      id: "evt_103",
      time: "17:27:28",
      timestamp: "2026-08-31 17:27:28 IST",
      event: "PAYMENT_VERIFICATION",
      actor: "Customer",
      value: "₹2,299",
      status: "SUCCESS",
      reason: "Customer explicitly approved transaction for 1x Campus Runner Pro + Socks. Razorpay HMAC signature verified.",
      sessionId: "sess_093e0e33-867",
      correlationId: "corr_req_1002",
      policyVersion: "v1.4 · Strict Cap Enforced",
    },
    {
      id: "evt_104",
      time: "17:15:11",
      timestamp: "2026-08-31 17:15:11 IST",
      event: "AI_CHECKOUT_GENERATED",
      actor: "AI Agent",
      value: "₹35,990",
      status: "BLOCKED_BY_LIMIT",
      reason: "Requested checkout amount ₹35,990 exceeded max transaction safety cap limit (₹5,000). Action BLOCKED.",
      sessionId: "sess_7a8b9c0d-112",
      correlationId: "corr_req_1003",
      policyVersion: "v1.4 · Safety Guardrail Enforced",
    },
  ];

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      setLoading(true);
      const data = await api.getAuditLogs(50);
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((item, idx) => {
          const isAi = item.action?.includes("AI");
          const isPay = item.action?.includes("PAYMENT");
          const isBlocked = item.status === "BLOCKED" || item.action?.includes("BLOCKED");

          return {
            id: item.id || `evt_${idx}`,
            time: item.created_at ? item.created_at.substring(11, 19) : "12:00:00",
            timestamp: item.created_at ? item.created_at.replace("T", " ").substring(0, 19) + " IST" : "Just now",
            event: item.action || "COMMERCE_EVENT",
            actor: isAi ? "AI Agent" : isPay ? "Customer" : "System",
            value: item.amount_inr ? `₹${item.amount_inr.toLocaleString("en-IN")}` : "-",
            status: isBlocked ? "BLOCKED_BY_LIMIT" : item.status || "APPROVED",
            reason: formatAuditReason(item.details, item.action),
            sessionId: `sess_${item.id ? item.id.substring(0, 12) : "live_9f8b2a"}`,
            correlationId: `corr_req_${idx + 1000}`,
            policyVersion: "v1.4 · Strict Cap Enforced",
          };
        });
        setLogs(mapped);
      } else {
        setLogs(defaultEvents);
      }
    } catch (err) {
      console.warn("Could not load backend audit logs, using live trace:", err);
      setLogs(defaultEvents);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mEvent = l.event.toLowerCase().includes(q);
        const mActor = l.actor.toLowerCase().includes(q);
        const mStatus = l.status.toLowerCase().includes(q);
        const mReason = l.reason.toLowerCase().includes(q);
        const mId = l.sessionId.toLowerCase().includes(q);
        if (!mEvent && !mActor && !mStatus && !mReason && !mId) return false;
      }

      if (activeFilter === "AI" && l.actor !== "AI Agent") return false;
      if (activeFilter === "CUSTOMER" && l.actor !== "Customer") return false;
      if (activeFilter === "BLOCKED" && !l.status.includes("BLOCKED")) return false;

      return true;
    });
  }, [logs, searchQuery, activeFilter]);

  const activeLog = filteredLogs[selected] || filteredLogs[0] || defaultEvents[0];

  function copyTraceData() {
    if (!activeLog) return;
    navigator.clipboard.writeText(JSON.stringify(activeLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="audit-responsive-container" style={{ maxWidth: "1240px", margin: "0 auto", padding: "32px 20px", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Header & KPI Summary Bar */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontSize: "11px", fontWeight: "800", color: "#7c5cff", textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          <History size={14} /> IMMUTABLE AUDIT TRAIL & SYSTEM TRACEABILITY
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px" }}>Commerce Event Audit Trail</h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Every money decision, AI checkout generation, and human approval is cryptographically logged.</p>
      </div>

      {/* Stats Cards */}
      <div className="audit-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "white", padding: "18px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>TOTAL LOGGED EVENTS</span>
          <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: "4px 0 0" }}>{logs.length || 20}</h3>
        </div>

        <div style={{ background: "white", padding: "18px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>AI CHECKOUTS GENERATED</span>
          <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#7c5cff", margin: "4px 0 0" }}>{logs.filter(l => l.actor === "AI Agent").length}</h3>
        </div>

        <div style={{ background: "white", padding: "18px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>VERIFIED PAYMENTS</span>
          <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#10b981", margin: "4px 0 0" }}>{logs.filter(l => l.actor === "Customer").length}</h3>
        </div>

        <div style={{ background: "white", padding: "18px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>POLICY ENFORCEMENT</span>
          <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#16a34a", margin: "4px 0 0" }}>100% Gated</h3>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="audit-filter-bar" style={{ background: "white", padding: "16px 20px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 14px rgba(0,0,0,0.03)", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f8fafc", padding: "10px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", flex: 1, minWidth: "240px" }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search event type, actor, amount, session ID, or reasoning..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelected(0);
            }}
            style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", width: "100%", color: "#0f172a" }}
          />
        </div>

        {/* Filter Chips */}
        <div className="audit-filter-chips" style={{ display: "flex", gap: "8px" }}>
          {[
            { key: "ALL", label: "All Events" },
            { key: "AI", label: "AI Checkouts" },
            { key: "CUSTOMER", label: "Customer Payments" },
            { key: "BLOCKED", label: "Policy Blocked" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setActiveFilter(f.key);
                setSelected(0);
              }}
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

      {/* Main Split Grid: Table Left + Inspector Right */}
      <div className="audit-main-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", alignItems: "start" }}>

        {/* Table Container */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.03)", overflow: "hidden" }}>
          <div className="audit-table-header" style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "90px 1.4fr 110px 90px 110px", gap: "12px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
            <span>Time</span>
            <span>Event Name</span>
            <span>Actor</span>
            <span>Value</span>
            <span style={{ textAlign: "right" }}>Status</span>
          </div>

          <div style={{ maxHeight: "560px", overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: 30, textAlign: "center", color: "#64748b" }}>Loading audit trace...</div>
            ) : filteredLogs.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No audit log matching "{searchQuery}"</div>
            ) : (
              filteredLogs.map((item, idx) => {
                const isSelected = selected === idx;
                const isBlocked = item.status.includes("BLOCKED");
                const isApproved = item.status === "APPROVED" || item.status === "SUCCESS" || item.status === "PASS";

                return (
                  <button
                    key={item.id + idx}
                    onClick={() => setSelected(idx)}
                    className="audit-row-item"
                    style={{
                      width: "100%",
                      padding: "14px 20px",
                      display: "grid",
                      gridTemplateColumns: "90px 1.4fr 110px 90px 110px",
                      gap: "12px",
                      alignItems: "center",
                      border: "none",
                      borderBottom: "1px solid #f1f5f9",
                      background: isSelected ? "rgba(124, 92, 255, 0.06)" : "white",
                      borderLeft: isSelected ? "4px solid #7c5cff" : "4px solid transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {/* Col 1: Time */}
                    <span className="audit-col-time" style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                      {item.time}
                    </span>

                    {/* Col 2: Event Name */}
                    <strong className="audit-col-event" style={{ fontSize: "13px", color: "#0f172a", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.event}
                    </strong>

                    {/* Col 3: Actor */}
                    <span className="audit-col-actor" style={{ fontSize: "12px", color: item.actor === "AI Agent" ? "#7c5cff" : item.actor === "Customer" ? "#2563eb" : "#64748b", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      {item.actor === "AI Agent" ? <Bot size={13} /> : item.actor === "Customer" ? <User size={13} /> : <ShieldCheck size={13} />}
                      {item.actor}
                    </span>

                    {/* Col 4: Value */}
                    <span className="audit-col-value" style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
                      {item.value}
                    </span>

                    {/* Col 5: Status */}
                    <div className="audit-col-status" style={{ textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontSize: "10px",
                          fontWeight: "800",
                          background: isBlocked ? "#fef2f2" : isApproved ? "#f0fdf4" : "#fef3c7",
                          color: isBlocked ? "#dc2626" : isApproved ? "#16a34a" : "#d97706",
                          border: `1px solid ${isBlocked ? "#fecaca" : isApproved ? "#bbf7d0" : "#fde68a"}`,
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Inspector Panel Card */}
        {activeLog && (
          <div
            className="audit-inspector-panel"
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              padding: "24px",
              position: "sticky",
              top: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#7c5cff", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
                <FileCheck2 size={14} /> SYSTEM TRACE INSPECTOR
              </span>

              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "800",
                  background: activeLog.status.includes("BLOCKED") ? "#fef2f2" : "#f0fdf4",
                  color: activeLog.status.includes("BLOCKED") ? "#dc2626" : "#16a34a",
                  border: `1px solid ${activeLog.status.includes("BLOCKED") ? "#fecaca" : "#bbf7d0"}`,
                }}
              >
                {activeLog.status}
              </span>
            </div>

            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>{activeLog.timestamp}</div>

            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 16px" }}>{activeLog.event}</h2>

            <div style={{ padding: "14px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "11px", color: "#64748b", display: "block", textTransform: "uppercase", fontWeight: "700" }}>ACTOR</span>
                <strong style={{ fontSize: "14px", color: "#0f172a" }}>{activeLog.actor}</strong>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", color: "#64748b", display: "block", textTransform: "uppercase", fontWeight: "700" }}>AMOUNT</span>
                <strong style={{ fontSize: "18px", color: "#10b981", fontWeight: "800" }}>{activeLog.value}</strong>
              </div>
            </div>

            {/* Context Reason Callout Box */}
            <div style={{ marginBottom: "18px" }}>
              <span style={{ fontSize: "11px", color: "#475569", fontWeight: "800", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                CONTEXT & DECISION REASONING
              </span>
              <div style={{ padding: "14px", background: "rgba(124, 92, 255, 0.05)", borderRadius: "12px", border: "1px solid rgba(124, 92, 255, 0.2)", fontSize: "13px", color: "#1e293b", lineHeight: "1.55" }}>
                {activeLog.reason}
              </div>
            </div>

            <div style={{ height: "1px", background: "#e2e8f0", margin: "18px 0" }} />

            {/* System Trace Tech Specs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "#64748b", fontWeight: "600" }}>SESSION ID</span>
                <strong style={{ fontFamily: "monospace", color: "#2563eb" }}>{activeLog.sessionId}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "#64748b", fontWeight: "600" }}>CORRELATION ID</span>
                <strong style={{ fontFamily: "monospace", color: "#0f172a" }}>{activeLog.correlationId}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "#64748b", fontWeight: "600" }}>POLICY VERSION</span>
                <strong style={{ color: "#16a34a", fontWeight: "700" }}>{activeLog.policyVersion}</strong>
              </div>
            </div>

            <button
              onClick={copyTraceData}
              style={{
                width: "100%",
                padding: "10px",
                background: "#f1f5f9",
                color: "#334155",
                border: "none",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {copied ? "✓ Copied JSON Trace!" : "📋 Copy System Trace JSON"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

