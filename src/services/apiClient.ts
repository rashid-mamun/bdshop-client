import axios, { AxiosHeaders } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const unsafeMethods = new Set(['post', 'put', 'patch', 'delete']);
let csrfTokenPromise: Promise<string> | null = null;

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // send httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

const getCookieValue = (name: string) => {
  if (typeof document === 'undefined') return '';
  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')[1] || '';
};

const fetchCsrfToken = async () => {
  const existingToken = getCookieValue('csrfToken');
  if (existingToken) return decodeURIComponent(existingToken);

  if (!csrfTokenPromise) {
    csrfTokenPromise = apiClient
      .get('/csrf-token')
      .then((response) => response.data?.csrfToken || getCookieValue('csrfToken'))
      .finally(() => {
        csrfTokenPromise = null;
      });
  }

  return csrfTokenPromise;
};

apiClient.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (method && unsafeMethods.has(method)) {
    const csrfToken = await fetchCsrfToken();
    const headers = AxiosHeaders.from(config.headers);
    headers.set('x-csrf-token', csrfToken);
    config.headers = headers;
  }
  return config;
});

// Response interceptor: on 401, clear auth state
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
