export function formatAgentMessage(text) {
  if (!text) return "";

  let formatted = text;

  // Process bold text
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Process numbered features/advantages lists (e.g., "1. Ergonomic Design:" or "\n1. ")
  // Replaces raw list items with clean styled bullet cards
  formatted = formatted.replace(
    /(?:^|\s|\n)(\d+)\.\s+([^\n]+)/g,
    (match, num, body) => {
      // Check if body has a title separator like ":"
      const parts = body.split(":");
      let contentHtml = body;
      if (parts.length > 1) {
        contentHtml = `<strong>${parts[0].trim()}:</strong> ${parts.slice(1).join(":").trim()}`;
      } else {
        contentHtml = body.trim();
      }

      return `<div style="margin: 6px 0; padding: 8px 10px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; gap: 8px; align-items: flex-start; box-shadow: 0 1px 3px rgba(0,0,0,0.02);"><span style="background: #7c5cff; color: white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; margin-top: 1px;">${num}</span><div style="font-size: 12px; color: #1e293b; line-height: 1.45; flex: 1;">${contentHtml}</div></div>`;
    }
  );

  // Process bullet points (e.g. "• ", "- ", "* ")
  formatted = formatted.replace(
    /(?:^|\n)[•\-\*]\s*([^\n]+)/g,
    (match, body) => {
      return `<div style="margin: 5px 0; padding: 6px 10px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; gap: 8px; align-items: flex-start;"><span style="color: #7c5cff; font-weight: 800; font-size: 12px;">✦</span><div style="font-size: 12px; color: #1e293b; line-height: 1.45; flex: 1;">${body.trim()}</div></div>`;
    }
  );

  // Highlight closing questions (e.g., "Would you like to proceed with the checkout...")
  formatted = formatted.replace(
    /(Would you like to proceed.*?|Shall I prepare the checkout.*?|Would you like to add.*?)\??$/gi,
    (match) => {
      return `<div style="margin-top: 10px; padding: 8px 12px; background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; font-weight: 700; color: #3730a3; font-size: 12px; display: flex; align-items: center; gap: 6px;">💡 ${match}</div>`;
    }
  );

  // Convert line breaks to <br/>
  formatted = formatted.replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>");

  return formatted;
}

export function formatAuditReason(details, action) {
  if (!details) return "Event executed successfully after policy validation.";

  let parsed = details;
  if (typeof details === "string") {
    try {
      parsed = JSON.parse(details);
    } catch (e) {
      return details;
    }
  }

  if (typeof parsed === "object" && parsed !== null) {
    if (Array.isArray(parsed.items) && parsed.items.length > 0) {
      const itemsText = parsed.items
        .map((i) => `${i.quantity || 1}x ${i.product_name || "Product"}`)
        .join(", ");

      const totalPaise = parsed.items.reduce((s, i) => s + (i.price_paise || 0) * (i.quantity || 1), 0);
      const totalInr = totalPaise > 0 ? ` ₹${(totalPaise / 100).toLocaleString("en-IN")}` : "";

      if (action === "AI_CHECKOUT_GENERATED") {
        return `AI Agent generated checkout intent for ${itemsText}${totalInr}. (Source: ${parsed.source || "In-App AI"})`;
      }
      if (action === "PAYMENT_VERIFIED" || action === "PAYMENT_APPROVED") {
        return `Customer approved transaction for ${itemsText}${totalInr}. Razorpay test mode payment verified with HMAC signature.`;
      }
      return `Transaction for ${itemsText}${totalInr}. Policy validated.`;
    }

    if (parsed.message) return parsed.message;
    if (parsed.reason) return parsed.reason;
    if (parsed.note) return parsed.note;
  }

  return String(details);
}
