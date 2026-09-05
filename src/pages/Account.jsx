import { useState, useEffect } from "react";
import {
  Bookmark,
  Check,
  Copy,
  CreditCard,
  Edit2,
  Key,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import { api } from "../services/client";

export default function Account() {
  const [toastMessage, setToastMessage] = useState("");

  // 1. User Profile State
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("agentpay_user_profile");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      name: "Arjun Sharma",
      roleBadge: "VIP Shopper",
      email: "customer@agentpay.demo",
      phone: "+91 98765 43210",
    };
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(profile);

  // 2. Spending Limits State (Synced with agentpay_policy_config)
  const [spendingLimits, setSpendingLimits] = useState(() => {
    try {
      const saved = localStorage.getItem("agentpay_policy_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          maxLimit: parsed.maxLimit ?? 5000,
          requireHumanApproval: parsed.requireHumanApproval ?? true,
          autoBlockExceeded: parsed.autoBlockExceeded ?? true,
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      maxLimit: 5000,
      requireHumanApproval: true,
      autoBlockExceeded: true,
    };
  });

  const [isEditingSpending, setIsEditingSpending] = useState(false);
  const [spendingForm, setSpendingForm] = useState(spendingLimits);

  // 3. Shipping Address State
  const [address, setAddress] = useState(() => {
    try {
      const saved = localStorage.getItem("agentpay_shipping_address");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      fullName: "Arjun Sharma",
      street: "Flat 402, Highrise Luxury Apartments",
      cityStatePin: "Indiranagar 100ft Road, Bangalore, KA - 560038",
      phone: "+91 98765 43210",
    };
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(address);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Compute initials for Avatar
  const getInitials = (name) => {
    if (!name) return "AS";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Save Handlers
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(profileForm);
    localStorage.setItem("agentpay_user_profile", JSON.stringify(profileForm));
    setIsEditingProfile(false);
    showToast("✓ Profile updated successfully!");
  };

  const handleSaveSpending = (e) => {
    e.preventDefault();
    const updated = {
      ...spendingForm,
      maxLimit: Number(spendingForm.maxLimit) || 5000,
    };
    setSpendingLimits(updated);

    // Sync with agentpay_policy_config
    try {
      const existing = JSON.parse(localStorage.getItem("agentpay_policy_config") || "{}");
      const newPolicyConfig = {
        ...existing,
        maxLimit: updated.maxLimit,
        requireHumanApproval: updated.requireHumanApproval,
        autoBlockExceeded: updated.autoBlockExceeded,
      };
      localStorage.setItem("agentpay_policy_config", JSON.stringify(newPolicyConfig));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
    }

    setIsEditingSpending(false);
    showToast(`✓ Spending cap updated to ₹${updated.maxLimit.toLocaleString("en-IN")}!`);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    setAddress(addressForm);
    localStorage.setItem("agentpay_shipping_address", JSON.stringify(addressForm));
    setIsEditingAddress(false);
    showToast("✓ Default shipping address updated successfully!");
  };

  return (
    <main className="simple-page" style={{ maxWidth: 900, margin: "0 auto", padding: "30px 20px" }}>
      <PageHeader
        kicker="SHOPPER ACCOUNT"
        title="Customer Profile & Agent Guardrails"
        description="Manage your profile, spending bounds, and AI agent permissions."
      />

      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div style={{
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          padding: "12px 18px",
          borderRadius: "12px",
          marginTop: "16px",
          fontSize: "14px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)"
        }}>
          <span>{toastMessage}</span>
          <X size={16} style={{ cursor: "pointer" }} onClick={() => setToastMessage("")} />
        </div>
      )}

      {/* User Info Card */}
      <div style={{ background: "white", padding: 24, borderRadius: 16, border: "1px solid #e2e8f0", marginTop: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        {!isEditingProfile ? (
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ width: 64, height: 64, borderRadius: 99, background: "linear-gradient(135deg, #2563eb, #7c5cff)", color: "white", display: "grid", placeItems: "center", fontSize: 24, fontWeight: 800, flexShrink: 0 }}>
              {getInitials(profile.name)}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{profile.name}</h2>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "2px 8px", borderRadius: 4 }}>{profile.roleBadge}</span>
              </div>
              <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>
                {profile.email} · {profile.phone}
              </p>
            </div>
            <button
              onClick={() => {
                setProfileForm(profile);
                setIsEditingProfile(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                background: "#f1f5f9",
                color: "#334155",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#e2e8f0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
            >
              <Edit2 size={14} /> Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <strong style={{ fontSize: 16, color: "#0f172a" }}>Edit Customer Profile</strong>
              <span style={{ fontSize: 12, color: "#64748b" }}>Update personal details</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14, outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Role / Membership Tag</label>
                <select
                  value={profileForm.roleBadge}
                  onChange={(e) => setProfileForm({ ...profileForm, roleBadge: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14, outline: "none", background: "white" }}
                >
                  <option value="VIP Shopper">VIP Shopper</option>
                  <option value="Pro Shopper">Pro Shopper</option>
                  <option value="Verified Shopper">Verified Shopper</option>
                  <option value="Standard Shopper">Standard Shopper</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Email Address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14, outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  required
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14, outline: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                style={{ padding: "8px 16px", background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: "8px 18px", background: "linear-gradient(135deg, #2563eb, #7c5cff)", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 6px rgba(37, 99, 235, 0.3)" }}
              >
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Grid of Security & Addresses */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginTop: 20 }}>

        {/* Spending Bounds Card */}
        <div style={{ background: "white", padding: 20, borderRadius: 16, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheck size={18} color="#2563eb" />
                <strong style={{ fontSize: 14, color: "#0f172a" }}>AI Agent Spending Limits</strong>
              </div>
              {!isEditingSpending && (
                <button
                  onClick={() => {
                    setSpendingForm(spendingLimits);
                    setIsEditingSpending(true);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    background: "#eff6ff",
                    color: "#2563eb",
                    border: "1px solid #bfdbfe",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  <Edit2 size={12} /> Edit Limit
                </button>
              )}
            </div>

            {!isEditingSpending ? (
              <>
                <div style={{ padding: 12, background: "#f8fafc", borderRadius: 10, marginBottom: 12, border: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 11, color: "#64748b", display: "block", fontWeight: 700, letterSpacing: "0.5px" }}>MAX SINGLE TRANSACTION CAP</span>
                  <strong style={{ fontSize: 24, color: "#2563eb" }}>₹{spendingLimits.maxLimit.toLocaleString("en-IN")}</strong>
                </div>

                <div style={{ fontSize: 12, color: "#475569", lineHeight: "1.6" }}>
                  {spendingLimits.requireHumanApproval ? "✓" : "✗"} All AI-generated orders require explicit 1-click human approval.<br />
                  {spendingLimits.autoBlockExceeded ? "✓" : "✗"} Transactions above limit are auto-blocked.
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveSpending} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>
                    MAX SINGLE TRANSACTION CAP (₹)
                  </label>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input
                      type="number"
                      min="500"
                      max="500000"
                      step="500"
                      value={spendingForm.maxLimit}
                      onChange={(e) => setSpendingForm({ ...spendingForm, maxLimit: e.target.value })}
                      required
                      style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 16, fontWeight: 700, color: "#2563eb", outline: "none" }}
                    />
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="500"
                    value={spendingForm.maxLimit}
                    onChange={(e) => setSpendingForm({ ...spendingForm, maxLimit: Number(e.target.value) })}
                    style={{ width: "100%", marginTop: 8, cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8" }}>
                    <span>₹1,000</span>
                    <span>₹25,000</span>
                    <span>₹50,000</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#334155", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={spendingForm.requireHumanApproval}
                      onChange={(e) => setSpendingForm({ ...spendingForm, requireHumanApproval: e.target.checked })}
                    />
                    Require 1-click human approval
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#334155", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={spendingForm.autoBlockExceeded}
                      onChange={(e) => setSpendingForm({ ...spendingForm, autoBlockExceeded: e.target.checked })}
                    />
                    Auto-block transactions above limit
                  </label>
                </div>

                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingSpending(false)}
                    style={{ padding: "6px 12px", background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: "6px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                  >
                    Save Cap
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div style={{ background: "white", padding: 20, borderRadius: 16, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <User size={18} color="#7c5cff" />
                <strong style={{ fontSize: 14, color: "#0f172a" }}>Default Shipping Address</strong>
              </div>
              {!isEditingAddress && (
                <button
                  onClick={() => {
                    setAddressForm(address);
                    setIsEditingAddress(true);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    background: "#f3e8ff",
                    color: "#7c5cff",
                    border: "1px solid #e9d5ff",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  <Edit2 size={12} /> Edit Address
                </button>
              )}
            </div>

            {!isEditingAddress ? (
              <div style={{ fontSize: 13, color: "#1e293b", lineHeight: "1.6" }}>
                <strong style={{ color: "#0f172a" }}>{address.fullName}</strong><br />
                {address.street}<br />
                {address.cityStatePin}<br />
                <span style={{ fontSize: 12, color: "#64748b", display: "block", marginTop: 4 }}>Phone: {address.phone}</span>
              </div>
            ) : (
              <form onSubmit={handleSaveAddress} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>Recipient Name</label>
                  <input
                    type="text"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    required
                    style={{ width: "100%", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13, outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>Street Address / Flat</label>
                  <input
                    type="text"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    required
                    style={{ width: "100%", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13, outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>Area, City, State & Pincode</label>
                  <input
                    type="text"
                    value={addressForm.cityStatePin}
                    onChange={(e) => setAddressForm({ ...addressForm, cityStatePin: e.target.value })}
                    required
                    style={{ width: "100%", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13, outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>Contact Phone</label>
                  <input
                    type="text"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    required
                    style={{ width: "100%", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13, outline: "none" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    style={{ padding: "6px 12px", background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: "6px 14px", background: "#7c5cff", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}

/* =========================================================
   MERCHANT DASHBOARD
========================================================= */

