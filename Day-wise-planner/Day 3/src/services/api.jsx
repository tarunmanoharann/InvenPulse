import axios from 'axios';
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
const SignUp = (name, email, phone, address, password) => axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/register`, { name, email, phone, address, password });
const WebDatax = () => axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/web/sitex`);
const UserData = (email) => axiosInstance.get(`/users/email/${email}`);
const UpdateUserByID = (id, data) => axiosInstance.put(`/users/update/${id}`, data)
const DeleteUserByID = (id) => axiosInstance.delete(`/users/delete/${id}`)