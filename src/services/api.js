const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const error = await response.json();

      if (error.detail) {
        message =
          typeof error.detail === "string"
            ? error.detail
            : JSON.stringify(error.detail);
      }
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  return response.json();
}

/* =========================
   AUTH
========================= */

export async function login(email, password) {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(
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

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.detail || "Login failed"
    );
  }

  const data = await response.json();

  if (data.access_token) {
    localStorage.setItem(
      "access_token",
      data.access_token
    );
  }

  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
}

export function isAuthenticated() {
  return Boolean(
    localStorage.getItem("access_token")
  );
}

/* =========================
   PRODUCTS
========================= */

export async function getProducts() {
  return request("/products");
}

export async function getProduct(productId) {
  return request(`/products/${productId}`);
}

/* =========================
   MERCHANT
========================= */

export async function getMerchants() {
  return request("/merchants");
}

export async function getMerchant(merchantId) {
  return request(`/merchants/${merchantId}`);
}

/* =========================
   CATALOG
========================= */

export async function searchCatalog(query) {
  return request(
    `/catalog/search?q=${encodeURIComponent(query)}`
  );
}

/* =========================
   CART
========================= */

export async function getCart() {
  return request("/cart");
}

export async function addToCart(
  productId,
  quantity = 1
) {
  return request("/cart/items", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });
}

export async function updateCartItem(
  productId,
  quantity
) {
  return request("/cart/items", {
    method: "PATCH",
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });
}

export async function removeCartItem(productId) {
  return request(
    `/cart/items/${productId}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================
   ORDERS
========================= */

export async function checkout() {
  return request("/orders/checkout", {
    method: "POST",
  });
}

export async function getOrders() {
  return request("/orders");
}

/* =========================
   HEALTH
========================= */

export async function healthCheck() {
  return request("/health");
}