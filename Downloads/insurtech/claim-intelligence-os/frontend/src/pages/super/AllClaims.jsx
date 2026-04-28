import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { superApi } from "../../api/super";
import { claimTypeLabel, formatAmount, formatDate, statusBadgeClass } from "../../utils/formatters";

const STATUSES = ["", "submitted", "approved", "rejected", "escalated", "needs_evidence", "under_review"];

export default function AllClaims() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "";

  function setParam(k, v) {
    const next = new URLSearchParams(searchParams);
    if (v) next.set(k, v); else next.delete(k);
    next.set("page", "1");
    setSearchParams(next);
  }

  useEffect(() => {
    setLoading(true);
    superApi.allClaims({ page, page_size: 20, ...(status && { status }) })
      .then(setData)
      .finally(() => setLoading(false));
  }, [page, status]);

  return (
    <div>
      <div className="page-header">
        <div><h1>All Claims</h1><p>Every claim across all companies</p></div>
      </div>

      <div className="table-toolbar">
        <select
          className="form-select"
          style={{ flex: "none", width: "auto" }}
          value={status}
          onChange={(e) => setParam("status", e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s || "All Statuses"}</option>
          ))}
        </select>
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
                    <th>Reference</th>
                    <th>Company</th>
                    <th>Amount</th>
                    <th>Fraud Score</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>
                        No claims found
                      </td>
                    </tr>
                  )}
                  {data?.items?.map((c) => (
                    <tr key={c.id}>
                      <td><code style={{ fontSize: "0.8rem" }}>{c.claim_ref}</code></td>
                      <td style={{ fontSize: "0.875rem", color: "#64748b" }}>{c.company_name || "—"}</td>
                      <td>{formatAmount(c.claim_amount)}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: 60, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{
                              height: "100%",
                              width: `${c.fraud_score}%`,
                              background: c.fraud_score >= 60 ? "#dc2626" : c.fraud_score >= 30 ? "#d97706" : "#059669",
                              borderRadius: 3,
                            }} />
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{c.fraud_score ?? "—"}</span>
                        </div>
                      </td>
                      <td><span className={`badge ${statusBadgeClass(c.status)}`}>{c.status}</span></td>
                      <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{formatDate(c.created_at)}</td>
                      <td>
                        <Link to={`/company/claims/${c.id}`} className="btn btn-secondary btn-sm">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>Showing {data?.items?.length} of {data?.total} claims</span>
              <div className="pagination-controls">
                <button className="pagination-btn" disabled={page === 1} onClick={() => setParam("page", page - 1)}>
                  Previous
                </button>
                <span style={{ padding: "0 0.5rem", fontSize: "0.875rem" }}>
                  Page {page} of {data?.total_pages}
                </span>
                <button
                  className="pagination-btn"
                  disabled={!data || page >= data.total_pages}
                  onClick={() => setParam("page", page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
