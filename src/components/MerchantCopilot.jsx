import { useState } from "react";
import {
  Bot,
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  X,
  ChevronRight,
} from "lucide-react";

export default function MerchantCopilot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I am your AI Growth Copilot. Ask me anything about your store's sales, conversion rates, or inventory opportunities." },
  ]);
  const [input, setInput] = useState("");

  function handleAsk(query) {
    const q = query || input;
    if (!q.trim()) return;

    const userMsg = { sender: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      let reply = "Based on live analytics, overall conversion rate is healthy at 94.2%. I recommend promoting low-stock accessories to boost your Average Order Value (AOV).";

      const lower = q.toLowerCase();
      if (lower.includes("revenue") || lower.includes("drop") || lower.includes("change")) {
        reply = "Revenue increased +18.4% this week primarily driven by AI-recommended sports bundles (+₹11,994). Running shoes and earbuds are top converting categories.";
      } else if (lower.includes("promote") || lower.includes("product") || lower.includes("item")) {
        reply = "I recommend promoting 'Campus Runner Pro Shoes' paired with 'Premium Sports Socks'. It has high search intent and a 24.3% cross-sell conversion rate.";
      } else if (lower.includes("campaign") || lower.includes("strategy")) {
        reply = "Launching a 'Low-Stock Inventory Surge' campaign with a 10% instant bundle discount will clear items with stock <= 5 and boost AOV by +₹350.";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 500);
  }

  return (
    <>
      <button
        className="merchant-copilot-btn"
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          padding: "12px 20px",
          background: "linear-gradient(135deg, #7c5cff, #2563eb)",
          color: "white",
          border: "none",
          borderRadius: 30,
          boxShadow: "0 8px 24px rgba(124, 92, 255, 0.4)",
          fontWeight: 800,
          fontSize: 13,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Bot size={18} /> AI Growth Copilot
      </button>

      {open && (
        <div
          className="merchant-copilot-drawer"
          style={{
            position: "fixed",
            bottom: 80,
            right: 24,
            width: 360,
            maxWidth: "calc(100vw - 32px)",
            height: 480,
            maxHeight: "calc(100vh - 100px)",
            background: "white",
            borderRadius: 20,
            boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            border: "1px solid #e2e8f0",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          <div style={{ padding: "14px 18px", background: "#0f172a", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} color="#7c5cff" />
              <strong style={{ fontSize: 14 }}>AI Growth Copilot</strong>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: 0, color: "#94a3b8", cursor: "pointer" }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ flex: 1, padding: 14, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  background: m.sender === "user" ? "#7c5cff" : "#f1f5f9",
                  color: m.sender === "user" ? "white" : "#0f172a",
                  padding: "10px 14px",
                  borderRadius: m.sender === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                  fontSize: 12,
                  lineHeight: 1.5,
                  maxWidth: "85%",
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div style={{ padding: "8px 12px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", gap: 6, overflowX: "auto" }}>
            {["Why revenue changed?", "Which product to promote?", "Suggest campaign"].map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleAsk(prompt)}
                style={{ padding: "4px 8px", background: "white", border: "1px solid #cbd5e1", borderRadius: 12, fontSize: 10, fontWeight: 700, color: "#475569", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            style={{ padding: 10, background: "white", borderTop: "1px solid #e2e8f0", display: "flex", gap: 8 }}
          >
            <input
              type="text"
              placeholder="Ask Copilot for store insights..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 10, fontSize: 12, outline: "none" }}
            />
            <button type="submit" style={{ padding: "8px 12px", background: "#7c5cff", color: "white", border: 0, borderRadius: 10, cursor: "pointer" }}>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
