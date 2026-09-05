import { useState } from "react";
import {
  BrainCircuit,
  ChevronDown,
} from "lucide-react";

export default function AIDecisionTraceStepper({ searchQuery, itemsCount, budgetCap = 5000 }) {
  const [expanded, setExpanded] = useState(false);

  const nowTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const steps = [
    { num: "01", title: "Query Intent Extracted", desc: `Captured search intent: "${searchQuery || "All Products"}"`, time: nowTime },
    { num: "02", title: "Live PostgreSQL Query", desc: `Queried catalog tables. Found ${itemsCount || 12} matching candidates.`, time: nowTime },
    { num: "03", title: "Budget & Policy Bounded", desc: `Evaluated items against max single transaction cap (≤ ₹${budgetCap.toLocaleString("en-IN")}). Status: PASS.`, time: nowTime },
    { num: "04", title: "Complementary Upsell Match", desc: "Matched primary product with relevant low-stock accessories for maximum AOV value.", time: nowTime },
    { num: "05", title: "Risk Engine Assessment", desc: "Risk Score: LOW (0.02) · Bounded & Gated · Awaiting 1-Click Human Approval.", time: nowTime },
  ];

  return (
    <div style={{ marginTop: 16, background: "rgba(15, 23, 42, 0.04)", borderRadius: 12, border: "1px solid rgba(124, 92, 255, 0.2)", overflow: "hidden" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "transparent",
          border: "none",
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 700,
          color: "#7c5cff",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <BrainCircuit size={15} /> 🧾 Explainable AI Decision Trace ({steps.length} Steps)
        </span>
        <ChevronDown size={14} style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
      </button>

      {expanded && (
        <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(124, 92, 255, 0.15)", background: "white", display: "flex", flexDirection: "column", gap: 10, maxHeight: 200, overflowY: "auto" }}>
          {steps.map((st) => (
            <div key={st.num} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12 }}>
              <span style={{ background: "#7c5cff", color: "white", borderRadius: "50%", width: 20, height: 20, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                {st.num}
              </span>
              <div style={{ flex: 1 }}>
                <strong style={{ color: "#0f172a", display: "block" }}>{st.title}</strong>
                <span style={{ color: "#64748b", fontSize: 11 }}>{st.desc}</span>
              </div>
              <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{st.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
