import { Link } from "react-router-dom";
import "./LandingPage.css";
import medicalImage from "../images/medical-support1.jpg";

function LandingPage() {
  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          CareBridge
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-buttons">

  <Link to="/login" className="login-btn">
    Login
  </Link>

  <Link to="/signup" className="signup-btn">
    Sign Up
  </Link>

</div>
      </nav>


      {/* Hero Section */}
      <section className="hero-section" id="home">

        <div className="hero-content">

          <h1>
            Hope Starts With
            <span> CareBridge</span>
          </h1>

          <p>
            A trusted medical crowdfunding platform connecting
            patients, donors, and hospitals.
          </p>

         <div className="hero-buttons">

  <Link to="/signup" className="primary-btn">
    Start a Fundraiser
  </Link>

  <Link to="/login" className="secondary-btn">
    Donate Now
  </Link>

</div>

        </div>

<div className="hero-image">
  <img src={medicalImage} alt="Medical support" />
</div>

      </section>


      {/* About Section */}
      <section className="about-section" id="about">

        <h2>About CareBridge</h2>

        <p>
          CareBridge helps people raise funds for medical treatments
          by connecting patients, donors, and hospitals.
        </p>

      </section>


      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">

        <h2>How It Works</h2>

        <div className="steps">

          <div className="step-card">
            <h3>01</h3>
            <h4>Create a Fundraiser</h4>
            <p>
              Create your medical fundraiser with the required
              information.
            </p>
          </div>


          <div className="step-card">
            <h3>02</h3>
            <h4>Get Verified</h4>
            <p>
              Hospital and medical information is verified.
            </p>
          </div>


          <div className="step-card">
            <h3>03</h3>
            <h4>Receive Support</h4>
            <p>
              Donors can support verified medical campaigns.
            </p>
          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="cta-section">

        <h2>
          Together, We Can Make a Difference
        </h2>

        <p>
          Help someone get the medical treatment they need.
        </p>

      <Link to="/signup" className="primary-btn">
  Get Started
</Link>

      </section>


      {/* Footer */}
      <footer id="contact">
        <p>
          © 2026 CareBridge. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default LandingPage;