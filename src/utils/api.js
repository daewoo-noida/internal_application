import axios from "axios";

// Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.daewooebg.com/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  profile: () => api.get("/auth/profile"),
  getallUser: (data) => api.get("/auth/user", data)
};


export const clientAPI = {
  create: (data) => api.post("/clients", data),
  getAll: () => api.get("/clients"),
  getById: (id) => api.get(`/clients/${id}`),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),

};


export const adminAPI = {
  stats: () => api.get("/admin/stats"),
  salesmen: () => api.get("/admin/salesmen"),
  salesmanClients: (id) => api.get(`/admin/salesman/${id}/clients`),
  pending: () => api.get("/admin/pending"),
  salesman: (id) => api.get(`/admin/salesman/${id}`),
  verify: (id) => api.put(`/admin/verify/${id}`),
  deleteSalesman: (id) => api.delete(`/admin/salesman/${id}`),

};


export default api;