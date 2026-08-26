function authHeaders(options = {}) {
  const session = getSession();
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  return headers;
}
async function request(path, options = {}, responseType = "json") {
  const headers = authHeaders(options);
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      "Cannot reach the backend. Confirm it is running on port 5000.",
    );
  }
  const data =
    responseType === "blob"
      ? await response.blob()
      : await response
          .json()
          .catch(() => ({ message: "Server returned an invalid response" }));
  if (response.status === 401) {
    clearSession();
    if (!location.pathname.endsWith("login.html")) location.href = "login.html";
  }
  if (!response.ok) {
    const errorData = responseType === "blob" ? await data.text() : data;
    let message = errorData;
    try {
      message = JSON.parse(errorData).message;
    } catch {}
    throw new Error(message || `Request failed (${response.status})`);
  }
  return data;
}
async function api(path, options = {}) {
  return request(path, options);
}
async function downloadFile(path) {
  return request(path, {}, "blob");
}
const authApi = {
  register: (data) =>
    api("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) =>
    api("/auth/login", { method: "POST", body: JSON.stringify(data) }),
};
const jobsApi = {
  list: (params) => api("/jobs?" + new URLSearchParams(params)),
  byId: (id) => api("/jobs/" + id),
  mine: () => api("/jobs/mine"),
  create: (data) =>
    api("/jobs", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    api("/jobs/" + id, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => api("/jobs/" + id, { method: "DELETE" }),
};
const companyApi = {
  mine: () => api("/companies/me"),
  save: (data) =>
    api("/companies/me", { method: "PUT", body: JSON.stringify(data) }),
};
const resumeApi = {
  list: () => api("/resumes"),
  upload: (file) => {
    const body = new FormData();
    body.append("resume", file);
    return api("/resumes/upload", { method: "POST", body });
  },
  remove: (id) => api("/resumes/" + id, { method: "DELETE" }),
};
const applicationApi = {
  apply: (data) =>
    api("/applications", { method: "POST", body: JSON.stringify(data) }),
  mine: () => api("/applications/my"),
  recruiter: () => api("/applications/recruiter"),
  byJob: (id) => api("/applications/job/" + id),
  status: (id, status) =>
    api("/applications/" + id + "/status", {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};
