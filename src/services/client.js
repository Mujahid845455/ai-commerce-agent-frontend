const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const AI_AGENT_URL =
  import.meta.env.VITE_AI_AGENT_URL ||
  "http://127.0.0.1:8001";


// ============================================================
// TOKEN
// ============================================================

export function getAccessToken() {
  return localStorage.getItem("access_token");
}


// ============================================================
// NORMAL API REQUEST
// ============================================================

async function request(endpoint, options = {}) {

  const token = getAccessToken();

  const headers = {
    ...(options.body
      ? {
        "Content-Type": "application/json",
      }
      : {}),

    ...(token
      ? {
        Authorization: `Bearer ${token}`,
      }
      : {}),

    ...(options.headers || {}),
  };

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const contentType =
    response.headers.get("content-type");

  let data;

  if (
    contentType &&
    contentType.includes("application/json")
  ) {
    data = await response.json();
  } else {
    data = await response.text();
  }


  // ==========================================================
  // AUTH ERROR
  // ==========================================================

  if (response.status === 401) {

    console.error(
      "AUTH ERROR:",
      data
    );

    localStorage.removeItem(
      "access_token"
    );

    throw new Error(
      typeof data === "string"
        ? data
        : data.detail ||
        "Your session has expired. Please login again."
    );
  }


  // ==========================================================
  // OTHER ERROR
  // ==========================================================

  if (!response.ok) {
    const errorMsg =
      typeof data === "string"
        ? data
        : typeof data?.detail === "string"
        ? data.detail
        : Array.isArray(data?.detail)
        ? data.detail.map(e => e.msg || e.detail || JSON.stringify(e)).join(", ")
        : data?.detail
        ? JSON.stringify(data.detail)
        : `API Error ${response.status}`;

    throw new Error(errorMsg);
  }

  return data;
}


// ============================================================
// LOGIN
// ============================================================

export async function login(
  email,
  password
) {

  const formData =
    new URLSearchParams();

  formData.append(
    "username",
    email
  );

  formData.append(
    "password",
    password
  );


  const response =
    await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body: formData,
      }
    );


  const data =
    await response
      .json()
      .catch(() => ({}));


  if (!response.ok) {

    throw new Error(
      data.detail ||
      "Login failed"
    );
  }


  if (!data.access_token) {

    throw new Error(
      "Login succeeded but no access token was returned."
    );
  }


  // SAVE TOKEN
  localStorage.setItem(
    "access_token",
    data.access_token
  );


  console.log(
    "LOGIN SUCCESS — TOKEN SAVED"
  );


  return data;
}


// ============================================================
// LOGOUT
// ============================================================

export function logout() {

  localStorage.removeItem(
    "access_token"
  );
}


// ============================================================
// AUTH STATUS
// ============================================================

export function isAuthenticated() {

  return Boolean(
    getAccessToken()
  );
}


// ============================================================
// AI AGENT REQUEST
// ============================================================

async function agentRequest(
  endpoint,
  options = {}
) {

  const token =
    getAccessToken();


  const response =
    await fetch(
      `${AI_AGENT_URL}${endpoint}`,
      {
        ...options,

        headers: {

          "Content-Type":
            "application/json",

          ...(token
            ? {
              Authorization:
                `Bearer ${token}`,
            }
            : {}),

          ...(options.headers || {}),
        },
      }
    );


  const contentType =
    response.headers.get(
      "content-type"
    );


  let data;


  if (
    contentType &&
    contentType.includes(
      "application/json"
    )
  ) {

    data =
      await response.json();

  } else {

    data =
      await response.text();
  }


  if (response.status === 401) {

    localStorage.removeItem(
      "access_token"
    );

    throw new Error(
      "Your session has expired. Please login again."
    );
  }


  if (!response.ok) {

    throw new Error(
      typeof data === "string"
        ? data
        : data.detail ||
        `AI Agent Error ${response.status}`
    );
  }


  return data;
}


// ============================================================
// API OBJECT
// ============================================================

export const api = {

  // ----------------------------------------------------------
  // GENERIC
  // ----------------------------------------------------------

  get(endpoint) {

    return request(endpoint);
  },


  post(
    endpoint,
    body = {}
  ) {

    return request(
      endpoint,
      {
        method: "POST",

        body:
          JSON.stringify(body),
      }
    );
  },


  put(
    endpoint,
    body = {}
  ) {

    return request(
      endpoint,
      {
        method: "PUT",

        body:
          JSON.stringify(body),
      }
    );
  },


  patch(
    endpoint,
    body = {}
  ) {

    return request(
      endpoint,
      {
        method: "PATCH",

        body:
          JSON.stringify(body),
      }
    );
  },


  delete(endpoint) {

    return request(
      endpoint,
      {
        method: "DELETE",
      }
    );
  },


  // ----------------------------------------------------------
  // AUTH
  // ----------------------------------------------------------

  login(
    email,
    password
  ) {

    return login(
      email,
      password
    );
  },


  logout() {

    logout();
  },


  me() {

    return request(
      "/auth/me"
    );
  },


  // ----------------------------------------------------------
  // PRODUCTS
  // ----------------------------------------------------------

  getProducts() {

    return request(
      "/products/"
    );
  },


  getProduct(
    productId
  ) {

    return request(
      `/products/${productId}`
    );
  },


  // ----------------------------------------------------------
  // CATALOG
  // ----------------------------------------------------------

  getCatalogProducts() {

    return request(
      "/catalog/products"
    );
  },


  searchCatalog(
    query,
    maxPrice = null
  ) {

    let url =
      `/catalog/search?q=${encodeURIComponent(
        query
      )}`;


    if (maxPrice !== null) {

      url +=
        `&max_price=${maxPrice}`;
    }


    return request(url);
  },


  // ----------------------------------------------------------
  // CART
  // ----------------------------------------------------------

  addToCart(
    productId,
    quantity = 1
  ) {

    return request(
      "/cart/items",
      {
        method: "POST",

        body:
          JSON.stringify({
            product_id:
              productId,

            quantity:
              quantity,
          }),
      }
    );
  },


  getCart() {

    return request(
      "/cart"
    );
  },


  updateCartItem(
    productId,
    quantity
  ) {

    return request(
      "/cart/items",
      {
        method: "PATCH",

        body:
          JSON.stringify({
            product_id:
              productId,

            quantity:
              quantity,
          }),
      }
    );
  },


  removeCartItem(
    productId
  ) {

    return request(
      `/cart/items/${productId}`,
      {
        method: "DELETE",
      }
    );
  },


  // ----------------------------------------------------------
  // ORDERS
  // ----------------------------------------------------------

  checkoutOrder() {

    return request(
      "/orders/checkout",
      {
        method: "POST",
      }
    );
  },


  getOrders() {

    return request(
      "/orders"
    );
  },


  // ----------------------------------------------------------
  // PAYMENT
  // ----------------------------------------------------------

  verifyOrderPayment(
    data
  ) {

    return request(
      "/orders/payment/verify",
      {
        method: "POST",

        body:
          JSON.stringify(data),
      }
    );
  },

  verifyAiPayment(
    data
  ) {

    return request(
      "/payments/verify",
      {
        method: "POST",

        body:
          JSON.stringify(data),
      }
    );
  },


  // ----------------------------------------------------------
  // AI
  // ----------------------------------------------------------

  chat(message, sessionId = null) {

    return agentRequest(
      "/chat",
      {
        method: "POST",

        body:
          JSON.stringify({
            message,
            session_id: sessionId || null,
          }),
      }
    );
  },


  // ----------------------------------------------------------
  // ANALYTICS (Merchant Dashboard)
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // MERCHANT PRODUCTS CRUD
  // ----------------------------------------------------------

  getMerchantProducts() {
    return request("/products/");
  },

  createProduct(data) {
    return request("/products/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateProduct(id, data) {
    return request(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
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

  getCatalogProducts() {
    return request("/catalog/products");
  },

  createPaymentOrder(items) {
    return request("/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  },

  get(endpoint) {
    return request(endpoint);
  },

  post(endpoint, body) {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
};


// ============================================================
// EXPORT
// ============================================================

export {
  API_URL,
  AI_AGENT_URL,
  request,
};