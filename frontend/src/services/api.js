import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized / token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if we're testing or already on auth page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // optionally clear stale token
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  getFarmerProfile: (id) => api.get(`/auth/farmer/${id}`),
};

// Product Services
export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getMyProducts: () => api.get('/products/farmer/me'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  toggleStock: (id) => api.patch(`/products/${id}/toggle-stock`),
};

// Order Services
export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, statusData) => api.patch(`/orders/${id}/status`, statusData),
};

// Message Services
export const messageService = {
  sendMessage: (msgData) => api.post('/messages', msgData),
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (partnerId) => api.get(`/messages/conversation/${partnerId}`),
};

// Category Services
export const categoryService = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// Admin Services
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, data) => api.patch(`/admin/users/${id}`, data),
  getAllProducts: () => api.get('/admin/products'),
  toggleProductApproval: (id) => api.patch(`/admin/products/${id}/approve`),
  getAllOrders: () => api.get('/admin/orders'),
};

export default api;
