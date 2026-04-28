// ─── Base API client ──────────────────────────────────────────────────────────
// All requests go through here so we have a single place to handle auth headers,
// base URL, and error normalisation.

const BASE = "/api";

function getToken() {
  return localStorage.getItem("claimos_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const resp = await fetch(`${BASE}${path}`, { ...options, headers });

  // Auto logout on 401
  if (resp.status === 401) {
    localStorage.removeItem("claimos_token");
    window.location.href = "/login";
    return;
  }

  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    const msg = data?.detail || data?.message || `Request failed (${resp.status})`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),

  // ─── File upload (multipart) ───────────────────────────────────────────
  upload: async (path, formData) => {
    const token = getToken();
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const resp = await fetch(`${BASE}${path}`, { method: "POST", headers, body: formData });
    const data = await resp.json().catch(() => null);
    if (!resp.ok) {
      const msg = data?.detail || data?.message || `Upload failed (${resp.status})`;
      throw new Error(msg);
    }
    return data;
  },
};
