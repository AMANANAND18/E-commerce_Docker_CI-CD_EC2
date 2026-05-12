import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleRegister} className="auth-card glass-card">
        <h2>Join the future of shopping</h2>
        <p>Create your account and discover beautifully curated products.</p>
        {error && <div className="error-state">{error}</div>}

        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
        />

        <label htmlFor="email" style={{ marginTop: "1rem" }}>
          Email
        </label>
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
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/" className="text-link">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
