import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        Care<span>Bridge</span>
      </div>

      <p className="sidebar-label">ADMIN MENU</p>

      <nav className="sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span>▦</span> Manage Users
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <p>CareBridge Admin</p>
        <small>Management Panel</small>
      </div>
    </aside>
  );
}

export default AdminSidebar;