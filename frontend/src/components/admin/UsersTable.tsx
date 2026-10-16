import type { AdminUser } from "../../services/admin.service";

interface UsersTableProps {
  users: AdminUser[];
  loading: boolean;
  onToggleBlock: (user: AdminUser) => void;
}

function UsersTable({
  users,
  loading,
  onToggleBlock,
}: UsersTableProps) {
  if (loading) {
    return <div className="table-message">Loading users...</div>;
  }

  if (users.length === 0) {
    return <div className="table-message">No users found.</div>;
  }

  return (
    <div className="users-table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Verification</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <div className="table-user">
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <span>{user.name}</span>
                </div>
              </td>

              <td>{user.email}</td>

              <td>
                <span className="role-badge">{user.role}</span>
              </td>

              <td>
                {user.isVerified ? "Verified" : "Pending"}
              </td>

              <td>
                <span
                  className={`status-badge ${
                    user.isBlocked ? "blocked" : "active-status"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </td>

              <td>
                {user.role === "admin" ? (
                  <span className="protected-label">
                    Protected
                  </span>
                ) : (
                  <button
                    type="button"
                    className={`action-btn ${
                      user.isBlocked ? "unblock-btn" : "block-btn"
                    }`}
                    onClick={() => onToggleBlock(user)}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;