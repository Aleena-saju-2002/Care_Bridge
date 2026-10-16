import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import UsersTable from "../../components/admin/UsersTable";
import "./AdminDashboard.css";


import {
  getAdminUsers,
  updateUserBlockStatus,
} from "../../services/admin.service";

import type { AdminUser } from "../../services/admin.service";

function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const limit = 10;

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminUsers(page, limit, search);

      setUsers(response.data);
      setTotal(response.pagination.total);
      setTotalPages(Math.max(response.pagination.totalPages, 1));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to load users. Please try again."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleToggleBlock = async (user: AdminUser) => {
    const nextStatus = !user.isBlocked;

    const confirmed = window.confirm(
      `Are you sure you want to ${
        nextStatus ? "block" : "unblock"
      } ${user.name}?`
    );

    if (!confirmed) return;

    setActionLoading(true);
    setError("");

    try {
      await updateUserBlockStatus(user._id, nextStatus);
      await loadUsers();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to update the user's status."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminHeader />

        <section className="admin-content">
          <div className="admin-welcome">
            <div>
              <h1>Welcome, Admin!</h1>
              <p>Manage users and monitor your platform.</p>
            </div>
          </div>

          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-icon blue-icon">♙</div>
              <div>
                <p>Total Users</p>
                <h2>{total}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green-icon">✓</div>
              <div>
                <p>Active on This Page</p>
                <h2>
                  {users.filter((user) => !user.isBlocked).length}
                </h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon red-icon">⊘</div>
              <div>
                <p>Blocked on This Page</p>
                <h2>
                  {users.filter((user) => user.isBlocked).length}
                </h2>
              </div>
            </div>
          </div>

          <section className="users-section">
            <div className="users-section-heading">
              <div>
                <h2>User Management</h2>
                <p>View, search, block, or unblock user accounts.</p>
              </div>

              <button
                type="button"
                className="refresh-btn"
                onClick={() => void loadUsers()}
                disabled={loading || actionLoading}
              >
                ↻ Refresh
              </button>
            </div>

            <div className="users-toolbar">
              <input
                type="search"
                className="user-search"
                placeholder="Search by name or email..."
                value={search}
                onChange={(event) =>
                  handleSearch(event.target.value)
                }
              />

              <span className="results-count">
                {total} users found
              </span>
            </div>

            {error && (
              <div className="admin-error" role="alert">
                {error}
              </div>
            )}

            {actionLoading && (
              <p className="action-message">
                Updating user status...
              </p>
            )}

            <UsersTable
              users={users}
              loading={loading}
              onToggleBlock={handleToggleBlock}
            />

            <div className="pagination">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;