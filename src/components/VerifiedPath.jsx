import {
  BrainCircuit,
  Check,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

export default function VerifiedPath() {
  const steps = [
    ["01", "Intent", "User request"],
    ["02", "Discovery", "AI finds options"],
    ["03", "Policy", "Rules validated"],
    ["04", "Approval", "User confirms"],
    ["05", "Payment", "Transaction verified"],
  ];

  return (
    <section className="verified-section">
      <div className="verified-heading">
        <div className="section-kicker">
          <ShieldCheck size={13} />
          TRUSTED AGENTIC COMMERCE
        </div>

        <h2>The Verified Path</h2>

        <p>Every transaction follows an explicit, auditable decision path.</p>
      </div>

      <div className="verified-flow">
        {steps.map(([number, title, text], index) => (
          <div className="verified-step" key={number}>
            <span className="step-number">{number}</span>

            <div className="step-circle">
              <Check size={16} />
            </div>

            <strong>{title}</strong>

            <span>{text}</span>

            {index !== steps.length - 1 && <div className="step-connector" />}
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   CART PREVIEW
========================================================= */
