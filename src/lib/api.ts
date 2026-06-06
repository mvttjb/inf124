const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface RequestOptions extends RequestInit {
  bodyObj?: any;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_URL}${path}`;
  const headers = new Headers(options.headers);

  // Get token from localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (options.bodyObj) {
    headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(options.bodyObj);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 204) {
    return {} as T;
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth routes
  login: (body: any) => request<any>("/auth/login", { method: "POST", bodyObj: body }),
  register: (body: any) => request<any>("/auth/register", { method: "POST", bodyObj: body }),
  resetPassword: (body: any) => request<any>("/auth/reset-password", { method: "POST", bodyObj: body }),

  // User routes
  getMe: () => request<any>("/users/me"),
  updateMe: (body: any) => request<any>("/users/me", { method: "PATCH", bodyObj: body }),
  deleteMe: () => request<any>("/users/me", { method: "DELETE" }),
  getMeGroups: () => request<any[]>("/users/me/groups"),
  getMeAvailability: () => request<any[]>("/users/me/availability"),
  updateMeAvailability: (slots: any[]) => request<any[]>("/users/me/availability", { method: "PUT", bodyObj: { slots } }),
  enrollInCourse: (code: string) => request<any>("/users/me/courses", { method: "POST", bodyObj: { code } }),
  unenrollFromCourse: (code: string) => request<any>(`/users/me/courses/${encodeURIComponent(code)}`, { method: "DELETE" }),

  // Groups routes
  getGroups: (params: Record<string, string | number | boolean | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        query.set(key, String(val));
      }
    });
    const qs = query.toString();
    return request<any>(`/groups${qs ? `?${qs}` : ""}`);
  },
  getGroupDetail: (id: string) => request<any>(`/groups/${id}`),
  createGroup: (body: any) => request<any>("/groups", { method: "POST", bodyObj: body }),
  updateGroup: (id: string, body: any) => request<any>(`/groups/${id}`, { method: "PATCH", bodyObj: body }),
  deleteGroup: (id: string) => request<any>(`/groups/${id}`, { method: "DELETE" }),
  joinGroup: (id: string, message?: string) => request<any>(`/groups/${id}/join`, { method: "POST", bodyObj: { message } }),

  // Requests routes
  getRequests: () => request<any[]>("/requests"),
  approveRequest: (id: string) => request<any>(`/requests/${id}/approve`, { method: "POST" }),
  declineRequest: (id: string) => request<any>(`/requests/${id}/decline`, { method: "POST" }),
};
