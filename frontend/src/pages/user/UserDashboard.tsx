import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../user/UserDashboard.css";

function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dashboard-container">
      {/* --- NAVBAR --- */}
      <header className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">
            <span className="logo-icon">←</span>
            <span className="logo-brand">
              Care<span className="logo-accent">Bridge</span>
            </span>
          </Link>
          
          <nav className="nav-links">
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/hospitals" className="nav-link">Hospitals</Link>
            <Link to="/donate" className="nav-link">Donate</Link>
            <Link to="/about" className="nav-link">About</Link>
          </nav>
        </div>

        <div className="nav-right">
          {/* Notification Icon */}
          <button className="icon-btn notification-btn" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="badge">0</span>
          </button>

          {/* User Profile & Dropdown Menu */}
          <div className="user-profile-wrapper" ref={dropdownRef}>
            <button 
              className="avatar-btn" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                alt={user?.name || "User Avatar"} 
                className="user-avatar" 
              />
              <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▾</span>
            </button>

            {/* Dropdown Menu Items (matches image layout) */}
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <span className="item-icon">👤</span>
                  My Profile
                </Link>

                <Link to="/request-fund" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <span className="item-icon">📋</span>
                  Medical Fund Request
                </Link>

                <Link to="/request-blood" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <span className="item-icon">🩸</span>
                  Medical Blood Request
                </Link>

                <Link to="/my-donations" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <span className="item-icon">🎁</span>
                  My Blood Donations
                </Link>

                <Link to="/my-requests" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <span className="item-icon">⏳</span>
                  My Fund Requests
                </Link>

                <Link to="/patient-updates" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <span className="item-icon">📢</span>
                  Patient Updates
                </Link>

                <Link to="/transaction-history" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <span className="item-icon">💳</span>
                  Transaction History
                </Link>

                <div className="dropdown-divider"></div>

                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <span className="item-icon">↪</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- DASHBOARD HERO / BODY CONTENT --- */}
      <main className="dashboard-content">
        <section className="hero-banner">
          <div className="hero-text">
            <span className="badge-tag">TRUSTED MEDICAL CROWDFUNDING</span>
            <h1>Together We Can <span className="highlight-blue">Save Lives.</span></h1>
            <p>
              Join a compassionate community dedicated to providing urgent 
              financial relief for verified medical treatments. Secure, transparent, 
              and direct to hospitals.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Donate Now ♡</button>
              <button className="btn btn-secondary">Explore Hospitals ⊞</button>
            </div>
            <div className="hero-features">
              <span>✓ Verified Hospitals</span>
              <span>🔒 Secure Donations</span>
              <span>🌐 100% Transparent</span>
            </div>
          </div>
          
          <div className="hero-image-box">
            <div className="placeholder-illustration">
              <div className="crowdheal-card">
                <h3>CROWDHEAL</h3>
                <p>SUPPORTING HEALTHCARE TOGETHER</p>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Cases Section Preview */}
        <section className="emergency-cases">
          <div className="section-header">
            <div>
              <h2>🚨 Emergency Cases</h2>
              <p>These patients require immediate medical intervention. Your timely support can make a critical difference today.</p>
            </div>
            <Link to="/all-cases" className="view-all-link">View All Cases →</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;