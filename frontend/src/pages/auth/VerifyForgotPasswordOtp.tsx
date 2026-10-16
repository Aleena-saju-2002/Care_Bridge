
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./VerifyForgotPasswordOtp.css";

function VerifyForgotPasswordOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>(location.state?.email ?? "");
  const [otp, setOtp] = useState("");
  const accountType = location.state?.accountType as
    | "user"
    | "hospital"
    | undefined;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.warning("Please enter a valid email address.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.warning("Enter the six-digit OTP.");
      return;
    }

    if (!accountType) {
      toast.error("Please restart the forgot-password process.");
      navigate("/forgot-password");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        accountType === "hospital"
          ? "/hospitals/verify-forgot-password-otp"
          : "/users/verify-forgot-password-otp";

      const response = await api.post(endpoint, {
        email: normalizedEmail,
        otp,
      });

      toast.success(response.data.message || "OTP verified successfully.");

      navigate("/reset-password", {
        state: { email: normalizedEmail, otp, accountType },
      });
    } catch (error: unknown) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ||
              "Invalid or expired OTP. Please try again."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="verify-forgot-otp-page">
      <section className="verify-forgot-otp-card">
        <h1>Verify OTP</h1>
        <p>Enter the six-digit OTP sent to your email address.</p>

        <form onSubmit={handleSubmit} className="verify-forgot-otp-form">
          <label htmlFor="verify-email">Email address</label>
          <input
            id="verify-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="verify-otp">Six-digit OTP</label>
          <input
            id="verify-otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Enter OTP"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p>
          <Link to="/forgot-password">Back</Link>
        </p>
      </section>
    </main>
  );
}

export default VerifyForgotPasswordOtp;
