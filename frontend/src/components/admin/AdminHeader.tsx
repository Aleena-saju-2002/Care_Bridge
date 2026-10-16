import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="admin-header">
      <div>
        <h2>Admin Dashboard</h2>
        <p>Manage your CareBridge platform</p>
      </div>

      <button
        type="button"
        className="admin-logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
}

export default AdminHeader;