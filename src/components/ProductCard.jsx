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
          <Sparkles size={12} />
          {product.match}% match
        </div>

        <div style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '10px', margin: '8px 0', background: '#f8fafc' }}>
          <img
            src={getProductImage(product)}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
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

        <p title={product.description}>{product.description}</p>

        <div className="product-tags">
          <span>{product.category}</span>

          {product.size && <span>Size {product.size}</span>}
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
            aria-label={selected ? `Added ${product.name} to selection` : `Select ${product.name}`}
          >
            {outOfStock ? (
              <>Out of stock</>
            ) : selected ? (
              <>
                <Check size={15} />
                Added
              </>
            ) : (
              <>
                Select
                <ArrowRight size={15} />
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
