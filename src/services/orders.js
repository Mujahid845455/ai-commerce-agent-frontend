import { api } from "./client";

export async function createCheckoutOrder() {
  const response = await api.post("/orders/checkout");
  return response.data;
}

export async function verifyPayment(paymentData) {
  const response = await api.post("/orders/payment/verify", paymentData);
  return response.data;
}

export async function checkout() {
  return api.post("/orders/checkout", {});
}

export async function verifyOrderPayment(data) {
  return api.post("/orders/payment/verify", data);
}

export async function getOrders() {
  return api.get("/orders");
}