
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.warning("Please enter a valid email address.");
      return;
    }

    if (!password) {
      toast.warning("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      let account: Record<string, unknown> | null = null;
      let token = "";
      let role = "";

      // First try the user/admin login endpoint.
      try {
        const response = await api.post("/users/login", {
          email: normalizedEmail,
          password,
        });

        const result = response.data.data ?? response.data;

        account = result.user ?? result.account ?? null;
        token = result.token ?? "";
        role = String(
          (account as Record<string, unknown> | null)?.role ?? ""
        );
      } catch {
        // If user/admin login fails, try the hospital endpoint.
      }

      // If no user/admin account was authenticated, try hospital login.
      if (!account || !token) {
        const response = await api.post("/hospitals/login", {
          email: normalizedEmail,
          password,
        });

        const result = response.data.data ?? response.data;

        account = result.hospital ?? result.user ?? null;
        token = result.token ?? "";
        role = String(
          (account as Record<string, unknown> | null)?.role ?? "hospital"
        );

        if (account && role === "hospital") {
          account = { ...account, role: "hospital" };
        }
      }

      if (!account || !token || !["user", "admin", "hospital"].includes(role)) {
        toast.error("The server returned incomplete login details.");
        return;
      }

      login({ ...account, role } as Parameters<typeof login>[0], token);

      toast.success("Login successful.");

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "hospital") {
        navigate("/hospital", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }
    } catch (error: unknown) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ||
              "Login failed. Please check your email and password."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <header className="login-header">
          <Link to="/" className="login-brand">
            CareBridge
          </Link>
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your CareBridge account.</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="login-forgot">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="login-signup">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
