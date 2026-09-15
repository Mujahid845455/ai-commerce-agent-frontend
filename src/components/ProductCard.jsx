import {
  ArrowRight,
  Check,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react";
import { getProductImage } from "../utils/productUtils";

/* =========================================================
   PRODUCT CARD
========================================================= */

export default function ProductCard({ product, selected, onSelect }) {
  const outOfStock = product.stock <= 0;

  return (
    <article className={`product-card ${selected ? "product-selected" : ""}`}>
      <div className="product-visual">
        <div className="match-chip">
          <Sparkles size={11} />
          {product.match}% match
        </div>

        <div style={{ width: '100%', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '12px', margin: '10px 0', background: '#f8fafc' }}>
          <img
            src={getProductImage(product)}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
          />
        </div>

        <div className="product-meta">
          <span>{product.color}</span>

          <span className={outOfStock ? "stock-out" : "stock-good"}>
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </span>
        </div>
      </div>

      <div className="product-content">
        <div className="product-brand">{product.brand}</div>

        <h3>{product.name}</h3>

        <p>{product.description}</p>

        <div className="product-tags">
          <span>{product.category}</span>

          {product.size && <span>Size {product.size}</span>}

          {product.fit && <span>{product.fit}</span>}
        </div>

        <div className="product-footer">
          <div className="price">
            <span>PRICE</span>

            <strong>₹{product.price.toLocaleString("en-IN")}</strong>
          </div>

          <button
            className={selected ? "added-button" : "select-product"}
            disabled={outOfStock}
            onClick={onSelect}
          >
            {outOfStock ? (
              <>Out of stock</>
            ) : selected ? (
              <>
                <Check size={14} />
                Added
              </>
            ) : (
              <>
                Select
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   AI INSIGHT
========================================================= */
