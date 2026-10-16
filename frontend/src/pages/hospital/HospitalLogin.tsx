import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { loginHospital } from "../../services/hospital.service";
import "../auth/Signup.css";
import "./HospitalDashboard.css";

function HospitalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await loginHospital(email.trim(), password);
      const result = response.data;

      login(
        {
          ...result.hospital,
          role: "hospital",
        },
        result.token
      );

      toast.success(result.message || "Login successful.");
      navigate("/hospital/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Hospital login failed."
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
   <main className="hospital-login-page">
  <section className="hospital-login-card">
        <div className="signup-header">
          <h1>CareBridge</h1>
          <h2>Hospital Login</h2>
          <p>Sign in to manage your hospital account.</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Representative email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button className="signup-submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="login-link">
          <button onClick={() => navigate("/signup")}>
            Create an account
          </button>
        </div>
      </section>
    </main>
  );
}

export default HospitalLogin;