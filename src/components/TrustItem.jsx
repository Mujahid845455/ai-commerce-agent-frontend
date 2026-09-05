export default function TrustItem({ icon: Icon, text }) {
  return (
    <div className="trust-item">
      <Icon size={14} />
      <span>{text}</span>
    </div>
  );
}

/* =========================================================
   AGENT PROGRESS
========================================================= */
