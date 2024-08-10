import { axiosInstance } from "./api";
import { jwtDecode } from "jwt-decode";

const setToken = (token) => localStorage.setItem('token', token);

const getToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return token;
    }
    return null;
}


const getUserEmail = () => {
    const token = getToken();
    if (token) {
        const payLoad = jwtDecode(token);
        return payLoad?.sub;
    }
    return null;
}

const getUserRole = () => {
    const token = getToken();
    if (token) {
        const payLoad = jwtDecode(token);
        return payLoad?.role;
    }
    return null;
}

const isLoggedIn = () => {
    const token = getToken();
    if (token) {
        const payLoad = jwtDecode(token);
        const isLogin = Date.now() < payLoad.exp * 1000;
        //10000ms -> s -> ms*1000 -> 10s
        return isLogin;
    }
}

const SignIn = (email, password) => axiosInstance.post("/auth/login", { email, password });
const SignOut = () => localStorage.removeItem('token')


export const authService = { getToken, setToken, getUserEmail, getUserRole, isLoggedIn, SignIn, SignOut };