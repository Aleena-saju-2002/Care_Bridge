
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.warning("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      let accountType: "user" | "hospital" = "user";
      let response;

      try {
        response = await api.post("/users/forgot-password", {
          email: normalizedEmail,
        });
      } catch {
        response = await api.post("/hospitals/forgot-password", {
          email: normalizedEmail,
        });
        accountType = "hospital";
      }

      toast.success(response.data.message || "Check your email for the OTP.");

      navigate("/verify-forgot-password-otp", {
        state: { email: normalizedEmail, accountType },
      });
    } catch (error: unknown) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ||
              "Unable to start password recovery."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-password-page">
      <section className="forgot-password-card">
        <h1>Forgot Password?</h1>
        <p>Enter your registered email to receive a password-reset OTP.</p>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <label htmlFor="forgot-email">Email address</label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your registered email"
            autoComplete="email"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="forgot-password-footer">
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default ForgotPassword;
