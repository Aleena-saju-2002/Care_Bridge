import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { getHospitalStatus } from "../../services/hospital.service";
import "./HospitalDashboard.css";

interface HospitalStatus {
  hospital: {
    hospitalName?: string;
    representativeEmail?: string;
    city?: string;
    district?: string;
    phone?: string;
  };
  verificationStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  isEmailVerified: boolean;
  isBlocked: boolean;
}

function HospitalDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [details, setDetails] = useState<HospitalStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getHospitalStatus()
      .then((response) => {
        if (active) setDetails(response.data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            axios.isAxiosError(err)
              ? err.response?.data?.message || "Unable to load hospital status."
              : "Unable to load hospital status."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

 const handleLogout = () => {
  logout();
  navigate("/login", { replace: true });
};
  const status = details?.verificationStatus ?? user?.verificationStatus;

  return (
   <main className="hospital-dashboard-page">
  <section className="hospital-dashboard-card">
        <div className="dashboard-top">
          <div>
            <h1>CareBridge</h1>
            <p>Hospital Dashboard</p>
          </div>

          <button
            type="button"
            className="dashboard-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <h2>
          Welcome,{" "}
          {details?.hospital?.hospitalName ||
            user?.hospitalName ||
            "Hospital"}
        </h2>

        {loading && <p>Loading your hospital status...</p>}
        {error && <p className="dashboard-error">{error}</p>}

        {details && (
          <>
            <div className={`status-panel status-${details.verificationStatus}`}>
              <span>Verification status</span>
              <strong>
                {details.verificationStatus.toUpperCase()}
              </strong>

              {details.verificationStatus === "pending" && (
                <p>
                  Your registration is awaiting admin review. You will
                  receive access to approved hospital features after approval.
                </p>
              )}

              {details.verificationStatus === "approved" && (
                <p>Your hospital has been approved.</p>
              )}

              {details.verificationStatus === "rejected" && (
                <p>
                  Reason: {details.rejectionReason || "No reason provided."}
                </p>
              )}
            </div>

            <div className="hospital-info">
              <h3>Hospital information</h3>
              <p>
                <strong>Email:</strong>{" "}
                {details.hospital.representativeEmail || user?.representativeEmail || "—"}
              </p>
              <p>
                <strong>City:</strong> {details.hospital.city || "—"}
              </p>
              <p>
                <strong>District:</strong> {details.hospital.district || "—"}
              </p>
              <p>
                <strong>Phone:</strong> {details.hospital.phone || "—"}
              </p>
              <p>
                <strong>Email verified:</strong>{" "}
                {details.isEmailVerified ? "Yes" : "No"}
              </p>
            </div>

            {details.verificationStatus === "approved" && (
              <p className="approved-note">
                Your hospital is approved. You can now access features
                provided by the backend for approved hospitals.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default HospitalDashboard;