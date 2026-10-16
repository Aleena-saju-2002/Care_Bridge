import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  resendHospitalOtp,
  verifyHospitalOtp,
} from "../../services/hospital.service";
import "../auth/Signup.css";

function HospitalVerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    location.state?.email ?? ""
  );
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault();

    if (!email.trim() || !/^\d{6}$/.test(otp)) {
      toast.warning("Enter your email and the six-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      await verifyHospitalOtp(email.trim(), otp);
      toast.success("Email verified. Await admin approval.");
navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "OTP verification failed."
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendHospitalOtp(email.trim());
      toast.success("A new OTP has been sent.");
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Unable to resend OTP."
          : "Something went wrong."
      );
    }
  };

  return (
    <main className="signup-page">
      <section className="signup-card">
        <div className="signup-header">
          <h1>CareBridge</h1>
          <h2>Verify Hospital Email</h2>
          <p>Enter the OTP sent to your representative email.</p>
        </div>

        <form className="signup-form" onSubmit={handleVerify}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Six-digit OTP</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter OTP"
            />
          </div>

          <button className="signup-submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={handleResend}
          >
            Resend OTP
          </button>
        </form>
      </section>
    </main>
  );
}

export default HospitalVerifyOtp;