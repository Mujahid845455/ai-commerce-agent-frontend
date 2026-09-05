export function IntentCard({ intent }) {
  const category = intent?.category || "Live Catalog";
  const budget = intent?.budget || "Policy Validated";
  const useCase = intent?.useCase || "AI Assistant Query";

  return (
    <section className="intent-panel">
      <div className="intent-heading">
        <Target size={15} />
        UNDERSTOOD INTENT
      </div>

      <div className="intent-values">
        <IntentValue label="Category" value={category} />

        <IntentValue label="Maximum budget" value={budget} />

        <IntentValue label="Use case" value={useCase} />

        <div className="intent-policy">
          <ShieldCheck size={15} />
          <span>Policy validated</span>
        </div>
      </div>
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
