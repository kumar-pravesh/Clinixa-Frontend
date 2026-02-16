import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_ROOT || 'http://localhost:5000',
    withCredentials: true,
});

/**
 * REQUEST INTERCEPTOR
 * Attaches access token to every request
 */
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

/**
 * RESPONSE INTERCEPTOR
 * Handles access token expiry
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 403 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_ROOT || 'http://localhost:5000'}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                localStorage.setItem('accessToken', data.accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

                // Retry original request after refresh
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
