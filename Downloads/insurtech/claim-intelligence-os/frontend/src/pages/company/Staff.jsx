import { useEffect, useState } from "react";
import { companyApi } from "../../api/company";
import { formatDate } from "../../utils/formatters";

const EMPTY = { full_name: "", email: "", password: "", role: "company_admin" };

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function load() {
    setLoading(true);
    companyApi.listStaff().then(setStaff).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleInvite(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await companyApi.inviteStaff(form);
      setSuccess(`${form.full_name} has been added.`);
      setShowModal(false);
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleStaff(id, currentActive) {
    try {
      const res = await companyApi.toggleStaff(id);
      setStaff((prev) => prev.map((s) => s.id === id ? { ...s, is_active: res.is_active } : s));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div><h1>Staff</h1><p>Manage team members who can review claims</p></div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setError(null); }}>
          + Add Staff Member
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: "#fef2f2", borderRadius: 8, border: "1px solid #fca5a5", color: "#991b1b", fontSize: "0.875rem" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: "#f0fdf4", borderRadius: 8, border: "1px solid #86efac", color: "#166534", fontSize: "0.875rem" }}>
          {success}
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>
                      No staff yet. Add a team member to get started.
                    </td>
                  </tr>
                )}
                {staff.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500 }}>{s.full_name}</td>
                    <td style={{ fontSize: "0.875rem", color: "#64748b" }}>{s.email}</td>
                    <td>
                      <span className="badge badge-info" style={{ textTransform: "capitalize" }}>
                        {s.role.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${s.is_active ? "badge-success" : "badge-neutral"}`}>
                        {s.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{formatDate(s.joined_at)}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => toggleStaff(s.id, s.is_active)}
                      >
                        {s.is_active ? "Deactivate" : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Add Staff Member</h2>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleInvite}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Temporary Password</label>
                  <input className="form-input" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required minLength={8} />
                </div>
                {error && <p className="form-error">{error}</p>}
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
