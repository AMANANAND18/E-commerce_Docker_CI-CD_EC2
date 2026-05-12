import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get("/cart");
        setCart(res.data);
      } catch (err) {
        setError("Unable to load cart. Please refresh or login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const checkout = async () => {
    setCheckoutLoading(true);
    try {
      nav("/payment", { state: { total: cartTotal } });
    } catch (err) {
      setError("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const cartTotal = cart?.items?.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div
      className="cart-shell"
      style={{ minHeight: "100vh", padding: "2rem 0" }}
    >
      <div className="cart-container cart-card glass-card">
        <div className="cart-heading section-heading">
          <div>
            <h1>Your Cart</h1>
            <p>Review your items and complete your purchase with confidence.</p>
          </div>
          <button
            onClick={() => nav("/dashboard")}
            className="btn btn-secondary"
          >
            Continue shopping
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <div className="loader" />
            <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
              Loading your cart...
            </p>
          </div>
        ) : error ? (
          <div className="error-state" style={{ padding: "2rem" }}>
            <p>{error}</p>
          </div>
        ) : !cart?.items?.length ? (
          <div className="empty-state" style={{ padding: "4rem 2rem" }}>
            <h3>Your cart is empty</h3>
            <p>Browse products and add items to start shopping.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: "1.5rem",
            }}
          >
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div>
                    <h3>{item.product.name}</h3>
                    <p>
                      Qty: {item.quantity} · ₹{item.product.price.toFixed(2)}{" "}
                      each
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontWeight: 700, color: "white" }}>
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <aside className="summary-card glass-card">
              <h2>Order Summary</h2>
              <div
                style={{ margin: "1.5rem 0", display: "grid", gap: "0.75rem" }}
              >
                <div className="summary-row">
                  <span>Items total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery fee</span>
                  <span>₹0.00</span>
                </div>
                <div className="summary-row">
                  <span>Discount</span>
                  <span>-₹0.00</span>
                </div>
              </div>
              <div
                className="summary-row"
                style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}
              >
                <strong>Total</strong>
                <strong>₹{cartTotal.toFixed(2)}</strong>
              </div>
              <button
                onClick={checkout}
                disabled={checkoutLoading || !cartTotal}
                className="btn btn-primary full-width"
                style={{ opacity: checkoutLoading || !cartTotal ? 0.65 : 1 }}
              >
                {checkoutLoading
                  ? "Proceeding to payment..."
                  : "Proceed to Checkout"}
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
