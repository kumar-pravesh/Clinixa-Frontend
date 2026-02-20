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
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error.response?.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('accessToken');
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
