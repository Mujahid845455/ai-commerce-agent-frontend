const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const AI_AGENT_URL = import.meta.env.VITE_AI_AGENT_URL || "http://127.0.0.1:8001";

export function getAccessToken() {
  return localStorage.getItem("access_token");
}

async function request(endpoint, options = {}) {
  const token = getAccessToken();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  let responseData;

  if (contentType && contentType.includes("application/json")) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    throw new Error(
      typeof responseData === "string"
        ? responseData
        : responseData.detail || "Your session has expired. Please login again."
    );
  }

  if (!response.ok) {
    const errorDetails =
      typeof responseData === "string"
        ? responseData
        : typeof responseData?.detail === "string"
        ? responseData.detail
        : Array.isArray(responseData?.detail)
        ? responseData.detail.map((err) => err.msg || err.detail || JSON.stringify(err)).join(", ")
        : responseData?.detail
        ? JSON.stringify(responseData.detail)
        : `API Error ${response.status}`;

    throw new Error(errorDetails);
  }

  return responseData;
}

export async function login(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const authData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(authData.detail || "Login failed");
  }

  if (!authData.access_token) {
    throw new Error("Login succeeded but no access token was returned.");
  }

  localStorage.setItem("access_token", authData.access_token);
  return authData;
}

export function logout() {
  localStorage.removeItem("access_token");
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

async function agentRequest(endpoint, options = {}) {
  const token = getAccessToken();

  const response = await fetch(`${AI_AGENT_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type");
  let agentResponseData;

  if (contentType && contentType.includes("application/json")) {
    agentResponseData = await response.json();
  } else {
    agentResponseData = await response.text();
  }

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    throw new Error("Your session has expired. Please login again.");
  }

  if (!response.ok) {
    throw new Error(
      typeof agentResponseData === "string"
        ? agentResponseData
        : agentResponseData.detail || `AI Agent Error ${response.status}`
    );
  }

  return agentResponseData;
}

export const api = {
  get(endpoint) {
    return request(endpoint);
  },

  post(endpoint, body = {}) {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body = {}) {
    return request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  patch(endpoint, body = {}) {
    return request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return request(endpoint, {
      method: "DELETE",
    });
  },

  login(email, password) {
    return login(email, password);
  },

  logout() {
    logout();
  },

  me() {
    return request("/auth/me");
  },

  getProducts() {
    return request("/products/");
  },

  getProduct(productId) {
    return request(`/products/${productId}`);
  },

  getCatalogProducts() {
    return request("/catalog/products");
  },

  searchCatalog(query, maxPrice = null) {
    let url = `/catalog/search?q=${encodeURIComponent(query)}`;
    if (maxPrice !== null) {
      url += `&max_price=${maxPrice}`;
    }
    return request(url);
  },

  addToCart(productId, quantity = 1) {
    return request("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        product_id: productId,
        quantity,
      }),
    });
  },

  getCart() {
    return request("/cart");
  },

  updateCartItem(productId, quantity) {
    return request("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({
        product_id: productId,
        quantity,
      }),
    });
  },

  removeCartItem(productId) {
    return request(`/cart/items/${productId}`, {
      method: "DELETE",
    });
  },

  checkoutOrder() {
    return request("/orders/checkout", {
      method: "POST",
    });
  },

  getOrders() {
    return request("/orders");
  },

  verifyOrderPayment(paymentDetails) {
    return request("/orders/payment/verify", {
      method: "POST",
      body: JSON.stringify(paymentDetails),
    });
  },

  verifyAiPayment(paymentDetails) {
    return request("/payments/verify", {
      method: "POST",
      body: JSON.stringify(paymentDetails),
    });
  },

  chat(message, sessionId = null) {
    return agentRequest("/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        session_id: sessionId || null,
      }),
    });
  },

  getAnalyticsOverview() {
    return request("/analytics/overview");
  },

  getAnalyticsOrders(limit = 20) {
    return request(`/analytics/orders?limit=${limit}`);
  },

  getAuditLogs(limit = 50) {
    return request(`/analytics/audit?limit=${limit}`);
  },

  getRevenue() {
    return request("/analytics/revenue");
  },

  getMerchantProducts() {
    return request("/products/");
  },

  createProduct(productData) {
    return request("/products/", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  updateProduct(id, productData) {
    return request(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(productData),
    });
  },

  deactivateProduct(id) {
    return request(`/products/${id}`, {
      method: "DELETE",
    });
  },

  getMerchantConversations(limit = 20) {
    return request(`/conversations/merchant/list?limit=${limit}`);
  },

  createPaymentOrder(items) {
    return request("/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  },
};

export { API_URL, AI_AGENT_URL, request };