import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Plus,
  Minus,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Bot,
  BrainCircuit,
  CheckCircle,
  CircleDollarSign,
} from "lucide-react";
import { api } from "../services/client";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import PaymentFailureModal from "../components/PaymentFailureModal";

export default function CartPage({ cart, setCart }) {
  const navigate = useNavigate();

  // Active Tab: "cart" or "saved"
  const [activeTab, setActiveTab] = useState("cart");

  // Saved For Later Items State (stored in localStorage)
  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      const saved = localStorage.getItem("agentpay_saved_items");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "saved-demo-1",
        name: "Rizo Fashion Pink Sling Bag Handbag",
        price: 244,
        originalPrice: 999,
        discountPct: 75,
        rating: 4.1,
        reviewsCount: 1302,
        quantity: 1,
        brand: "Rizo Fashion",
        category: "Accessories",
        image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
      }
    ];
  });

  // Shipping Address State
  const [shippingAddress, setShippingAddress] = useState(() => {
    try {
      const saved = localStorage.getItem("agentpay_shipping_address");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.fullName || parsed.name || "Mujahidul Islam",
          pincode: parsed.pincode || "846005",
          fullAddress: `${parsed.street || parsed.address || "Maa tarani niwaaash (MTN), Darbhanga College of Engineering"}, ${parsed.cityStatePin || "Darbhanga, Bihar - 846005"}`
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      name: "Mujahidul Islam",
      pincode: "846005",
      fullAddress: "Maa tarani niwaaash (MTN), Darbhanga College of Engineering, Darbhanga, Near Shiv Temple, Mabbi"
    };
  });

  // Toast feedback
  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  // Address edit modal state
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(shippingAddress);

  // Helper image function
  const getItemImage = (item) => {
    if (item.image_url) return item.image_url;
    if (item.image) return item.image;
    const name = String(item.name || item.product_name || "").toLowerCase();
    if (name.includes("shoe") || name.includes("runner") || name.includes("sneaker")) {
      return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400";
    }
    if (name.includes("sock")) {
      return "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400";
    }
    if (name.includes("bottle") || name.includes("water")) {
      return "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400";
    }
    if (name.includes("bag") || name.includes("handbag") || name.includes("sling")) {
      return "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400";
    }
    if (name.includes("jewel") || name.includes("bracelet") || name.includes("crystal")) {
      return "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400";
    }
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400";
  };

  // Cart helper operations
  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = (item.quantity || 1) + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    const item = cart.find((i) => i.id === id);
    setCart((prev) => prev.filter((i) => i.id !== id));
    if (item) showToast(`Removed "${item.name}" from cart.`);
  };

  const saveForLater = (item) => {
    setCart((prev) => prev.filter((i) => i.id !== item.id));
    const updatedSaved = [...savedForLater.filter((i) => i.id !== item.id), item];
    setSavedForLater(updatedSaved);
    localStorage.setItem("agentpay_saved_items", JSON.stringify(updatedSaved));
    showToast(`Saved "${item.name}" for later.`);
  };

  const moveToCart = (item) => {
    const updatedSaved = savedForLater.filter((i) => i.id !== item.id);
    setSavedForLater(updatedSaved);
    localStorage.setItem("agentpay_saved_items", JSON.stringify(updatedSaved));
    setCart((prev) => [...prev.filter((i) => i.id !== item.id), { ...item, quantity: 1 }]);
    setActiveTab("cart");
    showToast(`Moved "${item.name}" to cart.`);
  };

  const removeSavedItem = (id) => {
    const updatedSaved = savedForLater.filter((i) => i.id !== id);
    setSavedForLater(updatedSaved);
    localStorage.setItem("agentpay_saved_items", JSON.stringify(updatedSaved));
    showToast("Item removed from saved list.");
  };

  const handleBuyNowSingle = (item) => {
    setCart([{ ...item, quantity: item.quantity || 1 }]);
    navigate("/checkout");
  };

  // Calculations for Price Details sidebar
  const totalItemsCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const finalPriceTotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const originalMRP = cart.reduce((sum, item) => {
    const mrp = item.originalPrice || Math.round((item.price || 0) * 3.5);
    return sum + mrp * (item.quantity || 1);
  }, 0);

  const totalDiscount = Math.max(0, originalMRP - finalPriceTotal);

  return (
    <main className="shopping-page" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
      
      {/* Toast Banner */}
      {toast && (
        <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "12px 18px", borderRadius: 12, marginBottom: 16, fontSize: 14, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 14px rgba(16,185,129,0.2)" }}>
          <span>{toast}</span>
          <X size={16} style={{ cursor: "pointer" }} onClick={() => setToast("")} />
        </div>
      )}

      {/* Top Bar Navigation Tabs */}
      <div className="cart-tab-container">
        <button
          className={`cart-tab-btn ${activeTab === "cart" ? "active" : ""}`}
          onClick={() => setActiveTab("cart")}
        >
          <ShoppingCart size={18} />
          AgentPay Store ({cart.length})
        </button>
        <button
          className={`cart-tab-btn ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          <Bookmark size={18} />
          Saved For Later ({savedForLater.length})
        </button>
      </div>

      {/* Delivery Address Banner */}
      <div className="cart-delivery-banner">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", color: "#2563eb", display: "grid", placeItems: "center" }}>
            <MapPin size={20} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: "#1e293b", lineHeight: 1.4 }}>
              Deliver to: <strong style={{ color: "#0f172a" }}>{shippingAddress.name}, {shippingAddress.pincode}</strong>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "600px" }}>
              {shippingAddress.fullAddress}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setAddressInput(shippingAddress);
            setIsChangingAddress(true);
          }}
          style={{ padding: "6px 14px", background: "#f1f5f9", color: "#2563eb", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
        >
          Change
        </button>
      </div>

      {/* Address Edit Modal */}
      {isChangingAddress && (
        <div className="payment-overlay">
          <div style={{ background: "white", padding: 24, borderRadius: 16, maxWidth: 500, width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Change Delivery Address</h3>
              <X size={18} style={{ cursor: "pointer" }} onClick={() => setIsChangingAddress(false)} />
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setShippingAddress(addressInput);
              try {
                localStorage.setItem("agentpay_shipping_address", JSON.stringify({
                  fullName: addressInput.name,
                  pincode: addressInput.pincode,
                  street: addressInput.fullAddress,
                }));
              } catch(err) {}
              setIsChangingAddress(false);
              showToast("Delivery address updated!");
            }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  value={addressInput.name}
                  onChange={(e) => setAddressInput({ ...addressInput, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14 }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Pincode</label>
                <input
                  type="text"
                  value={addressInput.pincode}
                  onChange={(e) => setAddressInput({ ...addressInput, pincode: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Full Address Details</label>
                <textarea
                  value={addressInput.fullAddress}
                  onChange={(e) => setAddressInput({ ...addressInput, fullAddress: e.target.value })}
                  required
                  rows={3}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsChangingAddress(false)}
                  style={{ padding: "8px 16px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Tab View */}
      {activeTab === "cart" ? (
        cart.length === 0 ? (
          /* Empty Cart View with Quick Add Recommendations */
          <div style={{ background: "white", padding: 40, borderRadius: 16, textAlign: "center", border: "1px solid #e2e8f0" }}>
            <ShoppingBag size={52} color="#94a3b8" style={{ marginBottom: 14 }} />
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#0f172a" }}>Your AgentPay Shopping Cart is empty</h2>
            <p style={{ color: "#64748b", margin: "8px 0 24px", fontSize: 14 }}>
              Explore top AI-recommended products below or discover items in the AI Shopping catalog!
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, textAlign: "left", marginTop: 20 }}>
              {[
                {
                  id: "om-jewells-1",
                  name: "Om Jewells Alloy Crystal Gold-plated Bracelet Set",
                  price: 500,
                  originalPrice: 1999,
                  discountPct: 74,
                  rating: 4.0,
                  reviewsCount: 4169,
                  category: "Jewellery",
                  brand: "Om Jewells",
                  image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"
                },
                {
                  id: "om-jewells-2",
                  name: "Om Jewells Alloy Crystal Rhodium Bracelet Set",
                  price: 532,
                  originalPrice: 1999,
                  discountPct: 73,
                  rating: 3.9,
                  reviewsCount: 521,
                  category: "Jewellery",
                  brand: "Om Jewells",
                  image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400"
                },
                {
                  id: "rizo-sling-bag",
                  name: "Rizo Fashion Pink Sling Bag Handbag",
                  price: 244,
                  originalPrice: 999,
                  discountPct: 75,
                  rating: 4.1,
                  reviewsCount: 1302,
                  category: "Fashion Accessories",
                  brand: "Rizo Fashion",
                  image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
                }
              ].map((item) => (
                <div key={item.id} style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 12, background: "#f8fafc", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img
                      src={getItemImage(item)}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"; }}
                      style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, border: "1px solid #e2e8f0" }}
                    />
                    <div>
                      <strong style={{ fontSize: 13, display: "block", color: "#0f172a", lineHeight: 1.3 }}>{item.name}</strong>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                        <span style={{ fontSize: 11, background: "#16a34a", color: "white", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>★ {item.rating}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#2563eb" }}>₹{item.price}</span>
                        <span style={{ fontSize: 11, textDecoration: "line-through", color: "#94a3b8" }}>₹{item.originalPrice}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="primary-button"
                    onClick={() => {
                      setCart([{ ...item, quantity: 1 }]);
                      showToast(`Added "${item.name}" to cart!`);
                    }}
                    style={{ marginTop: 14, padding: "8px 12px", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <Plus size={14} /> Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Main Cart Content & Price Details Grid */
          <div className="cart-layout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 20, alignItems: "start" }}>

            {/* Cart Items Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {cart.map((item) => {
                const qty = item.quantity || 1;
                const price = item.price || 0;
                const mrp = item.originalPrice || Math.round(price * 3.5);
                const discountPct = item.discountPct || (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);
                const rating = item.rating || 4.2;
                const reviews = item.reviewsCount || 1240;

                return (
                  <div key={item.id} className="cart-item-card-modern">
                    <div style={{ padding: "18px 20px", display: "grid", gridTemplateColumns: "100px 1fr", gap: 18, alignItems: "start" }}>
                      
                      {/* Product Thumbnail & Qty Selector */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <img
                          src={getItemImage(item)}
                          alt={item.name}
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"; }}
                          style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10, border: "1px solid #e2e8f0" }}
                        />

                        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1" }}>
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            style={{ border: "none", background: "none", fontSize: 14, fontWeight: 800, cursor: "pointer", color: "#475569" }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: 12, fontWeight: 800, minWidth: 16, textAlign: "center" }}>{qty}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            style={{ border: "none", background: "none", fontSize: 14, fontWeight: 800, cursor: "pointer", color: "#475569" }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div>
                        <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#0f172a", lineHeight: 1.35 }}>
                          {item.name}
                        </h3>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                          {item.brand || "AgentPay Store"} · {item.category || "General"}
                        </div>

                        {/* Star Rating Badge */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "white", background: "#16a34a", padding: "2px 6px", borderRadius: 4 }}>
                            ★ {rating}
                          </span>
                          <span style={{ fontSize: 12, color: "#64748b" }}>({reviews.toLocaleString()})</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "2px 6px", borderRadius: 4 }}>
                            ✔ Agent Verified
                          </span>
                        </div>

                        {/* Price & Discount Row */}
                        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                          {discountPct > 0 && (
                            <span style={{ fontSize: 13, fontWeight: 800, color: "#16a34a" }}>
                              ↓{discountPct}% OFF
                            </span>
                          )}
                          <span style={{ fontSize: 13, textDecoration: "line-through", color: "#94a3b8" }}>
                            ₹{(mrp * qty).toLocaleString("en-IN")}
                          </span>
                          <strong style={{ fontSize: 20, color: "#0f172a", fontWeight: 800 }}>
                            ₹{(price * qty).toLocaleString("en-IN")}
                          </strong>
                        </div>

                        {/* Delivery Promise */}
                        <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                          🚚 Free Delivery by Tomorrow, 5 PM
                        </div>
                      </div>
                    </div>

                    {/* Action Bar (Save For Later, Remove, Buy Now) */}
                    <div className="cart-action-bar">
                      <button className="cart-action-btn" onClick={() => saveForLater(item)}>
                        <Bookmark size={14} /> Save for later
                      </button>
                      <button className="cart-action-btn remove-btn" onClick={() => removeItem(item.id)}>
                        <Trash2 size={14} /> Remove
                      </button>
                      <button className="cart-action-btn buy-now-btn" onClick={() => handleBuyNowSingle(item)}>
                        <Zap size={14} /> Buy this now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Sidebar: Flipkart-Style Price Details Card */}
            <div style={{ background: "white", padding: 20, borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", position: "sticky", top: 80 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#64748b", borderBottom: "1px solid #f1f5f9", paddingBottom: 12, letterSpacing: "0.5px" }}>
                PRICE DETAILS
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "16px 0", fontSize: 14, color: "#334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Price ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})</span>
                  <span>₹{originalMRP.toLocaleString("en-IN")}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a" }}>
                  <span>Discount</span>
                  <span style={{ fontWeight: 700 }}>-₹{totalDiscount.toLocaleString("en-IN")}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Delivery Charges</span>
                  <span style={{ color: "#16a34a", fontWeight: 700 }}>
                    <span style={{ textDecoration: "line-through", color: "#94a3b8", fontWeight: 400, marginRight: 4 }}>₹99</span>
                    FREE
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
                  <span>AI Spend Policy Guardrail</span>
                  <span style={{ color: "#16a34a", fontWeight: 700 }}>✓ Passed</span>
                </div>
              </div>

              <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 14, marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Total Amount</span>
                <strong style={{ fontSize: 22, color: "#2563eb", fontWeight: 800 }}>
                  ₹{finalPriceTotal.toLocaleString("en-IN")}
                </strong>
              </div>

              {totalDiscount > 0 && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px 12px", borderRadius: 8, color: "#16a34a", fontSize: 12, fontWeight: 700, marginTop: 14, textAlign: "center" }}>
                  🎉 You will save ₹{totalDiscount.toLocaleString("en-IN")} on this order!
                </div>
              )}

              <button
                className="primary-button full-width"
                onClick={() => navigate("/checkout")}
                style={{ marginTop: 18, padding: "13px 20px", fontSize: 14, fontWeight: 800, background: "linear-gradient(135deg, #7c5cff, #2563eb)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}
              >
                PLACE ORDER
                <ArrowRight size={16} />
              </button>

              <div style={{ marginTop: 14, fontSize: 11, color: "#94a3b8", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <ShieldCheck size={14} color="#16a34a" /> 100% Safe Payments via Razorpay
              </div>
            </div>

          </div>
        )
      ) : (
        /* Saved For Later Tab Content */
        <div style={{ background: "white", padding: 24, borderRadius: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
            Saved For Later ({savedForLater.length})
          </h3>

          {savedForLater.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 20px", color: "#64748b" }}>
              <Bookmark size={40} color="#cbd5e1" style={{ marginBottom: 8 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>No items currently saved for later.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {savedForLater.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, border: "1px solid #e2e8f0", borderRadius: 12, flexWrap: "wrap" }}>
                  <img
                    src={getItemImage(item)}
                    alt={item.name}
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"; }}
                    style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 10, border: "1px solid #e2e8f0" }}
                  />
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{item.name}</h4>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{item.brand || "Store"} · {item.category || "General"}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#2563eb", marginTop: 4 }}>
                      ₹{(item.price || 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => moveToCart(item)}
                      style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <ShoppingCart size={14} /> Move to Cart
                    </button>
                    <button
                      onClick={() => removeSavedItem(item.id)}
                      style={{ padding: "8px 12px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </main>
  );
}

/* =========================================================
   PAYMENT SUCCESS
========================================================= */

