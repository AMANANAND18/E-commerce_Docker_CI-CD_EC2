import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleLogin} className="auth-card glass-card">
        <h2>Welcome back</h2>
        <p>Sign in and continue shopping with a premium, smooth and easy experience.</p>
        {error && <div className="error-state">{error}</div>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />

        <label htmlFor="password" style={{ marginTop: "1rem" }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary full-width"
          style={{ marginTop: "1.25rem" }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-link">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
