import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";

// Pages
import AIShopping from "./pages/AIShopping";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Account from "./pages/Account";
import OrderSuccess from "./pages/OrderSuccess";

// Merchant Pages
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantProducts from "./pages/MerchantProducts";
import MerchantOrders from "./pages/MerchantOrders";
import MerchantConversations from "./pages/MerchantConversations";
import MerchantRevenue from "./pages/MerchantRevenue";
import MerchantPolicies from "./pages/MerchantPolicies";
import AuditTrail from "./pages/AuditTrail";
import LoginPage from "./pages/LoginPage";

import { isAuthenticated } from "./services/client";
import "./index.css";

function AppContent() {
  const [mode, setMode] = useState("customer");
  const [cart, setCart] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/login") {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (paymentSuccess) {
    return (
      <OrderSuccess
        order={paymentSuccess}
        onContinueShopping={() => {
          setPaymentSuccess(null);
          navigate("/");
        }}
        onViewOrders={() => {
          setPaymentSuccess(null);
          navigate("/orders");
        }}
      />
    );
  }

  return (
    <>
      <Navbar cartCount={cart.length} mode={mode} setMode={setMode} />

      <Routes>
        <Route path="/" element={<AIShopping cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              onPaymentSuccess={(payment) => {
                setPaymentSuccess(payment);
              }}
            />
          }
        />
        <Route path="/orders" element={<Orders />} />
        <Route path="/account" element={<Account />} />

        <Route path="/merchant" element={<MerchantDashboard />} />
        <Route path="/merchant/products" element={<MerchantProducts />} />
        <Route path="/merchant/orders" element={<MerchantOrders />} />
        <Route path="/merchant/recommendations" element={<MerchantConversations />} />
        <Route path="/merchant/revenue" element={<MerchantRevenue />} />
        <Route path="/merchant/policies" element={<MerchantPolicies />} />
        <Route path="/merchant/audit" element={<AuditTrail />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
