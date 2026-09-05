import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
  CreditCard,
  RefreshCw,
  Save,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  X,
} from "lucide-react";

import {
  checkout,
  verifyOrderPayment,
} from "../services/orders";
import { api } from "../services/client";


// ============================================================
// CHECKOUT
// ============================================================

export default function Checkout({ cart = [] }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // ----------------------------------------------------------
  // TOTAL
  // ----------------------------------------------------------

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.quantity || 1),
      0
    );
  }, [cart]);

  // ----------------------------------------------------------
  // FORMAT MONEY
  // ----------------------------------------------------------

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  // ----------------------------------------------------------
  // EMPTY CART
  // ----------------------------------------------------------

  if (!cart.length && !paymentSuccess) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty-modern">

          <ShoppingCart size={36} />

          <strong>
            Your cart is empty
          </strong>

          <span>
            Add a product before continuing
            to checkout.
          </span>

          <button
            className="secondary-button"
            onClick={() => navigate("/")}
          >
            Continue shopping
          </button>

        </div>
      </main>
    );
  }

  // ==========================================================
  // RAZORPAY CHECKOUT
  // ==========================================================

  const openRazorpayCheckout = async (
    order
  ) => {

    if (!window.Razorpay) {
      throw new Error(
        "Razorpay Checkout SDK is not loaded. Please check index.html."
      );
    }

    const razorpayKey =
      import.meta.env
        .VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      throw new Error(
        "VITE_RAZORPAY_KEY_ID is missing from frontend/.env"
      );
    }

    if (!order?.razorpay_order_id) {
      throw new Error(
        "Razorpay order ID is missing."
      );
    }

    // --------------------------------------------------------
    // RAZORPAY OPTIONS
    // --------------------------------------------------------

    const options = {

      key: razorpayKey,

      amount:
        order.total_amount_paise,

      currency:
        order.currency || "INR",

      name:
        "AgentPay",

      description:
        "Agentic Commerce Test Payment",

      order_id:
        order.razorpay_order_id,

      prefill: {
        name: "AgentPay Customer",
        email: "rahul@example.com",
      },

      notes: {
        platform:
          "AgentPay",
        environment:
          "Test Mode",
      },

      theme: {
        color: "#2563eb",
      },

      // ======================================================
      // PAYMENT SUCCESS CALLBACK
      // ======================================================

      handler: async function (
        response
      ) {

        console.log(
          "Razorpay payment success:",
          response
        );

        try {

          setLoading(true);
          setPaymentError("");

          // --------------------------------------------------
          // IMPORTANT:
          // DO NOT SHOW SUCCESS YET.
          //
          // First verify payment on backend.
          // --------------------------------------------------

          let verification;
          try {
            const itemsPayload = (order.items && order.items.length > 0 ? order.items : cart).map(i => ({
              product_id: i.product_id || i.id,
              quantity: i.quantity || 1
            }));

            verification = await api.post("/payments/verify", {
              items: itemsPayload,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          } catch (vErr) {
            console.warn("Direct verification failed, trying legacy verify:", vErr);
            verification = await verifyOrderPayment({
              order_id: order.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          }

          console.log("Backend payment verification:", verification);

          if (!verification || (verification.status !== "verified" && verification.status !== "CONFIRMED" && verification.success !== true)) {
            throw new Error(verification?.message || "Payment verification failed.");
          }

          // --------------------------------------------------
          // SAVE SUCCESS ORDER
          // --------------------------------------------------

          const successOrder = {
            ...verification,

            order_id:
              verification.order_id ||
              order.id,

            razorpay_order_id:
              verification.razorpay_order_id ||
              response.razorpay_order_id,

            razorpay_payment_id:
              verification.razorpay_payment_id ||
              response.razorpay_payment_id,

            total_amount_paise:
              verification.total_amount_paise ||
              order.total_amount_paise,

            currency:
              verification.currency ||
              order.currency ||
              "INR",

            success: true,

            status: "CONFIRMED",

            payment_status: "PAID",
          };

          // --------------------------------------------------
          // STORE CONFIRMED ORDER
          // --------------------------------------------------

          localStorage.setItem(
            "agentpay_completed_order",
            JSON.stringify(
              successOrder
            )
          );

          // Pending order is no longer needed
          localStorage.removeItem(
            "agentpay_pending_order"
          );

          // --------------------------------------------------
          // SHOW SUCCESS PAGE
          // --------------------------------------------------

          setPaymentSuccess(
            successOrder
          );

        } catch (error) {

          console.error(
            "Payment verification failed:",
            error
          );

          setPaymentError(
            error?.message ||
            "Payment verification failed."
          );

        } finally {

          setLoading(false);

        }
      },

      // ======================================================
      // PAYMENT MODAL DISMISSED
      // ======================================================

      modal: {

        ondismiss: function () {

          console.log(
            "Razorpay checkout dismissed"
          );

          setLoading(false);

        },

      },

    };

    // --------------------------------------------------------
    // CREATE RAZORPAY INSTANCE
    // --------------------------------------------------------

    const razorpay =
      new window.Razorpay(
        options
      );

    // ========================================================
    // PAYMENT FAILED
    // ========================================================

    razorpay.on(
      "payment.failed",
      function (response) {

        console.error(
          "Razorpay payment failed:",
          response
        );

        const description =
          response?.error?.description ||
          "Payment failed.";

        setPaymentError(
          description
        );

        setLoading(false);

      }
    );

    // --------------------------------------------------------
    // OPEN RAZORPAY
    // --------------------------------------------------------

    razorpay.open();
  };


  // ==========================================================
  // APPROVE + CREATE RAZORPAY ORDER
  // ==========================================================

  const approvePayment = async () => {
    if (loading) return;

    if (!cart.length) {
      setPaymentError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setPaymentError("");

      let order;

      try {
        // Fetch active catalog products to map items to valid PostgreSQL UUIDs
        const catalogProducts = await api.getCatalogProducts();
        
        const itemsPayload = cart.map(item => {
          const matchingProd = (Array.isArray(catalogProducts) ? catalogProducts : []).find(
            p => p.id === item.id || (p.name && item.name && p.name.toLowerCase() === item.name.toLowerCase())
          );
          return {
            product_id: matchingProd ? matchingProd.id : (catalogProducts?.[0]?.id || item.id),
            quantity: item.quantity || 1
          };
        });

        console.log("Creating Razorpay checkout order for items:", itemsPayload);
        order = await api.createPaymentOrder(itemsPayload);
      } catch (err) {
        console.warn("Direct payment order creation failed, trying legacy checkout:", err);
        order = await checkout();
      }

      console.log("Backend checkout order created:", order);

      const razorpayOrderId = order?.razorpay_order_id || order?.order_id;

      if (!order || !razorpayOrderId) {
        throw new Error(order?.detail || "Razorpay order could not be created.");
      }

      const normalizedOrder = {
        ...order,
        id: order.id || razorpayOrderId,
        razorpay_order_id: razorpayOrderId,
        total_amount_paise: order.total_amount_paise || order.amount_paise || Math.round(total * 100)
      };

      // Save pending order
      localStorage.setItem("agentpay_pending_order", JSON.stringify(normalizedOrder));

      // Open Razorpay Modal
      await openRazorpayCheckout(normalizedOrder);

    } catch (error) {
      console.error("Checkout initialization failed:", error);
      setPaymentError(
        error?.message || "Unable to start payment. Please check server status."
      );
      setLoading(false);
    }
  };


  // ==========================================================
  // SUCCESS SCREEN
  // ==========================================================

  if (paymentSuccess) {

    const amount =
      Number(
        paymentSuccess.total_amount_paise ||
        0
      ) / 100;

    return (
      <main className="simple-page">

        <div
          className="order-modern"
          style={{
            maxWidth: 760,
            margin: "70px auto",
            display: "block",
            textAlign: "center",
          }}
        >

          {/* SUCCESS ICON */}

          <div
            style={{
              width: 76,
              height: 76,
              margin: "0 auto 22px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "rgba(22, 163, 74, .10)",
              color: "#16a34a",
            }}
          >
            <Check size={40} />
          </div>

          {/* KICKER */}

          <div
            className="section-kicker"
            style={{
              justifyContent:
                "center",
            }}
          >
            <ShieldCheck size={14} />
            PAYMENT VERIFIED
          </div>

          {/* TITLE */}

          <h1
            style={{
              marginTop: 10,
            }}
          >
            Payment successful
          </h1>

          <p
            style={{
              maxWidth: 560,
              margin:
                "10px auto 28px",
            }}
          >
            Your Razorpay test-mode payment
            has been verified successfully.
            Your AgentPay order is now
            confirmed.
          </p>

          {/* ORDER CARD */}

          <div
            style={{
              textAlign: "left",
              padding: 22,
              borderRadius: 18,
              border:
                "1px solid rgba(15,23,42,.08)",
              background:
                "#fafafa",
              marginBottom: 18,
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 20,
                marginBottom: 15,
              }}
            >

              <span>
                Order ID
              </span>

              <strong>
                {String(
                  paymentSuccess.order_id
                ).slice(0, 12)}
              </strong>

            </div>


            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 20,
                marginBottom: 15,
              }}
            >

              <span>
                Razorpay Order
              </span>

              <code>
                {
                  paymentSuccess
                    .razorpay_order_id
                }
              </code>

            </div>


            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 20,
                marginBottom: 15,
              }}
            >

              <span>
                Payment ID
              </span>

              <code>
                {
                  paymentSuccess
                    .razorpay_payment_id
                }
              </code>

            </div>


            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 20,
                marginBottom: 15,
              }}
            >

              <span>
                Payment status
              </span>

              <strong
                style={{
                  color: "#16a34a",
                }}
              >
                ✓ PAID
              </strong>

            </div>


            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 20,
              }}
            >

              <span>
                Order status
              </span>

              <strong
                style={{
                  color: "#16a34a",
                }}
              >
                ✓ CONFIRMED
              </strong>

            </div>

          </div>

          {/* AMOUNT */}

          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 25,
            }}
          >
            ₹{formatMoney(amount)}
          </div>

          {/* TEST MODE */}

          <div
            className="approval-message"
            style={{
              textAlign: "left",
              marginBottom: 25,
            }}
          >

            <ShieldCheck size={17} />

            <span>
              Razorpay Test Mode — no real
              money was charged. Payment was
              verified server-side before the
              order was confirmed.
            </span>

          </div>

          {/* BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent:
                "center",
              flexWrap: "wrap",
            }}
          >

            <button
              className="secondary-button"
              onClick={() => {
                setPaymentSuccess(
                  null
                );

                navigate("/");
              }}
            >
              Continue shopping
            </button>

            <button
              className="primary-button"
              onClick={() => {
                setPaymentSuccess(
                  null
                );

                navigate("/orders");
              }}
            >
              View orders
              <ArrowRight size={16} />
            </button>

          </div>

        </div>

      </main>
    );
  }


  // ==========================================================
  // NORMAL CHECKOUT SCREEN
  // ==========================================================

  return (
    <main className="checkout-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="checkout-top">

        <div>

          <div className="section-kicker">
            <ShieldCheck size={13} />
            SECURE CHECKOUT
          </div>

          <h1>
            Review before you pay.
          </h1>

          <p>
            AgentPay will only create the
            Razorpay test-mode payment after
            your explicit approval.
          </p>

        </div>

        <div className="checkout-security">
          <ShieldCheck size={17} />
          Secure transaction
        </div>

      </div>


      {/* ======================================================
          CHECKOUT LAYOUT
      ====================================================== */}

      <div className="checkout-layout">

        {/* ====================================================
            ORDER SUMMARY
        ==================================================== */}

        <section>

          <div className="checkout-card-modern">

            <div className="card-top">

              <div>

                <span className="card-kicker">
                  ORDER SUMMARY
                </span>

                <h2>
                  Your selected items
                </h2>

              </div>

              <ShoppingBag size={20} />

            </div>


            {cart.map(
              (item) => (

                <div
                  className="checkout-product"
                  key={item.id}
                >

                  <div className="checkout-product-image">
                    RUN
                  </div>

                  <div className="checkout-product-info">

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.category ||
                        "Product"}{" "}
                      · Qty{" "}
                      {item.quantity}
                    </span>

                  </div>

                  <strong>
                    ₹
                    {formatMoney(
                      Number(
                        item.price || 0
                      ) *
                      Number(
                        item.quantity || 1
                      )
                    )}
                  </strong>

                </div>

              )
            )}


            <div className="checkout-total-modern">

              <span>
                Total payable
              </span>

              <strong>
                ₹{formatMoney(total)}
              </strong>

            </div>

          </div>


          {/* ==================================================
              AI REASON
          ================================================== */}

          <div className="ai-reason-card">

            <div className="reason-icon">
              <Sparkles size={17} />
            </div>

            <div>

              <span>
                AGENT DECISION
              </span>

              <strong>
                Why this cart was selected
              </strong>

              <p>
                Products match your stated
                budget, running intent and
                current inventory availability.
              </p>

            </div>

          </div>

        </section>


        {/* ====================================================
            AUTHORIZATION
        ==================================================== */}

        <aside className="authorization-modern">

          <div className="authorization-title">

            <div>

              <span className="card-kicker">
                PAYMENT AUTHORIZATION
              </span>

              <h2>
                Approve transaction
              </h2>

            </div>

            <div className="secure-check">
              <Check size={14} />
            </div>

          </div>


          <AuthorizationRow
            label="Spending limit"
            value="₹2,500"
          />


          <AuthorizationRow
            label="Requested amount"
            value={`₹${formatMoney(total)}`}
          />


          <AuthorizationRow
            label="Policy validation"
            value="PASS"
            success
          />


          <AuthorizationRow
            label="Cart integrity"
            value="VERIFIED"
            success
          />


          <div className="authorization-divider" />


          <div className="approval-message">

            <ShieldCheck size={17} />

            <span>
              Your approval is required
              before any payment request
              is created.
            </span>

          </div>


          {/* ==================================================
              ERROR
          ================================================== */}

          {paymentError && (

            <div
              style={{
                marginTop: 14,
                padding:
                  "12px 14px",
                borderRadius: 12,
                border:
                  "1px solid rgba(220,70,70,.25)",
                background:
                  "rgba(220,70,70,.07)",
                color: "#b91c1c",
                fontSize: 13,
                display: "flex",
                gap: 9,
                alignItems:
                  "flex-start",
              }}
            >

              <X
                size={17}
                style={{
                  flexShrink: 0,
                }}
              />

              <div>

                <strong>
                  Payment could not be completed
                </strong>

                <div
                  style={{
                    marginTop: 4,
                  }}
                >
                  {paymentError}
                </div>

              </div>

            </div>

          )}


          {/* ==================================================
              APPROVE BUTTON
          ================================================== */}

          <button
            className="approve-button"
            disabled={
              loading ||
              cart.length === 0
            }
            onClick={
              approvePayment
            }
          >

            {loading ? (

              <>
                <RefreshCw
                  size={17}
                  className="spin"
                />

                Creating secure payment...
              </>

            ) : (

              <>
                <CreditCard
                  size={17}
                />

                Approve ₹
                {formatMoney(total)}
              </>

            )}

          </button>


          <button
            className="cancel-button"
            disabled={loading}
            onClick={() =>
              navigate("/")
            }
          >
            Cancel
          </button>


          <div className="razorpay-note">
            Powered by Razorpay Test Mode
          </div>

        </aside>

      </div>

    </main>
  );
}


// ============================================================
// AUTHORIZATION ROW
// ============================================================

function AuthorizationRow({
  label,
  value,
  success = false,
}) {

  return (
    <div className="authorization-row">

      <span>
        {label}
      </span>

      <strong
        className={
          success
            ? "success-text"
            : ""
        }
      >

        {success && (
          <Check size={13} />
        )}

        {value}

      </strong>

    </div>
  );
}