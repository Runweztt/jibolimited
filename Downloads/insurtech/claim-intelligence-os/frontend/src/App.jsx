import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// ─── Layouts ──────────────────────────────────────────────────────────────────
import CompanyAdminLayout from "./layouts/CompanyAdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

// ─── Public pages ─────────────────────────────────────────────────────────────
import Landing from "./pages/public/Landing";
import SubmitClaim from "./pages/public/SubmitClaim";
import TrackClaim from "./pages/public/TrackClaim";

// ─── Auth pages ───────────────────────────────────────────────────────────────
import Login from "./pages/auth/Login";

// ─── Super admin pages ────────────────────────────────────────────────────────
import AllClaims from "./pages/super/AllClaims";
import AuditLogs from "./pages/super/AuditLogs";
import Companies from "./pages/super/Companies";
import CompanyDetail from "./pages/super/CompanyDetail";
import SuperAnalytics from "./pages/super/SuperAnalytics";
import SuperDashboard from "./pages/super/SuperDashboard";
import SystemHealth from "./pages/super/SystemHealth";

// ─── Company admin pages ──────────────────────────────────────────────────────
import Analytics from "./pages/company/Analytics";
import ClaimDetail from "./pages/company/ClaimDetail";
import Claims from "./pages/company/Claims";
import Compliance from "./pages/company/Compliance";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import Policies from "./pages/company/Policies";
import Staff from "./pages/company/Staff";


// ─── Protected route guard ────────────────────────────────────────────────────
function RequireAuth({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role && user.role !== "super_admin") return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* ─── Public ──────────────────────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/submit-claim" element={<SubmitClaim />} />
        <Route path="/track-claim" element={<TrackClaim />} />
      </Route>

      <Route path="/login" element={<Login />} />

      {/* ─── Super admin ─────────────────────────────────────────────────── */}
      <Route path="/super" element={<RequireAuth role="super_admin"><SuperAdminLayout /></RequireAuth>}>
        <Route path="dashboard" element={<SuperDashboard />} />
        <Route path="companies" element={<Companies />} />
        <Route path="companies/:id" element={<CompanyDetail />} />
        <Route path="claims" element={<AllClaims />} />
        <Route path="analytics" element={<SuperAnalytics />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="health" element={<SystemHealth />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ─── Company admin ───────────────────────────────────────────────── */}
      <Route path="/company" element={<RequireAuth role="company_admin"><CompanyAdminLayout /></RequireAuth>}>
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="claims" element={<Claims />} />
        <Route path="claims/:id" element={<ClaimDetail />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="policies" element={<Policies />} />
        <Route path="compliance" element={<Compliance />} />
        <Route path="staff" element={<Staff />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ─── Fallback ─────────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
