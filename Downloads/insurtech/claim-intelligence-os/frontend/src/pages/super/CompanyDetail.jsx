import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { superApi } from "../../api/super";
import { formatDate } from "../../utils/formatters";

const PLANS = ["starter", "growth", "enterprise"];

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    superApi.getCompany(id).then(setCompany).finally(() => setLoading(false));
  }, [id]);

  async function toggleSuspend() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await superApi.updateCompany(id, { is_suspended: !company.is_suspended });
      setCompany((c) => ({ ...c, is_suspended: updated.is_suspended }));
      setSuccess(updated.is_suspended ? "Company suspended." : "Company reactivated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function changePlan(plan) {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await superApi.updateCompany(id, { subscription_plan: plan });
      setCompany((c) => ({ ...c, subscription_plan: updated.subscription_plan }));
      setSuccess(`Plan updated to ${plan}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
  if (!company) return <div className="empty-state"><h3>Company not found</h3></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginBottom: "0.75rem" }}
            onClick={() => navigate("/super/companies")}
          >
            ← Back to Companies
          </button>
          <h1>{company.name}</h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>{company.email} · {company.country}</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {company.is_suspended
            ? <span className="badge badge-danger">Suspended</span>
            : <span className="badge badge-success">Active</span>}
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: "#fef2f2", borderRadius: 8, border: "1px solid #fca5a5" }}>{error}</div>}
      {success && <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: "#f0fdf4", borderRadius: 8, border: "1px solid #86efac", color: "#166534", fontSize: "0.875rem" }}>{success}</div>}

      <div className="dashboard-grid">
        {/* ─── Company info ────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Company Details</span></div>
            {[
              ["Name", company.name],
              ["Email", company.email],
              ["Phone", company.phone || "—"],
              ["Country", company.country],
              ["Address", company.address || "—"],
              ["Slug", company.slug],
              ["Joined", formatDate(company.created_at)],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.625rem 0", borderBottom: "1px solid #e2e8f0", fontSize: "0.875rem" }}>
                <span style={{ color: "#64748b" }}>{label}</span>
                <span style={{ fontWeight: 500 }}>{val}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Claim Statistics</span></div>
            {[
              ["Total Claims", company.total_claims],
              ["Approved", company.approved_claims],
              ["Rejected", company.rejected_claims],
              ["High Fraud", company.high_fraud_claims],
              ["Approval Rate", `${company.approval_rate}%`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.625rem 0", borderBottom: "1px solid #e2e8f0", fontSize: "0.875rem" }}>
                <span style={{ color: "#64748b" }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Actions ─────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Subscription Plan</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
              {PLANS.map((plan) => (
                <button
                  key={plan}
                  className={`btn ${company.subscription_plan === plan ? "btn-primary" : "btn-secondary"} btn-sm`}
                  style={{ textTransform: "capitalize" }}
                  disabled={saving || company.subscription_plan === plan}
                  onClick={() => changePlan(plan)}
                >
                  {plan} {company.subscription_plan === plan && "(current)"}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Account Actions</span></div>
            <button
              className={`btn ${company.is_suspended ? "btn-primary" : "btn-danger"} btn-sm`}
              style={{ width: "100%" }}
              disabled={saving}
              onClick={toggleSuspend}
            >
              {saving ? "Saving..." : company.is_suspended ? "Reactivate Company" : "Suspend Company"}
            </button>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.75rem" }}>
              Suspended companies cannot process new claims or log in to the portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
