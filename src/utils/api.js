import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
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
  getAllUsers: () => api.get("/auth/user"),
  updateProfile: (data) => api.put("/auth/update-profile", data),
  updateProfileImage: (formData) =>
    api.put("/auth/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};


export const clientAPI = {
  create: (data) =>
    api.post("/clients", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getAll: (data) => api.get("/clients", { params: data }),
  getById: (id) => api.get(`/clients/${id}`),
  update: (id, data) => api.put(`/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/clients/${id}`),
  addPayment: (id, data) =>
    api.post(`/clients/${id}/add-payment`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
  approvePayment: (cid, pid) => api.post(`/clients/${cid}/approve-payment/${pid}`),
  rejectPayment: (cid, pid) => api.post(`/clients/${cid}/reject-payment/${pid}`),
  deleteSecondPayment: (cid, pid) => api.delete(`/clients/${cid}/delete-payment/${pid}`),

};


export const adminAPI = {
  stats: () => api.get("/admin/stats"),
  salesmen: () => api.get("/admin/salesmen"),
  salesmanClients: (id) => api.get(`/admin/salesman/${id}/clients`),
  pending: () => api.get("/admin/pending"),
  salesman: (id) => api.get(`/admin/salesman/${id}`),
  verify: (id) => api.put(`/admin/verify/${id}`),
  deleteSalesman: (id) => api.delete(`/admin/salesman/${id}`),
  graph: () => api.get("/admin/stats-graph"),


};


export const reimbursementAPI = {
  create: (formData) =>
    api.post("/reimbursement/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getUserRequests: (params) => api.get("/reimbursement/user", { params }),

  getAllRequests: (params) => api.get("/reimbursement/all", { params }),

  getStats: () => api.get("/reimbursement/stats"),

  verifyRequest: (id, data) => api.put(`/reimbursement/${id}/verify`, data),

  getById: (id) => api.get(`/reimbursement/${id}`),

  updateRequest: (id, data) => api.put(`/reimbursement/${id}`, data),

  deleteRequest: (id) => api.delete(`/reimbursement/${id}`),

  downloadFile: (filepath) =>
    api.get(`/uploads/${filepath}`, {
      responseType: 'blob',
    }),
};


export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};


export const meetingAPI = {

  createMeeting: (data) => api.post('/meetings/create', data),
  getAdminMeetings: () => api.get('/meetings/admin'),
  getSalesPersons: (search) => api.get(`/meetings/salespersons?search=${search}`),
  deleteMeeting: (meetingId) => api.delete(`/meetings/${meetingId}`),


  getUserMeetings: () => api.get('/meetings/user'),
  updateResponse: (meetingId, data) => api.put(`/meetings/${meetingId}/response`, data),

  exportToCalendar: (meetingId) => api.get(`/meetings/${meetingId}/calendar`)
};


export default api;