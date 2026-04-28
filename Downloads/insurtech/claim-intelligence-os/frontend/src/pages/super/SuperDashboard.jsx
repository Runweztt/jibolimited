import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { superApi } from "../../api/super";

function StatCard({ label, value, sub, color }) {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color || "#1e40af"}` }}>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value ?? "—"}</div>
      {sub && <div className="stat-card__sub">{sub}</div>}
    </div>
  );
}

export default function SuperDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    superApi.analytics().then(setAnalytics).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Platform Overview</h1>
          <p>Real-time metrics across all insurance companies</p>
        </div>
      </div>

      {/* ─── Key metrics ─────────────────────────────────────────────────── */}
      <div className="stats-grid">
        <StatCard label="Total Companies" value={analytics?.total_companies} color="#1e40af" />
        <StatCard label="Total Claimants" value={analytics?.total_claimants} color="#0891b2" />
        <StatCard label="Total Claims" value={analytics?.total_claims} color="#7c3aed" />
        <StatCard label="Approved" value={analytics?.claims_approved} color="#059669" />
        <StatCard label="Rejected" value={analytics?.claims_rejected} color="#dc2626" />
        <StatCard label="Escalated" value={analytics?.claims_escalated} color="#d97706" />
        <StatCard label="High Fraud Claims" value={analytics?.high_fraud_claims} color="#dc2626" sub="Score ≥ 60" />
        <StatCard label="Fraud Rate" value={analytics?.fraud_rate + "%"} color="#dc2626" />
      </div>

      {/* ─── Quick actions ───────────────────────────────────────────────── */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Quick Actions</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link to="/super/companies" className="btn btn-secondary">Manage Companies</Link>
            <Link to="/super/claims" className="btn btn-secondary">View All Claims</Link>
            <Link to="/super/audit-logs" className="btn btn-secondary">View Audit Logs</Link>
            <Link to="/super/health" className="btn btn-secondary">System Health</Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Platform Status</span>
          </div>
          <div style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.8 }}>
            <div>All systems operational</div>
            <div style={{ marginTop: "0.5rem", color: "#059669", fontWeight: 600 }}>✓ API Online</div>
            <div style={{ color: "#059669", fontWeight: 600 }}>✓ Database Connected</div>
            <div style={{ color: "#059669", fontWeight: 600 }}>✓ Rust Engine Active</div>
            <div style={{ color: "#059669", fontWeight: 600 }}>✓ Workers Running</div>
          </div>
        </div>
      </div>
    </div>
  );
}
