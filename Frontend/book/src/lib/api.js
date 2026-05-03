const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("bookhaven_token");

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("bookhaven_user") || "null");
  } catch {
    return null;
  }
};

export const storeSession = ({ token, user }) => {
  localStorage.setItem("bookhaven_token", token);
  localStorage.setItem("bookhaven_user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("bookhaven_token");
  localStorage.removeItem("bookhaven_user");
};

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  login: (payload) =>
    apiRequest("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) =>
    apiRequest("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  books: (query = "") => apiRequest(`/books${query}`),
  readBook: (bookId) => apiRequest(`/books/${bookId}/read`),
  getCheckout: (bookId) => apiRequest(`/purchase/checkout/${bookId}`),
  getPaymentRequests: () => apiRequest("/purchase/admin/requests"),
  updatePaymentRequestStatus: (requestId, status) =>
    apiRequest(`/purchase/admin/requests/${requestId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  createGatewayOrder: (bookId) =>
    apiRequest(`/purchase/create-order/${bookId}`, { method: "POST" }),
  verifyGatewayPayment: (bookId, payload) =>
    apiRequest(`/purchase/verify/${bookId}`, { method: "POST", body: JSON.stringify(payload) }),
  purchaseBook: (bookId) => apiRequest(`/purchase/${bookId}`, { method: "POST" }),
  checkOwnership: (bookId) => apiRequest(`/purchase/check/${bookId}`),
  feedback: (bookId) => apiRequest(`/feedback/${bookId}`),
  submitFeedback: (bookId, payload) =>
    apiRequest(`/feedback/${bookId}`, { method: "POST", body: JSON.stringify(payload) }),
  contact: (payload) =>
    apiRequest("/feedback/contact/send", { method: "POST", body: JSON.stringify(payload) }),
};
