
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For HttpOnly refresh token cookie
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Skip refresh logic for login endpoint or if we've already retried
    if (originalRequest.url?.includes('/auth/login') || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // If 401, try to refresh
    if (error.response?.status === 401) {
      originalRequest._retry = true;
      try {
        // Attempt refresh
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        localStorage.setItem('accessToken', data.accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        
        // Update the original request header with the new token
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        localStorage.removeItem('accessToken');
        if (typeof window !== 'undefined' && !window.location.hash.includes('login')) {
          // Optional: Force reload or redirect logic handled by AuthContext
          // window.location.href = '/login'; 
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
