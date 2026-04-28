import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { superApi } from "../../api/super";
import { formatDate } from "../../utils/formatters";

const PLANS = ["starter", "growth", "enterprise"];
const COUNTRIES = ["Nigeria", "Malaysia", "Ghana", "Kenya", "South Africa", "Indonesia", "Other"];

const EMPTY_FORM = { name: "", email: "", phone: "", country: "Nigeria", address: "", subscription_plan: "starter" };

export default function Companies() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function load(p = 1) {
    setLoading(true);
    superApi.listCompanies({ page: p, page_size: 20 }).then(setData).finally(() => setLoading(false));
  }

  useEffect(() => { load(page); }, [page]);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await superApi.createCompany(form);
      setShowModal(false);
      setForm(EMPTY_FORM);
      load(1);
      setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div><h1>Insurance Companies</h1><p>Manage all companies on the platform</p></div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setError(null); }}>
          + Add Company
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Country</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>
                        No companies yet. Add one to get started.
                      </td>
                    </tr>
                  )}
                  {data?.items?.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{c.email}</div>
                      </td>
                      <td>{c.country}</td>
                      <td><span className="badge badge-info" style={{ textTransform: "capitalize" }}>{c.subscription_plan}</span></td>
                      <td>
                        {c.is_suspended
                          ? <span className="badge badge-danger">Suspended</span>
                          : c.is_active
                          ? <span className="badge badge-success">Active</span>
                          : <span className="badge badge-neutral">Inactive</span>}
                      </td>
                      <td>{formatDate(c.created_at)}</td>
                      <td>
                        <Link to={`/super/companies/${c.id}`} className="btn btn-secondary btn-sm">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>Showing {data?.items?.length} of {data?.total}</span>
              <div className="pagination-controls">
                <button className="pagination-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                <span style={{ padding: "0 0.5rem", fontSize: "0.875rem" }}>Page {page} of {data?.total_pages}</span>
                <button className="pagination-btn" disabled={!data || page >= data.total_pages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── Add Company modal ──────────────────────────────────────────────── */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Add New Company</h2>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input className="form-input" value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="e.g. Zenith Insurance" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234..." />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <select className="form-select" value={form.country} onChange={(e) => set("country", e.target.value)}>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subscription Plan</label>
                    <select className="form-select" value={form.subscription_plan} onChange={(e) => set("subscription_plan", e.target.value)}>
                      {PLANS.map((p) => <option key={p} value={p} style={{ textTransform: "capitalize" }}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address (optional)</label>
                  <input className="form-input" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street address" />
                </div>

                {error && <p className="form-error">{error}</p>}
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Creating..." : "Create Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
