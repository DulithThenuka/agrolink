import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error.response?.data?.message || error.message || 'An error occurred');
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export const cropsAPI = {
  getAll: (params) => api.get('/crops', { params }),
  getById: (id) => api.get(`/crops/${id}`),
  create: (data) => api.post('/crops', data),
  delete: (id) => api.delete(`/crops/${id}`),
};

export const ordersAPI = {
  place: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  farmerAccept: (id) => api.post(`/orders/${id}/farmer-accept`),
  buyerConfirm: (id) => api.post(`/orders/${id}/buyer-confirm`),
  raiseDispute: (id, data) => api.post(`/orders/${id}/dispute`, data),
  getFarmerOrders: (params) => api.get('/orders/farmer', { params }),
};

export const logisticsAPI = {
  getAvailableDeliveries: (params) => api.get('/logistics/available', { params }),
  acceptDelivery: (id) => api.post(`/logistics/${id}/accept`),
  updateStatus: (id, data) => api.post(`/logistics/${id}/status`, data),
  getMyJobs: (params) => api.get('/logistics/my-jobs', { params }),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getDisputedEscrows: (params) => api.get('/admin/escrow/disputed', { params }),
  resolveEscrowDispute: (id, data) => api.post(`/admin/escrow/${id}/resolve`, data),
};

export const farmersAPI = {
  getProfile: (id) => api.get(`/farmers/${id}/profile`),
};

export const buyersAPI = {
  getProfile: (id) => api.get(`/buyers/${id}/profile`),
};

export const traceabilityAPI = {
  getTrace: (batchCode) => api.get(`/trace/${batchCode}`),
  getByCropId: (cropId) => api.get(`/trace/crop/${cropId}`),
};

export const weatherAPI = {
  getIntelligence: (location) => api.get('/weather/intelligence', { params: { location } }),
};

export default api;
