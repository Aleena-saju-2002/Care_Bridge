
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./ResetPassword.css";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email ?? "";
  const otp = location.state?.otp ?? "";
  const accountType = location.state?.accountType as
    | "user"
    | "hospital"
    | undefined;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !otp || !accountType) {
      toast.error("Please restart the forgot-password process.");
      navigate("/forgot-password");
      return;
    }

    if (newPassword.length < 6) {
      toast.warning("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        accountType === "hospital"
          ? "/hospitals/reset-password"
          : "/users/reset-password";

      const response = await api.post(endpoint, {
        email,
        otp,
        newPassword,
      });

      toast.success(response.data.message || "Password reset successfully.");
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ||
              "Unable to reset your password. Please try again."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="reset-password-page">
      <section className="reset-password-card">
        <header className="reset-password-header">
          <h1>Reset Password</h1>
          <p>Create a new password for your account.</p>
        </header>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter your new password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your new password"
              required
            />
          </div>

          <button
            type="submit"
            className="reset-password-submit"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p>
            <Link to="/login">Back to Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default ResetPassword;
