import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query) => api.get(`/products/search?name=${query}`),
  getLowStock: () => api.get('/products/low-stock'),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  getBySupplier: (supplierId) => api.get(`/products/supplier/${supplierId}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getRootCategories: () => api.get('/categories/root'),
  getById: (id) => api.get(`/categories/${id}`),
  getSubcategories: (id) => api.get(`/categories/${id}/subcategories`),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (supplier) => api.post('/suppliers', supplier),
  update: (id, supplier) => api.put(`/suppliers/${id}`, supplier),
  delete: (id) => api.delete(`/suppliers/${id}`),
  search: (query) => api.get(`/suppliers/search?companyName=${query}`),
};

// Stock Movements API
export const stockMovementsAPI = {
  getAll: () => api.get('/stock-movements'),
  getById: (id) => api.get(`/stock-movements/${id}`),
  getByProduct: (productId) => api.get(`/stock-movements/product/${productId}`),
  create: (movement) => api.post('/stock-movements', movement),
};

export default api;