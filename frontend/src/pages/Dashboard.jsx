import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCartCount = async () => {
      try {
        const res = await API.get("/cart");
        const totalItems = res.data.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        setCartCount(totalItems);
      } catch (err) {
        // Cart might be empty, that's fine
      }
    };

    fetchProducts();
    fetchCartCount();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const addToCart = async (id) => {
    try {
      await API.post(`/cart/add?productId=${id}&quantity=1`);
      setCartCount((prev) => prev + 1);
      const notification = document.createElement("div");
      notification.textContent = "Added to cart!";
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #22c55e;
        color: white;
        padding: 1rem 1.15rem;
        border-radius: 14px;
        z-index: 1000;
        box-shadow: 0 20px 40px rgba(0,0,0,0.16);
        animation: slideIn 0.35s ease-out;
      `;
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 2800);
    } catch (err) {
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  if (loading)
    return (
      <div className="dashboard-shell" style={{ minHeight: "100vh" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            className="glass-card"
            style={{ padding: "2rem", textAlign: "center" }}
          >
            <div className="loader" />
            <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>
              Loading products...
            </p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="dashboard-shell" style={{ minHeight: "100vh" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div className="error-state" style={{ maxWidth: "520px" }}>
            <h3>⚠️ Oops!</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
              style={{ marginTop: "1rem" }}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="dashboard-shell">
      <div className="hero-banner">
        <div className="section-heading">
          <div>
            <h1>Shop with speed, style, and confidence.</h1>
            <p>
              Browse high-quality products, add to cart with one click, and
              enjoy a beautiful checkout flow.
            </p>
          </div>
          <div className="button-row"></div>
        </div>
      </div>

      <div className="cart-container" style={{ padding: "2rem 0" }}>
        <div className="search-panel">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field search-input"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state" style={{ marginTop: "1.5rem" }}>
            <h3>No products match your search.</h3>
            <p>Try a different keyword or browse the full collection.</p>
          </div>
        ) : (
          <div className="product-grid" style={{ marginTop: "1.5rem" }}>
            {filteredProducts.map((p) => (
              <div key={p.id} className="product-card">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} />
                ) : (
                  <div
                    className="product-image-placeholder"
                    style={{
                      height: "180px",
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <span style={{ fontSize: "2.4rem" }}>📦</span>
                  </div>
                )}
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="product-meta">
                  <span className="product-price">₹{p.price}</span>
                  <span className="status-pill">In Stock</span>
                </div>
                <button
                  onClick={() => addToCart(p.id)}
                  className="btn btn-primary full-width"
                >
                  🛒 Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
