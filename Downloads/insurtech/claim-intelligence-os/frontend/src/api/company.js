import { api } from "./client";

export const companyApi = {
  dashboard: () => api.get("/company/dashboard"),
  listClaims: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/company/claims${q ? "?" + q : ""}`);
  },
  analytics: () => api.get("/analytics/company"),
  listPolicies: () => api.get("/policies"),
  uploadPolicy: (file, meta) => {
    const fd = new FormData();
    fd.append("file", file);
    Object.entries(meta).forEach(([k, v]) => fd.append(k, v));
    return api.upload("/policies", fd);
  },
  togglePolicy: (id) => api.patch(`/policies/${id}/toggle`),
  deletePolicy: (id) => api.delete(`/policies/${id}`),
  listStaff: () => api.get("/company/staff"),
  inviteStaff: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.post(`/company/staff/invite?${q}`);
  },
  toggleStaff: (id) => api.patch(`/company/staff/${id}/toggle`),
};
