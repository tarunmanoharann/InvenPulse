import axios, { AxiosError, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

// Define the API URL
const API_URL = 'http://localhost:8080';

// Create an instance of Axios with the base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Set up the request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure headers is defined and properly cast to AxiosRequestHeaders
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Define the authService with async functions for login, logout, and register
const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Assuming response.data contains token
      }
      return response.data;
    } catch (error) {
      // Handle error appropriately
      throw new Error('Login failed');
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },
  register: async (name: string, email: string, phone: string, address: string, password: string) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', {
        name,
        email,
        phone,
        address,
        password,
      });
      return response.data;
    } catch (error) {
      // Handle error appropriately
      throw new Error('Registration failed');
    }
  },
};

export { authService, axiosInstance };
