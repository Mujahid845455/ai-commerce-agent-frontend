import { Check, X } from "lucide-react";

export default function AuthorizationRow({ label, value, success }) {
  return (
    <div className="authorization-row">
      <span>{label}</span>

      <strong className={success ? "success-text" : ""}>
        {success && <Check size={13} />}

        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   ORDERS
========================================================= */
