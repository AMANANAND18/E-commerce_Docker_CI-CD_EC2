import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="app-nav">
        <Link to="/dashboard" className="nav-logo">
          ShopEase
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">
            Products
          </Link>
          <Link to="/cart" className="nav-link">
            Cart
          </Link>
          <Link to="/orders" className="nav-link">
            Orders
          </Link>
        </div>
      </nav>

      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
