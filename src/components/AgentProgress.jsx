import { Bot, Sparkles, CheckCircle } from "lucide-react";

export default function AgentProgress() {
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

        <span className="agent-live">
          <span />
          LIVE
        </span>
      </div>

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
    </section>
  );
}

/* =========================================================
   INTENT
========================================================= */
