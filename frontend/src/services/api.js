import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Set up axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Spare Parts API
export const sparePartApi = {
  getAll: () => api.get('/spare-parts'),
  getById: (id) => api.get(`/spare-parts/${id}`),
  create: (data) => api.post('/spare-parts', data),
  update: (id, data) => api.put(`/spare-parts/${id}`, data),
  delete: (id) => api.delete(`/spare-parts/${id}`)
};

// Stock In API
export const stockInApi = {
  getAll: () => api.get('/stock-in'),
  getById: (id) => api.get(`/stock-in/${id}`),
  create: (data) => api.post('/stock-in', data)
};

// Stock Out API
export const stockOutApi = {
  getAll: () => api.get('/stock-out'),
  getById: (id) => api.get(`/stock-out/${id}`),
  getByDate: (date) => api.get(`/stock-out/date/${date}`),
  create: (data) => api.post('/stock-out', data),
  update: (id, data) => api.put(`/stock-out/${id}`, data),
  delete: (id) => api.delete(`/stock-out/${id}`)
};

// Reports API
export const reportApi = {
  getStockStatus: () => api.get('/reports/stock-status'),
  getDailyStockOut: (date) => api.get(`/reports/daily-stock-out/${date}`)
};

export default api;
