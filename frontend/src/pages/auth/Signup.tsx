import { useNavigate } from "react-router-dom";
import "./SignupChoice.css";

function Signup() {
  const navigate = useNavigate();

  return (
    <main className="choice-page">
      <section className="choice-card">
        <h1>CareBridge</h1>
        <h2>Create an Account</h2>
        <p>Choose how you want to join CareBridge.</p>

        <button
          type="button"
          className="choice-button user-choice"
          onClick={() => navigate("/signup/user")}
        >
          <span className="choice-icon">👤</span>
          <span>
            <strong>Register as a User</strong>
            <small>
              Create your account and join the CareBridge community.
            </small>
          </span>
        </button>

        <button
          type="button"
          className="choice-button hospital-choice"
          onClick={() => navigate("/signup/hospital")}
        >
          <span className="choice-icon">🏥</span>
          <span>
            <strong>Register as a Hospital</strong>
            <small>
              Submit your hospital details for verification.
            </small>
          </span>
        </button>

        
<p className="choice-footer">
  Already registered?{" "}
  <button type="button" onClick={() => navigate("/login")}>
    Login
  </button>
</p>

      </section>
    </main>
  );
}

export default Signup;