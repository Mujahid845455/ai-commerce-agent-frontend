import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Target,
} from "lucide-react";

export function IntentCard({ intent }) {
  const [collapsed, setCollapsed] = useState(false);

  const category = intent?.category || "Live Catalog";
  const budget = intent?.budget || "Policy Validated";
  const useCase = intent?.useCase || "AI Assistant Query";

  return (
    <section className="intent-panel">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="intent-heading">
          <Target size={15} />
          UNDERSTOOD INTENT
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand intent details" : "Collapse intent details"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 9px",
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#475569",
            cursor: "pointer",
          }}
        >
          {collapsed ? "Expand Intent" : "Collapse"}
          {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {!collapsed && (
        <div className="intent-values">
          <IntentValue label="Category" value={category} />

          <IntentValue label="Maximum budget" value={budget} />

          <IntentValue label="Use case" value={useCase} />

          <div className="intent-policy">
            <ShieldCheck size={15} />
            <span>Policy validated</span>
          </div>
        </div>
      )}
    </section>
  );
}

export function IntentValue({ label, value }) {
  return (
    <div className="intent-value">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   PRODUCT IMAGE RESOLVER
========================================================= */
