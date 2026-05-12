import { useEffect, useState } from "react";
import API from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data);
      } catch (err) {
        setError("Unable to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div
      className="orders-shell"
      style={{ minHeight: "100vh", padding: "2rem 0" }}
    >
      <div className="orders-container" style={{ padding: "0 0 2rem" }}>
        <div className="section-heading" style={{ marginBottom: "1.5rem" }}>
          <div>
            <h1>My Orders</h1>
            <p>
              Track your purchase history and view order details in one
              beautiful place.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <div className="loader" />
            <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>
              Loading orders...
            </p>
          </div>
        ) : error ? (
          <div className="error-state" style={{ padding: "3rem" }}>
            {error}
          </div>
        ) : !orders.length ? (
          <div className="empty-state" style={{ padding: "3rem" }}>
            <h3>No orders yet</h3>
            <p>Place an order and it will appear here automatically.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.id} className="order-card glass-card">
                <header>
                  <div>
                    <p>Order #{order.id}</p>
                    <h3>Total: ₹{order.total.toFixed(2)}</h3>
                  </div>
                  <span className="order-status">Completed</span>
                </header>
                <div className="order-items">
                  {order.items?.map((item) => (
                    <div key={item.id} className="order-item">
                      <div>
                        <h4>{item.productName}</h4>
                        <p>Qty: {item.quantity}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p>₹{item.price.toFixed(2)}</p>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            marginTop: "0.35rem",
                          }}
                        >
                          Subtotal ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
