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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor: on 401, attempt token refresh before logging out
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || '';

    // If 401 is on auth endpoints or already retried, perform logout
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !url.includes('/users/login') &&
      !url.includes('/users/register') &&
      !url.includes('/users/refresh') &&
      !url.includes('/auth/google') &&
      !url.includes('/auth/facebook')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post('/users/refresh');
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401 && (url.includes('/users/refresh') || originalRequest?._retry)) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
