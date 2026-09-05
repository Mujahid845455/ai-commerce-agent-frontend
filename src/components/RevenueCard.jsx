import { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";

export default function RevenueCard({ totalRev }) {
  const [period, setPeriod] = useState("Last 30 days");
  const [showDropdown, setShowDropdown] = useState(false);

  const displayRev = totalRev ? `₹${Math.round(totalRev).toLocaleString("en-IN")}` : "₹24,745";

  return (
    <div className="revenue-card-modern">
      <div className="card-top">
        <div>
          <span className="card-kicker">REVENUE INTELLIGENCE</span>

          <h2>AI impact on revenue ({displayRev})</h2>

          <p>AI-assisted commerce vs projected baseline ({period}).</p>
        </div>

        <div style={{ position: "relative" }}>
          <button className="period-select" onClick={() => setShowDropdown(!showDropdown)}>
            {period}
            <ChevronDown size={13} />
          </button>

          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 4,
                background: "white",
                borderRadius: 8,
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                border: "1px solid #e2e8f0",
                zIndex: 10,
                width: 140,
                overflow: "hidden",
              }}
            >
              {["Last 30 days", "Last 7 days", "Today"].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setShowDropdown(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: 0,
                    background: period === p ? "#f1f5f9" : "transparent",
                    textAlign: "left",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    color: period === p ? "#7c5cff" : "#475569",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="chart">
        <div className="chart-grid grid-1" />
        <div className="chart-grid grid-2" />
        <div className="chart-grid grid-3" />
        <div className="chart-grid grid-4" />

        <div className="chart-value v1">₹150k</div>

        <div className="chart-value v2">₹100k</div>

        <div className="chart-value v3">₹50k</div>

        <svg viewBox="0 0 800 300" preserveAspectRatio="none">
          <path
            d="M0 255 C90 220 120 205 190 175 C260 145 315 72 390 105 C470 140 500 170 575 112 C650 55 690 100 800 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="chart-line-primary"
          />

          <path
            d="M0 275 C90 260 140 240 210 225 C300 205 340 185 420 190 C510 195 580 165 650 150 C710 138 750 130 800 118"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="10 10"
            className="chart-line-secondary"
          />
        </svg>

        <div className="chart-x">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>

      <div className="chart-legend-modern">
        <span>
          <i className="legend-ai" />
          AI-assisted revenue
        </span>

        <span>
          <i className="legend-base" />
          Baseline projection
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   AGENT ACTIVITY
========================================================= */
