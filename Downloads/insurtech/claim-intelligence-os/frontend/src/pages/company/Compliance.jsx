import { useEffect, useState } from "react";
import { companyApi } from "../../api/company";
import { formatDate } from "../../utils/formatters";

export default function Compliance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyApi.analytics().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  const complianceRate = data
    ? Math.round(((data.approved + data.rejected) / (data.total_claims || 1)) * 100)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div><h1>Compliance Overview</h1><p>Policy compliance metrics across all claims</p></div>
      </div>

      <div className="stats-grid">
        {[
          ["Total Processed", (data?.approved ?? 0) + (data?.rejected ?? 0)],
          ["Compliance Passed", data?.approved ?? 0],
          ["Compliance Failed", data?.rejected ?? 0],
          ["Escalated", data?.escalated ?? 0],
          ["Needs Evidence", data?.needs_evidence ?? 0],
          ["Processing Rate", `${complianceRate}%`],
        ].map(([label, val]) => (
          <div className="stat-card" key={label}>
            <div className="stat-card__label">{label}</div>
            <div className="stat-card__value">{val ?? "—"}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-header"><span className="card-title">Compliance Notes</span></div>
        <div style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.8, padding: "0.5rem 0" }}>
          <p>Compliance is validated automatically by the Rust engine on every claim submission.</p>
          <p style={{ marginTop: "0.75rem" }}>
            The engine checks: policy payout limits, waiting periods, required documents,
            incident-to-submission window, and claim type coverage.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            Claims flagged as non-compliant are escalated for human review before any decision is made.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            Upload your policy documents in the <strong>Policies</strong> section to configure compliance rules specific to your company.
          </p>
        </div>
      </div>
    </div>
  );
}
