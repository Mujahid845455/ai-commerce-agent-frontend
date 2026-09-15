import { useState } from "react";
import {
  Bot,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AgentProgress() {
  const [collapsed, setCollapsed] = useState(false);

  const steps = [
    "Intent understood",
    "Catalog searched",
    "Stock checked",
    "Policy validated",
  ];

  return (
    <section className="agent-progress">
      <div className="agent-progress-top">
        <div className="agent-title">
          <div className="agent-orb">
            <Bot size={17} />
          </div>

          <div>
            <strong>Agent is working</strong>
            <span>Decision pipeline complete</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="agent-live">
            <span />
            LIVE
          </span>

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand agent pipeline steps" : "Collapse agent pipeline steps"}
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
            {collapsed ? "Show Steps" : "Collapse"}
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div className="progress-step" key={step}>
              <div className="progress-check">
                <Check size={11} />
              </div>

              <span>{step}</span>

              {index !== steps.length - 1 && <div className="progress-line" />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   INTENT
========================================================= */
