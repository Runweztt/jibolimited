import { useEffect, useRef, useState } from "react";
import { companyApi } from "../../api/company";
import { formatDate } from "../../utils/formatters";

const POLICY_TYPES = ["motor", "health", "property", "travel", "device", "business"];

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    policy_name: "",
    policy_type: "motor",
    payout_limit: "100000",
    waiting_period_days: "0",
    max_claim_days_after_incident: "90",
  });

  function load() {
    setLoading(true);
    companyApi.listPolicies().then(setPolicies).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(e) {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) { setError("Please select a file."); return; }

    setSaving(true);
    setError(null);
    try {
      await companyApi.uploadPolicy(file, form);
      setSuccess("Policy uploaded successfully.");
      setShowModal(false);
      setForm({ policy_name: "", policy_type: "motor", payout_limit: "100000", waiting_period_days: "0", max_claim_days_after_incident: "90" });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id) {
    try {
      const res = await companyApi.togglePolicy(id);
      setPolicies((prev) => prev.map((p) => p.id === id ? { ...p, is_active: res.is_active } : p));
    } catch (err) {
      setError(err.message);
    }
  }

  async function deletePolicy(id) {
    if (!confirm("Delete this policy? This cannot be undone.")) return;
    try {
      await companyApi.deletePolicy(id);
      setPolicies((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div><h1>Policy Documents</h1><p>Upload and manage policy rules for claim compliance checks</p></div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setError(null); }}>
          + Upload Policy
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
        ) : policies.length === 0 ? (
          <div className="empty-state" style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "#94a3b8" }}>No policies uploaded yet. Upload your first policy document to enable compliance checks.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Policy Name</th>
                  <th>Type</th>
                  <th>Payout Limit</th>
                  <th>Waiting Period</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{p.policy_name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{p.original_filename}</div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ textTransform: "capitalize" }}>{p.policy_type}</span>
                    </td>
                    <td style={{ fontSize: "0.875rem" }}>
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(p.payout_limit)}
                    </td>
                    <td style={{ fontSize: "0.875rem", color: "#64748b" }}>{p.waiting_period_days} days</td>
                    <td>
                      <span className={`badge ${p.is_active ? "badge-success" : "badge-neutral"}`}>
                        {p.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{formatDate(p.created_at)}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => toggleActive(p.id)}
                        >
                          {p.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deletePolicy(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Upload modal ──────────────────────────────────────────────────── */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Upload Policy Document</h2>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Policy Name</label>
                  <input
                    className="form-input"
                    value={form.policy_name}
                    onChange={(e) => setForm({ ...form, policy_name: e.target.value })}
                    placeholder="e.g. Motor Comprehensive 2026"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Policy Type</label>
                  <select
                    className="form-select"
                    value={form.policy_type}
                    onChange={(e) => setForm({ ...form, policy_type: e.target.value })}
                  >
                    {POLICY_TYPES.map((t) => (
                      <option key={t} value={t} style={{ textTransform: "capitalize" }}>{t}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Payout Limit (USD)</label>
                    <input
                      className="form-input"
                      type="number"
                      min="0"
                      value={form.payout_limit}
                      onChange={(e) => setForm({ ...form, payout_limit: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Waiting Period (days)</label>
                    <input
                      className="form-input"
                      type="number"
                      min="0"
                      value={form.waiting_period_days}
                      onChange={(e) => setForm({ ...form, waiting_period_days: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Claim Days</label>
                    <input
                      className="form-input"
                      type="number"
                      min="1"
                      value={form.max_claim_days_after_incident}
                      onChange={(e) => setForm({ ...form, max_claim_days_after_incident: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Policy Document (PDF or image)</label>
                  <input
                    ref={fileRef}
                    className="form-input"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    required
                  />
                </div>

                {error && <p className="form-error">{error}</p>}
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Uploading..." : "Upload Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
