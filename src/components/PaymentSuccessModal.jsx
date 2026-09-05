import {
  ArrowRight,
  Check,
  CheckCircle,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function PaymentSuccessModal({ payment, onViewOrder, onClose }) {
  const amount = Number(payment?.total_amount_paise || 0) / 100;

  return (
    <div className="payment-overlay">
      <div className="payment-success-modal">
        {/* SUCCESS ICON */}

        <div className="payment-success-icon">
          <Check size={30} strokeWidth={3} />
        </div>

        {/* KICKER */}

        <div className="section-kicker success-kicker">
          <ShieldCheck size={13} />
          PAYMENT VERIFIED
        </div>

        {/* TITLE */}

        <h2>Payment successful</h2>

        <p className="payment-success-description">
          Your payment has been verified successfully. Your AgentPay order is
          now confirmed.
        </p>

        {/* AMOUNT */}

        <div className="payment-success-amount">
          <span>Amount paid</span>

          <strong>
            ₹
            {amount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </strong>
        </div>

        {/* DETAILS */}

        <div className="payment-success-details">
          <div>
            <span>Order ID</span>

            <strong>#{String(payment?.order_id || "").slice(0, 8)}</strong>
          </div>

          <div>
            <span>Payment ID</span>

            <strong className="payment-id">
              {payment?.razorpay_payment_id || "—"}
            </strong>
          </div>

          <div>
            <span>Status</span>

            <strong className="success-text">
              <Check size={13} />
              PAID
            </strong>
          </div>
        </div>

        {/* TRUST MESSAGE */}

        <div className="payment-success-note">
          <ShieldCheck size={17} />

          <span>
            Payment signature verified by AgentPay. Stock has been updated and
            the order is confirmed.
          </span>
        </div>

        {/* ACTIONS */}

        <div className="payment-success-actions">
          <button className="approve-button" onClick={onViewOrder}>
            <Package size={17} />
            View Order
          </button>

          <button className="cancel-button" onClick={onClose}>
            Continue Shopping
          </button>
        </div>

        <div className="razorpay-note">
          Razorpay Test Mode · No real money is charged
        </div>
      </div>
    </div>
  );
}
