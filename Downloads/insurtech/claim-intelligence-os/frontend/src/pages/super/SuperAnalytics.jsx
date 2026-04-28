import { useEffect, useState } from "react";
import { superApi } from "../../api/super";

function StatCard({ label, value, color, sub }) {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color || "#1e40af"}` }}>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value ?? "—"}</div>
      {sub && <div className="stat-card__sub">{sub}</div>}
    </div>
  );
}

export default function SuperAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    superApi.analytics().then(setData).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  const total = data?.total_claims || 0;
  const resolved = (data?.claims_approved || 0) + (data?.claims_rejected || 0);
  const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div><h1>Platform Analytics</h1><p>Aggregated metrics across all companies</p></div>
        <button className="btn btn-secondary" onClick={load}>Refresh</button>
      </div>

      {/* ─── Volume metrics ───────────────────────────────────────────────── */}
      <div className="stats-grid">
        <StatCard label="Total Companies" value={data?.total_companies} color="#1e40af" />
        <StatCard label="Total Claimants" value={data?.total_claimants} color="#0891b2" />
        <StatCard label="Total Claims" value={total} color="#7c3aed" />
        <StatCard label="Approved" value={data?.claims_approved} color="#059669"
          sub={total ? `${Math.round((data.claims_approved / total) * 100)}%` : null} />
        <StatCard label="Rejected" value={data?.claims_rejected} color="#dc2626"
          sub={total ? `${Math.round((data.claims_rejected / total) * 100)}%` : null} />
        <StatCard label="Escalated" value={data?.claims_escalated} color="#d97706" />
        <StatCard label="High Fraud Claims" value={data?.high_fraud_claims} color="#dc2626" sub="Score ≥ 60" />
        <StatCard label="Fraud Rate" value={`${data?.fraud_rate ?? 0}%`} color="#dc2626" />
      </div>

      {/* ─── Resolution summary ───────────────────────────────────────────── */}
      <div className="dashboard-grid" style={{ marginTop: "1.5rem" }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Resolution Summary</span></div>
          <div style={{ padding: "0.5rem 0" }}>
            {[
              ["Total resolved", resolved, "#0f172a"],
              ["Approval rate", `${total ? Math.round((data.claims_approved / total) * 100) : 0}%`, "#059669"],
              ["Rejection rate", `${total ? Math.round((data.claims_rejected / total) * 100) : 0}%`, "#dc2626"],
              ["Escalation rate", `${total ? Math.round(((data.claims_escalated || 0) / total) * 100) : 0}%`, "#d97706"],
              ["Overall resolution rate", `${resolutionRate}%`, "#1e40af"],
            ].map(([label, val, color]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.625rem 0", borderBottom: "1px solid #e2e8f0", fontSize: "0.875rem" }}>
                <span style={{ color: "#64748b" }}>{label}</span>
                <span style={{ fontWeight: 700, color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Fraud Intelligence</span></div>
          <div style={{ padding: "0.5rem 0", fontSize: "0.875rem", color: "#64748b", lineHeight: 1.8 }}>
            <p>The Rust engine scores every claim deterministically. Scores are never influenced by AI.</p>
            <div style={{ marginTop: "1rem" }}>
              {[
                ["High risk (≥60)", data?.high_fraud_claims ?? 0, "#dc2626"],
                ["Low/medium risk (<60)", (total - (data?.high_fraud_claims || 0)), "#059669"],
              ].map(([label, val, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
                  <span>{label}</span>
                  <span style={{ fontWeight: 700, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
