import { api } from "./client";

export const superApi = {
  analytics: () => api.get("/super/analytics"),
  listCompanies: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/super/companies${q ? "?" + q : ""}`);
  },
  getCompany: (id) => api.get(`/super/companies/${id}`),
  createCompany: (data) => api.post("/super/companies", data),
  updateCompany: (id, data) => api.patch(`/super/companies/${id}`, data),
  allClaims: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/super/claims${q ? "?" + q : ""}`);
  },
  auditLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/super/audit-logs${q ? "?" + q : ""}`);
  },
  health: () => api.get("/health"),
};
