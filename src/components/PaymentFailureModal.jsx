import {
  ShieldCheck,
  X,
} from "lucide-react";

export default function PaymentFailureModal({ errorReason, onRetry, onClose }) {
  return (
    <div className="payment-overlay">
      <div className="payment-success-modal" style={{ borderTop: "6px solid #ef4444" }}>
        <div className="payment-success-icon" style={{ background: "#fef2f2", color: "#ef4444" }}>
          <X size={30} strokeWidth={3} />
        </div>

        <div className="section-kicker" style={{ color: "#ef4444" }}>
          <ShieldCheck size={13} />
          GRACEFUL FAILURE RECOVERY
        </div>

        <h2 style={{ color: "#0f172a" }}>Payment Unsuccessful</h2>

        <p className="payment-success-description" style={{ color: "#64748b" }}>
          The transaction failed during payment verification. <strong>Your inventory has NOT been deducted</strong> and your cart remains preserved.
        </p>

        <div style={{ padding: "12px 14px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca", fontSize: 12, color: "#dc2626", fontWeight: 600, margin: "14px 0" }}>
          Reason: {errorReason || "Bank verification signature mismatch."}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button
            onClick={onRetry}
            style={{ flex: 1, padding: "12px", background: "#2563eb", color: "white", border: 0, borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13 }}
          >
            🔄 Retry Payment
          </button>

          <button
            onClick={onClose}
            style={{ padding: "12px 16px", background: "#f1f5f9", color: "#334155", border: 0, borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
