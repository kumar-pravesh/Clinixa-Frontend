import axios from 'axios';

const ROOT_API_BASE = import.meta.env.VITE_API_ROOT || 'http://localhost:5000';
const STAFF_API_BASE =
    import.meta.env.VITE_STAFF_API || `${ROOT_API_BASE}/api/staff`;

const rootApi = axios.create({
    baseURL: ROOT_API_BASE,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const api = axios.create({
    baseURL: STAFF_API_BASE,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const attachInterceptors = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
                hasToken: !!token,
                headers: config.headers,
                baseURL: instance.defaults.baseURL,
            });
            return config;
        },
        (error) => {
            console.error('[API Request Error]', error);
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            console.log(
                `[API Response] ${response.config.method.toUpperCase()} ${response.config.url} - Status: ${response.status}`
            );
            return response;
        },
        (error) => {
            console.error('[API Response Error]', {
                url: error.config?.url,
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                fullError: error,
            });

            if (error.response?.status === 401) {
                console.warn('Authentication error - redirecting to login');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }

            return Promise.reject(error);
        }
    );
};

attachInterceptors(rootApi);
attachInterceptors(api);

export { rootApi };
export default api;
