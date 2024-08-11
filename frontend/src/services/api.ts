import axios, { AxiosResponse } from 'axios';

// Base URL for your Spring Boot backend
const baseURL = 'http://localhost:8080/api'; // Change this to your actual backend URL

// Create an axios instance with the base URL
const axiosInstance = axios.create({
    baseURL,
});

// Interceptor to add the JWT token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface LoginResponse {
    user: User;
    token: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    phone: string;
    address: string;
}

// Authentication APIs
export const login = (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => 
    axios.post(`${baseURL}/auth/login`, { email, password });

export const register = (name: string, email: string, role: string, phone: string, address: string, password: string): Promise<AxiosResponse<LoginResponse>> => 
    axios.post(`${baseURL}/auth/register`, { name, email, role, phone, address, password });

// User management APIs
export const getAllUsers = (): Promise<AxiosResponse<User[]>> => 
    axiosInstance.get('/users/all');

export const getUserByEmail = (email: string): Promise<AxiosResponse<User>> => 
    axiosInstance.get(`/users/email/${email}`);

export const updateUser = (id: number, data: Partial<User>): Promise<AxiosResponse<User>> => 
    axiosInstance.put(`/users/update/${id}`, data);

export const deleteUser = (id: number): Promise<AxiosResponse<void>> => 
    axiosInstance.delete(`/users/delete/${id}`);

export const createUser = (name: string, email: string, role: string, phone: string, address: string, password: string): Promise<AxiosResponse<User>> => 
    axiosInstance.post('/users/add', { name, email, role, phone, address, password });

export default axiosInstance;