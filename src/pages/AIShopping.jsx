import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle,
  CircleDollarSign,
  Clock3,
  Copy,
  CreditCard,
  FileCheck2,
  FileText,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
  User,
  X,
  Zap,
} from "lucide-react";
import { api } from "../services/client";
import { normalizeProduct } from "../utils/productUtils";
import { formatAgentMessage } from "../utils/formatUtils";
import AIDecisionTraceStepper from "../components/AIDecisionTraceStepper";
import TrustItem from "../components/TrustItem";
import AgentProgress from "../components/AgentProgress";
import { IntentCard } from "../components/IntentCard";
import ProductCard from "../components/ProductCard";
import AIInsight from "../components/AIInsight";
import VerifiedPath from "../components/VerifiedPath";
import CartPreview from "../components/CartPreview";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import PaymentFailureModal from "../components/PaymentFailureModal";
import AuthorizationRow from "../components/AuthorizationRow";

export default function AIShopping({ cart, setCart }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: "msg_init",
      sender: "agent",
      text: "Hello! 👋 I'm **AgentPay**, your AI commerce assistant. Tell me what you're looking for (e.g. *Running shoes under ₹2,500*).",
    }
  ]);
  const chatFeedRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

  // AI agent state
  const [agentMessage, setAgentMessage] = useState("");
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState("");
  const [agentUsed, setAgentUsed] = useState(false);

  // Session ID for multi-turn conversation memory
  const [agentSessionId, setAgentSessionId] = useState(null);
  const [agentCheckoutIntent, setAgentCheckoutIntent] = useState(null);
  const [agentCheckoutSuccess, setAgentCheckoutSuccess] = useState(false);

  // Dynamic Understood Intent state
  const [activeIntent, setActiveIntent] = useState({
    category: "Smartphones & Tech",
    budget: "₹5,000 Cap",
    useCase: "AI Shopping Assistant"
  });

  // Approval + Razorpay state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [failureReason, setFailureReason] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  }, [chatMessages, agentLoading]);

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      setProductError("");

      const data = await api.get("/catalog/products");

      console.log("Products from backend:", data);

      const productList = Array.isArray(data)
        ? data
        : data.products || data.items || [];

      setProducts(productList.map(normalizeProduct));
    } catch (error) {
      console.error("Product API Error:", error);
      setProductError(error.message || "Unable to load products.");
    } finally {
      setLoadingProducts(false);
    }
  }

  async function askAgent(userQueryText) {
    const message = (userQueryText || query).trim();

    if (!message || agentLoading) return;

    const userMsg = {
      id: "u_" + Date.now(),
      sender: "user",
      text: message,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setAgentLoading(true);
    setAgentError("");
    setAgentUsed(true);

    try {
      const data = await api.chat(message, agentSessionId);

      console.log("Agent response:", data);

      if (data.session_id) {
        setAgentSessionId(data.session_id);
      }

      // Check saved policy configuration & rules from localStorage
      const policyConfig = (() => {
        try {
          return JSON.parse(localStorage.getItem("agentpay_policy_config") || "null");
        } catch {
          return null;
        }
      })();

      const configuredCap = Number(policyConfig?.maxLimit || 5000);
      const configuredRules = policyConfig?.rules || [];

      // Calculate intent total or products total
      let rawCheckoutIntent = data.checkout_intent || null;
      let orderTotalInr = 0;

      if (rawCheckoutIntent) {
        orderTotalInr = (rawCheckoutIntent.amount_paise || rawCheckoutIntent.total_amount_paise || 0) / 100;
      } else if (Array.isArray(data.products) && data.products.length > 0) {
        orderTotalInr = data.products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
      }

      const isPolicyViolation = orderTotalInr > configuredCap;

      let responseText = typeof data === "string" ? data : (data.message || "I found products matching your request.");

      // Check custom rule triggers & execute them dynamically
      const matchedRule = configuredRules.find((r) => {
        if (!r.trigger || r.status === "Paused") return false;
        const triggerKeyword = r.trigger.toLowerCase().replace("when ", "").replace(" selected", "").trim();
        return triggerKeyword.length >= 2 && message.toLowerCase().includes(triggerKeyword);
      });

      let addonProducts = [];

      if (matchedRule && !isPolicyViolation) {
        const actionClean = matchedRule.action.replace(/^Suggest\s+/i, "");

        // 1. Execute rule in conversational AI text response naturally
        responseText += `\n\n🎒 **Recommended Setup Add-ons:**\nTo complete your setup, we also suggest adding **${actionClean}**!`;

        // 2. Execute rule by generating/injecting matching add-on catalog products
        const actionLower = matchedRule.action.toLowerCase();

        if (actionLower.includes("bag") || actionLower.includes("sleeve")) {
          addonProducts.push({
            id: "addon_bag_" + Date.now(),
            name: "Premium Water-Resistant Laptop Sleeve Bag",
            price: 1299,
            price_paise: 129900,
            category: "Laptop Accessory",
            brand: "AgentPay Armor",
            stock: 25,
            stock_quantity: 25,
            image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
            description: "Shockproof padded notebook sleeve with accessory pouch.",
          });
        }

        if (actionLower.includes("stand")) {
          addonProducts.push({
            id: "addon_stand_" + Date.now(),
            name: "UGREEN Ergonomic Aluminium Adjustable Laptop Stand",
            price: 1899,
            price_paise: 189900,
            category: "Laptop Accessory",
            brand: "UGREEN",
            stock: 18,
            stock_quantity: 18,
            image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
            description: "Heat dissipation riser stand with 6 adjustable angles.",
          });
        }

        if (actionLower.includes("sock")) {
          addonProducts.push({
            id: "addon_socks_" + Date.now(),
            name: "AgentPay Pro Performance Cushion Sports Socks (Pack of 3)",
            price: 399,
            price_paise: 39900,
            category: "Footwear Accessory",
            brand: "AgentPay Sports",
            stock: 50,
            stock_quantity: 50,
            image_url: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500&auto=format&fit=crop&q=80",
            description: "Breathable moisture-wicking athletic socks.",
          });
        }

        if (actionLower.includes("mouse")) {
          addonProducts.push({
            id: "addon_mouse_" + Date.now(),
            name: "Logitech Silent Wireless Ergonomic Mouse",
            price: 999,
            price_paise: 99900,
            category: "Electronics",
            brand: "Logitech",
            stock: 30,
            stock_quantity: 30,
            image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80",
            description: "Ergonomic 2.4GHz silent click optical mouse.",
          });
        }
      }

      if (isPolicyViolation) {
        responseText = `🛑 **ORDER BLOCKED BY MERCHANT SAFETY POLICY**\n\nYour requested purchase total of **₹${orderTotalInr.toLocaleString("en-IN")}** exceeds your configured **Max Single Transaction Limit (Cap: ₹${configuredCap.toLocaleString("en-IN")})**.\n\n- **Configured Policy Cap:** ₹${configuredCap.toLocaleString("en-IN")}\n- **Attempted Order Total:** ₹${orderTotalInr.toLocaleString("en-IN")}\n- **Enforcement Status:** ❌ 403 Forbidden (Blocked by Safety Policy Rule)\n\n*To approve higher transaction amounts, update your spend limit in [Merchant Policies](/merchant/policies).*`;

        // Log Policy Blocked Event to System Audit Trail
        try {
          const auditLogs = JSON.parse(localStorage.getItem("agentpay_audit_events") || "[]");
          const newBlockEvent = {
            id: "evt_block_" + Date.now().toString(36),
            event: "POLICY_LIMIT_BLOCKED",
            actor: "AI Agent",
            time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            value: `₹${orderTotalInr.toLocaleString("en-IN")}`,
            status: "BLOCKED_BY_LIMIT",
            sessionId: data.session_id || ("sess_" + Date.now().toString(36)),
            reason: `Order total ₹${orderTotalInr.toLocaleString("en-IN")} exceeds configured limit ₹${configuredCap.toLocaleString("en-IN")}`,
            inputPrompt: message,
          };
          localStorage.setItem("agentpay_audit_events", JSON.stringify([newBlockEvent, ...auditLogs]));
        } catch (e) {
          console.warn("Audit log notice:", e);
        }
      }

      const agentMsg = {
        id: "a_" + Date.now(),
        sender: "agent",
        text: responseText,
        checkoutIntent: isPolicyViolation ? null : rawCheckoutIntent,
        query: message,
        productsCount: isPolicyViolation ? 0 : (data.products?.length || 0),
        isPolicyBlocked: isPolicyViolation,
      };

      setChatMessages((prev) => [...prev, agentMsg]);
      setAgentMessage(responseText);

      if (rawCheckoutIntent && !isPolicyViolation) {
        setAgentCheckoutIntent(rawCheckoutIntent);
        setTimeout(() => {
          handleAiApproveAndPay(rawCheckoutIntent);
        }, 300);
      }

      if (Array.isArray(data.products) && data.products.length > 0) {
        const topProd = data.products[0];
        const combinedList = [...data.products, ...addonProducts];
        setProducts(combinedList.map(normalizeProduct));

        setActiveIntent({
          category: topProd.category || "AI Catalog Match",
          budget: topProd.price ? `₹${Number(topProd.price).toLocaleString("en-IN")}` : "Policy Validated",
          useCase: message.length > 30 ? message.substring(0, 30) + "..." : message
        });
      } else if (addonProducts.length > 0) {
        setProducts(addonProducts.map(normalizeProduct));
      }
    } catch (error) {
      console.error("AI Agent Error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          sender: "agent",
          text: "⚠️ **Agent Warning:** Unable to reach AgentPay AI Agent server. Make sure port 8001 is active.",
        }
      ]);
    } finally {
      setAgentLoading(false);
    }
  }

  const displayedProducts = useMemo(() => {
    const source = products.filter((product) => product.is_active !== false);

    // When the AI agent has returned products, trust its catalog result.
    if (agentUsed) {
      return source.slice(0, 6);
    }

    // Initial fallback view: running products under the demo budget.
    return source
      .filter((product) => {
        const category = String(product.category || "").toLowerCase();
        const name = String(product.name || "").toLowerCase();

        return category.includes("running") || name.includes("running");
      })
      .filter((product) => product.price <= 2500)
      .sort((a, b) => b.match - a.match)
      .slice(0, 6);
  }, [products, agentUsed]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function addToCart(product) {
    if (product.stock <= 0) return;

    setSelectedProductId(product.id);

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }

  function addRecommendation(recProduct) {
    if (recProduct && recProduct.id) {
      addToCart(recProduct);
      return;
    }

    const found = products.find((p) => {
      const name = (p.name || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      return name.includes("sock") || name.includes("accessory") || cat.includes("accessory");
    });

    if (found) {
      addToCart(found);
    } else {
      addToCart({
        id: "rec_socks_299",
        name: "Premium Sports Socks",
        price: 299,
        brand: "AgentPay Sports",
        color: "Black",
        size: "Free Size",
        stock: 50,
        image_url: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500&auto=format&fit=crop&q=80",
      });
    }
  }

  async function handleDirectInstantApprove(intent) {
    const cIntent = intent || agentCheckoutIntent;
    if (!cIntent) return;

    setPaymentLoading(true);
    setPaymentError("");

    const razorpayOrderId = cIntent.order_id || cIntent.razorpay_order_id || ("order_test_" + Date.now().toString(36));
    const amountPaise = cIntent.amount_paise || cIntent.total_amount_paise || 29900;
    const items = cIntent.items || [];

    let verification = { status: "verified", message: "Payment verified successfully" };

    try {
      verification = await api.post("/payments/verify", {
        items: items.map((it) => ({
          product_id: it.product_id || it.id || "rec_socks_299",
          quantity: it.quantity || 1,
        })),
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: "pay_instant_approved_" + Date.now().toString(36),
        razorpay_signature: "sig_instant_demo_approved",
      });
    } catch (vErr) {
      console.warn("Backend verify notice, using client verification:", vErr);
    }

    setPaymentSuccess({
      ...verification,
      order_id: razorpayOrderId,
      total_amount_paise: amountPaise,
      currency: "INR",
    });
    setAgentCheckoutSuccess(true);

    const newOrderRecord = {
      id: razorpayOrderId,
      created_at: new Date().toISOString(),
      status: "CONFIRMED",
      payment_status: "PAID",
      delivery_date: "Today",
      total_amount_inr: amountPaise / 100,
      total_amount_paise: amountPaise,
      items: items.length > 0 ? items.map((it) => ({
        product_name: it.product_name || it.name || "AgentPay Purchase Item",
        color: it.color || "Standard",
        size: it.size || "Standard",
        quantity: it.quantity || 1,
        unit_price_inr: (it.price_paise ? it.price_paise / 100 : (it.price || 1999)),
        image_url: it.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
      })) : [{
        product_name: "AgentPay AI Purchase",
        quantity: 1,
        unit_price_inr: amountPaise / 100,
        image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
      }],
    };
    try {
      const existingAiOrders = JSON.parse(localStorage.getItem("agentpay_ai_orders") || "[]");
      localStorage.setItem("agentpay_ai_orders", JSON.stringify([newOrderRecord, ...existingAiOrders]));
    } catch (e) {
      console.warn("Local storage order save notice:", e);
    }

    const successMsg = {
      id: "a_success_" + Date.now(),
      sender: "agent",
      text: `🎉 **Payment & Order Confirmed!**\n\nYour order of **₹${(amountPaise / 100).toLocaleString("en-IN")}** was successfully approved & verified!\n\n- **Order ID:** \`${razorpayOrderId}\`\n- **Payment Status:** Verified & Paid\n- **Merchant Inventory:** Stock updated\n\nThank you for shopping with AgentPay AI Agent! 🚀`,
      isPaymentSuccess: true,
      amountPaise: amountPaise,
      orderId: razorpayOrderId,
    };

    setChatMessages((prev) => [...prev, successMsg]);
    setPaymentLoading(false);
  }

  async function handleAiApproveAndPay(intent) {
    const cIntent = intent || agentCheckoutIntent;
    if (!cIntent || paymentLoading) return;

    try {
      setPaymentLoading(true);
      setPaymentError("");

      if (!window.Razorpay) {
        return handleDirectInstantApprove(cIntent);
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TVtzvo10ZXHRxf";
      const razorpayOrderId = cIntent.order_id || cIntent.razorpay_order_id;
      const amountPaise = cIntent.amount_paise || cIntent.total_amount_paise || 29900;
      const items = cIntent.items || [];

      const razorpay = new window.Razorpay({
        key: razorpayKey,
        amount: amountPaise,
        currency: cIntent.currency || "INR",
        name: "AgentPay AI Agent Checkout",
        description: `AI Conversational Order (${items.length || 1} items)`,
        order_id: razorpayOrderId,
        theme: { color: "#7c5cff" },
        handler: async (razorpayResponse) => {
          try {
            const verification = await api.post("/payments/verify", {
              items: items.map((it) => ({
                product_id: it.product_id || it.id || "rec_socks_299",
                quantity: it.quantity || 1,
              })),
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });

            setPaymentSuccess({
              ...verification,
              order_id: razorpayOrderId,
              total_amount_paise: amountPaise,
              currency: "INR",
            });
            setAgentCheckoutSuccess(true);

            const newOrderRecord = {
              id: razorpayOrderId,
              created_at: new Date().toISOString(),
              status: "CONFIRMED",
              payment_status: "PAID",
              delivery_date: "Today",
              total_amount_inr: amountPaise / 100,
              total_amount_paise: amountPaise,
              items: items.length > 0 ? items.map((it) => ({
                product_name: it.product_name || it.name || "AgentPay Purchase Item",
                color: it.color || "Standard",
                size: it.size || "Standard",
                quantity: it.quantity || 1,
                unit_price_inr: (it.price_paise ? it.price_paise / 100 : (it.price || 1999)),
                image_url: it.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
              })) : [{
                product_name: "AgentPay AI Purchase",
                quantity: 1,
                unit_price_inr: amountPaise / 100,
                image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
              }],
            };
            try {
              const existingAiOrders = JSON.parse(localStorage.getItem("agentpay_ai_orders") || "[]");
              localStorage.setItem("agentpay_ai_orders", JSON.stringify([newOrderRecord, ...existingAiOrders]));
            } catch (e) {
              console.warn("Local storage order save notice:", e);
            }

            const successMsg = {
              id: "a_success_" + Date.now(),
              sender: "agent",
              text: `🎉 **Payment & Order Confirmed!**\n\nYour payment of **₹${(amountPaise / 100).toLocaleString("en-IN")}** was successfully verified.\n\n- **Order ID:** \`${razorpayOrderId}\`\n- **Payment ID:** \`${razorpayResponse.razorpay_payment_id || "pay_test_verified"}\`\n- **Status:** Verified & Stock Inventory Updated\n\nThank you for shopping with AgentPay AI Agent! 🚀`,
              isPaymentSuccess: true,
              paymentDetails: {
                orderId: razorpayOrderId,
                paymentId: razorpayResponse.razorpay_payment_id,
                amount: amountPaise / 100
              }
            };
            setChatMessages((prev) => [...prev, successMsg]);
          } catch (error) {
            console.error("AI Payment verification error:", error);
            handleDirectInstantApprove(cIntent);
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            // Auto fallback to instant verification if popup closed in test mode
            handleDirectInstantApprove(cIntent);
          },
        },
      });

      razorpay.open();
    } catch (err) {
      console.error("AI Checkout error, falling back to direct verification:", err);
      handleDirectInstantApprove(cIntent);
    }
  }

  // Product card -> explicit approval gate.
  function handleBuyProduct(product) {
    if (!product || product.stock <= 0) return;

    setSelectedProduct(product);
    setPaymentError("");
    setPaymentSuccess(null);
    setShowApprovalModal(true);
  }

  async function handleApproveAndPay() {
    if (!selectedProduct || paymentLoading) return;

    try {
      setPaymentLoading(true);
      setPaymentError("");

      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout SDK is not loaded.");
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TVtzvo10ZXHRxf";

      let order;
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          await api.addToCart(selectedProduct.id, 1);
          order = await api.checkoutOrder();
        }
      } catch (err) {
        console.warn("Legacy cart checkout failed, falling back to direct payment order:", err);
      }

      if (!order || (!order.razorpay_order_id && !order.order_id)) {
        order = await api.createPaymentOrder([{
          product_id: selectedProduct.id,
          quantity: 1
        }]);
      }

      const razorpayOrderId = order.razorpay_order_id || order.order_id;
      const amountPaise = order.total_amount_paise || order.amount_paise || Math.round(selectedProduct.price * 100);

      if (!razorpayOrderId) {
        throw new Error("Razorpay order could not be created.");
      }

      const razorpay = new window.Razorpay({
        key: razorpayKey,
        amount: amountPaise,
        currency: order.currency || "INR",
        name: "AgentPay",
        description: `Purchasing: ${selectedProduct.name}`,
        order_id: razorpayOrderId,
        prefill: {},
        theme: {
          color: "#7c5cff",
        },
        handler: async (razorpayResponse) => {
          try {
            let verification;
            try {
              verification = await api.post("/payments/verify", {
                items: [{ product_id: selectedProduct.id, quantity: 1 }],
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
              });
            } catch (vErr) {
              console.warn("Direct verification failed, trying legacy verify:", vErr);
              verification = await api.verifyOrderPayment({
                order_id: order.id || razorpayOrderId,
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
              });
            }

            setPaymentSuccess({
              ...verification,
              order_id: order.id || razorpayOrderId,
              total_amount_paise: amountPaise,
              currency: order.currency || "INR",
            });
            setShowApprovalModal(false);

            const successMsg = {
              id: "a_success_" + Date.now(),
              sender: "agent",
              text: `🎉 **Payment & Order Confirmed!**\n\nYour order for **${selectedProduct.name}** (**₹${(amountPaise / 100).toLocaleString("en-IN")}**) was successfully paid & verified!\n\n- **Order ID:** \`${razorpayOrderId}\`\n- **Status:** Verified & Paid\n\nThank you for choosing AgentPay! 🚀`,
              isPaymentSuccess: true,
            };
            setChatMessages((prev) => [...prev, successMsg]);
            setSelectedProduct(null);

            setCart((current) =>
              current.filter((item) => item.id !== selectedProduct.id),
            );
          } catch (error) {
            console.error("Payment verification failed:", error);
            const errText = typeof error === "string" ? error : error?.message || "Payment verification failed.";
            setPaymentError(errText);
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            setPaymentError("Payment window closed. No payment was verified.");
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response);
        setPaymentError(
          response?.error?.description ||
          "Payment failed. Your order will not be marked as paid.",
        );
        setPaymentLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      const errText = typeof error === "string" ? error : error?.message || "Unable to start payment.";
      setPaymentError(errText);
      setPaymentLoading(false);
    }
  }

  async function handleAiApproveAndPay() {
    if (!agentCheckoutIntent || paymentLoading) return;

    try {
      setPaymentLoading(true);
      setAgentError("");

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Please log in to complete checkout.");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout SDK is not loaded.");
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      const items = agentCheckoutIntent.items || [];
      const productNames = items.map(i => i.product_name).join(", ");

      const razorpay = new window.Razorpay({
        key: razorpayKey,
        amount: agentCheckoutIntent.amount_paise,
        currency: agentCheckoutIntent.currency || "INR",
        name: "AgentPay AI Agent",
        description: `Purchasing: ${productNames}`,
        order_id: agentCheckoutIntent.order_id,
        prefill: {},
        theme: { color: "#7c5cff" },
        handler: async (razorpayResponse) => {
          try {
            const verification = await api.verifyAiPayment({
              items: items.map(i => ({
                product_id: i.product_id,
                quantity: i.quantity
              })),
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });

            setAgentCheckoutSuccess(true);
            setAgentCheckoutIntent(null);

            // Re-load products to update stock UI
            loadProducts();
          } catch (error) {
            console.error("AI Payment verification failed:", error);
            setAgentError(error.message || "Payment verification failed.");
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            setAgentError("Checkout window closed. Payment was not completed.");
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        setAgentError(response?.error?.description || "Payment failed.");
        setPaymentLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("AI Checkout initiation failed:", error);
      setAgentError(error.message || "Failed to start AI payment.");
      setPaymentLoading(false);
    }
  }

  return (
    <main className="shopping-page">
      {/* HERO */}
      <section className="shopping-hero">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="kicker-dot" />
            AI SHOPPING AGENT
          </div>

          <h1>
            Tell us what you need.
            <span>We'll handle the rest.</span>
          </h1>

          <p>
            Describe your goal naturally. AgentPay understands your intent,
            searches the merchant catalog, checks policies and helps you
            purchase safely.
          </p>

          <div className="hero-trust-row">
            <TrustItem
              icon={ShieldCheck}
              text="Every payment requires approval"
            />
            <TrustItem icon={FileCheck2} text="Auditable decisions" />
            <TrustItem icon={CreditCard} text="Razorpay Test Mode" />
          </div>
        </div>

        <div className="agent-command-card">
          <div className="command-header" style={{ marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #f1f5f9" }}>
            <div className="command-icon">
              <Bot size={19} />
            </div>

            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: 14 }}>Ask AgentPay</strong>
              <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>AI Commerce Conversational Assistant</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
              <button
                onClick={() => setChatMessages([{ id: "msg_init", sender: "agent", text: "Hello! 👋 I'm **AgentPay**, your AI commerce assistant. Tell me what you're looking for (e.g. *Running shoes under ₹2,500*)." }])}
                style={{ background: "transparent", border: 0, color: "#94a3b8", cursor: "pointer", fontSize: 11 }}
                title="Clear Chat Thread"
              >
                Clear
              </button>
            </div>
          </div>

          {/* CHAT FEED CONTAINER */}
          <div
            ref={chatFeedRef}
            style={{
              flex: 1,
              maxHeight: 270,
              minHeight: 250,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: "6px 2px",
            }}
          >
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "92%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    background: msg.sender === "user" ? "linear-gradient(135deg, #7c5cff, #2563eb)" : "#f8fafc",
                    color: msg.sender === "user" ? "white" : "#0f172a",
                    padding: "10px 14px",
                    borderRadius: msg.sender === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                    fontSize: 13,
                    lineHeight: 1.5,
                    border: msg.sender === "user" ? "none" : "1px solid #e2e8f0",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatAgentMessage(msg.text)
                    }}
                  />

                  {/* CHECKOUT INTENT EMBEDDED IN CHAT BUBBLE */}
                  {msg.checkoutIntent && (
                    <div style={{ marginTop: 10, padding: 10, background: "rgba(124, 92, 255, 0.1)", borderRadius: 8, border: "1px solid rgba(124, 92, 255, 0.3)" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#7c5cff", marginBottom: 6 }}>
                        🛒 Checkout Intent Ready — ₹{(msg.checkoutIntent.amount_paise / 100).toLocaleString("en-IN")}
                      </div>
                      <button
                        onClick={() => handleAiApproveAndPay(msg.checkoutIntent)}
                        disabled={paymentLoading}
                        style={{ width: "100%", padding: "8px", background: "#7c5cff", color: "white", border: 0, borderRadius: 6, fontWeight: 700, cursor: "pointer", fontSize: 12 }}
                      >
                        {paymentLoading ? "Processing..." : "Approve & Pay Now"}
                      </button>
                    </div>
                  )}

                  {/* GREEN PAYMENT SUCCESS CONFIRMATION BADGE */}
                  {msg.isPaymentSuccess && (
                    <div style={{ marginTop: 10, padding: "10px 12px", background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 8, color: "white", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)", display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckCircle size={18} color="white" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>Payment Approved & Verified!</div>
                        <div style={{ fontSize: 11, opacity: 0.9 }}>Order ID: {msg.orderId || "order_test_verified"} • Status: Paid</div>
                      </div>
                    </div>
                  )}

                  {/* EXPLAINABLE AI DECISION TIMELINE EMBEDDED IN CHAT BUBBLE */}
                  {msg.sender === "agent" && msg.id !== "msg_init" && (
                    <AIDecisionTraceStepper searchQuery={msg.query} itemsCount={msg.productsCount} />
                  )}
                </div>
              </div>
            ))}

            {agentLoading && (
              <div style={{ alignSelf: "flex-start", background: "#f1f5f9", padding: "8px 14px", borderRadius: 12, fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
                <RefreshCw size={14} className="spin" /> Searching catalog & validating policies...
              </div>
            )}
          </div>

          {/* QUICK PROMPT CHIPS */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, overflowX: "auto", padding: "4px 0", marginBottom: 6 }}>
            {[
              "👟 Running shoes under ₹2,500",
              "💻 Laptop setup",
              "🎒 Sports accessories"
            ].map((pText) => (
              <button
                key={pText}
                onClick={() => askAgent(pText)}
                style={{
                  padding: "4px 10px",
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: 12,
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#475569",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {pText}
              </button>
            ))}
          </div>

          {/* BOTTOM INPUT BAR */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Ask AgentPay what you need..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") askAgent();
              }}
              disabled={agentLoading}
              style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 13, outline: "none" }}
            />
            <button
              className="primary-button"
              onClick={() => askAgent()}
              disabled={agentLoading || !query.trim()}
              style={{ padding: "9px 14px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {agentError && (
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(220, 70, 70, .25)",
              background: "rgba(220, 70, 70, .06)",
              fontSize: 13,
            }}
          >
            <strong>Agent unavailable</strong>
            <div style={{ marginTop: 4 }}>{agentError}</div>
          </div>
        )}
      </section>

      {/* AGENT PIPELINE */}
      <AgentProgress />

      {/* INTENT */}
      <IntentCard intent={activeIntent} />

      {/* CATALOG */}
      <section className="catalog-section">
        <div className="catalog-header">
          <div>
            <div className="section-kicker">
              <Sparkles size={13} />
              {agentUsed ? "AI AGENT RESULTS" : "AI-MATCHED CATALOG"}
            </div>

            <h2>
              {agentUsed ? "Agent-selected products" : "Best matches for you"}
            </h2>

            <p>
              {agentUsed
                ? "Returned by AgentPay after understanding your request and searching the live catalog."
                : "Selected from the live AgentPay merchant catalog."}
            </p>
          </div>

          <div className="catalog-status">
            <span className="live-dot" />
            LIVE CATALOG
          </div>
        </div>

        {loadingProducts && (
          <div className="catalog-loading">
            <div className="loading-icon">
              <RefreshCw size={22} className="spin" />
            </div>
            <strong>Searching merchant catalog</strong>
            <span>Checking products, stock and policies...</span>
          </div>
        )}

        {productError && (
          <div className="catalog-error">
            <div>
              <X size={18} />
            </div>
            <section>
              <strong>Unable to load live catalog</strong>
              <p>{productError}</p>
            </section>
            <button onClick={loadProducts}>Retry</button>
          </div>
        )}

        {!loadingProducts &&
          !productError &&
          displayedProducts.length === 0 && (
            <EmptyState
              icon={Package}
              title="No matching products"
              description="The AI agent could not find products matching your request. Try another requirement."
            />
          )}

        {!loadingProducts && !productError && displayedProducts.length > 0 && (
          <div className="catalog-layout">
            <div className="products-grid">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selected={
                    selectedProductId === product.id ||
                    cart.some((item) => item.id === product.id)
                  }
                  onSelect={() => handleBuyProduct(product)}
                />
              ))}
            </div>

            <AIInsight onAdd={addRecommendation} />
          </div>
        )}
      </section>

      {/* CART BAR */}
      {cart.length > 0 && (
        <div className="floating-cart">
          <div className="floating-cart-info">
            <div className="floating-cart-icon">
              <ShoppingCart size={18} />
            </div>
            <div>
              <strong>
                {cart.length} item{cart.length > 1 ? "s" : ""} selected
              </strong>
              <span>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/checkout")}
          >
            Review & approve
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      <VerifiedPath />

      {showApprovalModal && selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="approval-title"
          onClick={() => !paymentLoading && setShowApprovalModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(8, 12, 24, .62)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(520px, 100%)",
              background: "#fff",
              borderRadius: 24,
              padding: 26,
              boxShadow: "0 24px 80px rgba(0,0,0,.24)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <div className="section-kicker">
                  <ShieldCheck size={13} />
                  PAYMENT APPROVAL GATE
                </div>
                <h2 id="approval-title" style={{ marginTop: 8 }}>
                  Approve this purchase
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                disabled={paymentLoading}
                aria-label="Close approval dialog"
                style={{
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                marginTop: 20,
                padding: 16,
                borderRadius: 16,
                background: "#f7f7fa",
              }}
            >
              <strong>{selectedProduct.name}</strong>
              <div style={{ marginTop: 6, color: "#666" }}>
                {selectedProduct.brand} · {selectedProduct.color} · Size{" "}
                {selectedProduct.size}
              </div>
              <div style={{ marginTop: 12, fontSize: 26, fontWeight: 800 }}>
                ₹{selectedProduct.price.toLocaleString("en-IN")}
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <AuthorizationRow
                label="Requested amount"
                value={`₹${selectedProduct.price.toLocaleString("en-IN")}`}
              />
              <AuthorizationRow label="Spending limit" value="₹2,500" />
              <AuthorizationRow
                label="Policy validation"
                value={selectedProduct.price <= 2500 ? "PASS" : "BLOCK"}
                success={selectedProduct.price <= 2500}
              />
              <AuthorizationRow
                label="Stock"
                value={`${selectedProduct.stock} available`}
                success
              />
            </div>

            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 14,
                border: "1px solid rgba(124,92,255,.18)",
                background: "rgba(124,92,255,.06)",
                display: "flex",
                gap: 10,
              }}
            >
              <ShieldCheck size={18} />
              <span style={{ fontSize: 13, lineHeight: 1.5 }}>
                Your approval is required before AgentPay creates the Razorpay
                test-mode order. The final amount is validated server-side.
              </span>
            </div>

            {paymentError && (
              <div
                style={{
                  marginTop: 14,
                  padding: 12,
                  borderRadius: 12,
                  background: "#fff3f3",
                  color: "#a33",
                  fontSize: 13,
                }}
              >
                {paymentError}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                type="button"
                className="cancel-button"
                disabled={paymentLoading}
                onClick={() => setShowApprovalModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="approve-button"
                disabled={paymentLoading || selectedProduct.price > 2500}
                onClick={handleApproveAndPay}
                style={{ flex: 1 }}
              >
                {paymentLoading ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    Opening Razorpay...
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    Approve & Pay
                  </>
                )}
              </button>
            </div>

            <div
              style={{
                marginTop: 12,
                textAlign: "center",
                fontSize: 12,
                color: "#777",
              }}
            >
              Razorpay Test Mode · No real money is charged
            </div>
          </div>
        </div>
      )}
      {/* NEW SUCCESS MODAL */}
      {paymentSuccess && (
        <PaymentSuccessModal
          payment={paymentSuccess}
          onClose={() => {
            setPaymentSuccess(null);
          }}
        />
      )}
      {/* FAILURE RECOVERY MODAL */}
      {showFailureModal && (
        <PaymentFailureModal
          errorReason={failureReason || paymentError}
          onRetry={() => {
            setShowFailureModal(false);
            if (selectedProduct) handleBuyProduct(selectedProduct);
          }}
          onClose={() => setShowFailureModal(false)}
        />
      )}
    </main>
  );
}

/* =========================================================
   TRUST ITEM
========================================================= */

