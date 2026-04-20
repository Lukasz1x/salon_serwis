import axios from 'axios';
import {getToken, removeToken} from "@/utils/tokenUtils.ts";

export const apiClient = axios.create({
    baseURL: '/api',
    withCredentials: true
});

apiClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeToken()
            window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        }
        return Promise.reject(error);
    }
)

export default apiClient;