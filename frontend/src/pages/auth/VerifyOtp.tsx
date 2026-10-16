import { FormEvent, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

import { toast } from "react-toastify";

import api from "../../services/api";

import "./VerifyOtp.css";

function VerifyOtp() {
  const location = useLocation();

  const navigate = useNavigate();

  const emailFromSignup = location.state?.email || "";

  const [email, setEmail] = useState(emailFromSignup);

  const [otp, setOtp] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // --------------------
    // EMAIL VALIDATION
    // --------------------

    if (!email.trim()) {
      toast.warning("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      toast.warning("Please enter a valid email address.");
      return;
    }

    // --------------------
    // OTP VALIDATION
    // --------------------

    if (!otp.trim()) {
      toast.warning(
        "Please enter the OTP sent to your email."
      );
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.warning(
        "OTP must contain exactly 6 digits."
      );
      return;
    }

    // --------------------
    // API REQUEST
    // --------------------

    try {
      const response = await api.post("/users/verify-otp", {
        email: email.trim(),
        otp,
      });

      // --------------------
      // SUCCESS TOAST
      // --------------------

      toast.success(
        response.data.message ||
          "Your account has been verified."
      );

      // Go to login page
      navigate("/login");

    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Invalid or expired OTP. Please try again."
        );
      } else {
        toast.error(
          "Something went wrong. Please try again."
        );
      }
    }
  };

  return (
    <div className="verify-otp-page">
      <div className="verify-otp-card">

        <div className="verify-otp-header">
          <h1>Verify OTP</h1>

          <p>
            Enter the OTP sent to your email
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="verify-otp-form"
        >

          {/* Email */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
            />
          </div>

          {/* OTP */}
          <div className="form-group">
            <label>OTP</label>

            <input
              type="text"
              value={otp}
              maxLength={6}
              onChange={(event) => {
                const value = event.target.value;

                // Allow only numbers
                if (/^\d*$/.test(value)) {
                  setOtp(value);
                }
              }}
              placeholder="Enter 6-digit OTP"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="verify-otp-submit"
          >
            Verify OTP
          </button>

        </form>

      </div>
    </div>
  );
}

export default VerifyOtp;