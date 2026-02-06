import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // Backend URL
    withCredentials: true, // Send cookies (refresh token)
});

// Response Interceptor for Token Refresh
api.interceptors.response.use(
    (config) => config,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post('http://localhost:5000/auth/refresh', {}, { withCredentials: true });
                // Retry original request (cookies are automatically sent)
                return api(originalRequest);
            } catch (err) {
                // Refresh failed, redirect to login
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
