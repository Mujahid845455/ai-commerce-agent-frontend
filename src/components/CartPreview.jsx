import { ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPreview({ cart, total, navigate }) {
  return (
    <aside className="cart-card">
      <div className="cart-header">
        <div>
          <span className="mini-label">YOUR CART</span>

          <h3>Ready to checkout?</h3>
        </div>

        <div className="cart-icon">
          <ShoppingCart size={17} />
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <ShoppingBag size={25} />

          <strong>Your cart is waiting</strong>

          <p>Select a product from the AI catalog to continue.</p>
        </div>
      ) : (
        <div className="cart-content">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="product-mini">RUN</div>

              <div className="cart-item-info">
                <strong>{item.name}</strong>

                <span>Qty {item.quantity}</span>
              </div>

              <strong>
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

          <div className="cart-total">
            <span>Total</span>

            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>

          <button
            className="primary-button full-width"
            onClick={() => navigate("/checkout")}
          >
            Review & approve
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}

/* =========================================================
   CART PAGE
========================================================= */
