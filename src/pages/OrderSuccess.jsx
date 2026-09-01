import React from "react";

export default function OrderSuccess({
  order,
  onContinueShopping,
  onViewOrders,
}) {

  const amount =
    order?.total_amount_paise != null
      ? order.total_amount_paise / 100
      : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "620px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "42px",
          boxShadow:
            "0 20px 60px rgba(15, 23, 42, 0.10)",
          textAlign: "center",
        }}
      >

        {/* SUCCESS ICON */}

        <div
          style={{
            width: "76px",
            height: "76px",
            margin: "0 auto 22px",
            borderRadius: "50%",
            background: "#dcfce7",
            color: "#16a34a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "38px",
            fontWeight: "700",
          }}
        >
          ✓
        </div>


        {/* TITLE */}

        <div
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#2563eb",
            letterSpacing: "1.5px",
            marginBottom: "8px",
          }}
        >
          PAYMENT SUCCESSFUL
        </div>

        <h1
          style={{
            margin: "0 0 12px",
            fontSize: "32px",
            color: "#172033",
          }}
        >
          Your order is confirmed!
        </h1>

        <p
          style={{
            margin: "0 auto 30px",
            maxWidth: "450px",
            color: "#64748b",
            lineHeight: "1.6",
          }}
        >
          Your payment was successfully verified by
          AgentPay. Your order has been confirmed.
        </p>


        {/* ORDER CARD */}

        <div
          style={{
            textAlign: "left",
            background: "#f8f9fc",
            borderRadius: "18px",
            padding: "22px",
            marginBottom: "25px",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <span style={{ color: "#64748b" }}>
              Order ID
            </span>

            <strong
              style={{
                color: "#172033",
                fontSize: "13px",
              }}
            >
              {order?.order_id
                ? String(order.order_id).slice(0, 8)
                : order?.id
                ? String(order.id).slice(0, 8)
                : "—"}
            </strong>
          </div>


          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <span style={{ color: "#64748b" }}>
              Amount paid
            </span>

            <strong
              style={{
                color: "#172033",
              }}
            >
              ₹{amount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </strong>
          </div>


          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <span style={{ color: "#64748b" }}>
              Payment status
            </span>

            <strong
              style={{
                color: "#16a34a",
              }}
            >
              PAID
            </strong>
          </div>


          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "#64748b" }}>
              Order status
            </span>

            <strong
              style={{
                color: "#16a34a",
              }}
            >
              CONFIRMED
            </strong>
          </div>

        </div>


        {/* RAZORPAY INFO */}

        {order?.razorpay_payment_id && (
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
              marginBottom: "25px",
            }}
          >
            Razorpay Payment ID:
            <br />

            <strong
              style={{
                color: "#334155",
                wordBreak: "break-all",
              }}
            >
              {order.razorpay_payment_id}
            </strong>
          </div>
        )}


        {/* BUTTONS */}

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
          }}
        >

          <button
            onClick={onViewOrders}
            style={{
              flex: 1,
              padding: "14px 20px",
              borderRadius: "12px",
              border: "1px solid #dbe2ea",
              background: "#ffffff",
              color: "#172033",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            View Orders
          </button>


          <button
            onClick={onContinueShopping}
            style={{
              flex: 1,
              padding: "14px 20px",
              borderRadius: "12px",
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Continue Shopping
          </button>

        </div>


        <div
          style={{
            marginTop: "24px",
            fontSize: "12px",
            color: "#94a3b8",
          }}
        >
          Razorpay Test Mode · No real money was charged
        </div>

      </div>
    </div>
  );
}