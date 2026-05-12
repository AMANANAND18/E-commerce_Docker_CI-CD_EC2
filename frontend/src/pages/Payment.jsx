import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const nav = useNavigate();
  const total = location.state?.total || 0;

  useEffect(() => {
    if (!total) {
      nav("/cart");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [nav, total]);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    if (!window.Razorpay) {
      setError("Payment SDK failed to load. Refresh the page and try again.");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post("/api/payment/create-order");
      const data = response.data;

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopEase",
        description: "Purchase Payment",
        order_id: data.id,
        handler: async function (razorpayResponse) {
          try {
            await API.post("/api/payment/verify", {
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });
            nav("/orders");
          } catch (err) {
            console.error(err);
            setError(
              err.response?.data ||
                "Payment verified, but order confirmation failed.",
            );
          }
        },
        prefill: {
          email: localStorage.getItem("email") || "",
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data ||
          "Payment initialization failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPayment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/api/payment/demo-payment");
      if (response.data.success) {
        nav("/orders");
      } else {
        setError("Demo payment failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Demo payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card" style={{ maxWidth: "500px" }}>
        <h2>Complete Your Payment</h2>
        <p>Secure payment for your order total of ₹{total.toFixed(2)}</p>
        {error && <div className="error-state">{error}</div>}
        <button
          onClick={handlePayment}
          disabled={loading || !total}
          className="btn btn-primary full-width"
          style={{ marginTop: "1.25rem" }}
        >
          {loading ? "Initializing Payment..." : `Pay ₹${total.toFixed(2)}`}
        </button>
        <button
          onClick={handleDemoPayment}
          disabled={loading || !total}
          className="btn btn-secondary full-width"
          style={{ marginTop: "0.75rem" }}
        >
          {loading ? "Processing..." : "Test Demo Payment"}
        </button>
        <button
          onClick={() => nav("/cart")}
          className="btn btn-secondary full-width"
          style={{ marginTop: "1rem" }}
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
}
