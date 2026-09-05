import {
  ArrowRight,
  BrainCircuit,
  Sparkles,
  Zap,
} from "lucide-react";
import { getProductImage } from "../utils/productUtils";

export default function AIInsight({ onAdd }) {
  return (
    <aside className="ai-insight-card">
      <div className="insight-top">
        <div className="insight-icon">
          <Sparkles size={18} />
        </div>

        <span className="insight-label">AI OPPORTUNITY</span>
      </div>

      <h3>Complete your running kit.</h3>

      <p>
        Your intent suggests that performance socks would complement this
        purchase and improve your running setup.
      </p>

      <div className="upsell-product">
        <img
          src={getProductImage({ name: "Premium Sports Socks", category: "Sports Accessories" })}
          alt="Socks"
          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }}
        />

        <div>
          <strong>Premium Sports Socks</strong>

          <span>₹299 · AI recommended</span>
        </div>

        <Sparkles size={15} />
      </div>

      <button className="secondary-button full-width" onClick={onAdd}>
        Add recommendation
        <ArrowRight size={15} />
      </button>

      <div className="why-ai">
        <BrainCircuit size={14} />

        <span>Recommendation generated from purchase intent</span>
      </div>
    </aside>
  );
}

/* =========================================================
   VERIFIED PATH
========================================================= */
