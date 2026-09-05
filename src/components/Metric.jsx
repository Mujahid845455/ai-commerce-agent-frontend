export default function Metric({ icon: Icon, title, value, change, purple }) {
  return (
    <div className={`metric-modern ${purple ? "purple-metric" : ""}`}>
      <div className="metric-top">
        <div className="metric-icon">
          <Icon size={17} />
        </div>

        <span className="metric-change">↗ {change}</span>
      </div>

      <span className="metric-title">{title}</span>

      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   REVENUE
========================================================= */
