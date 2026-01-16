import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_URL } from "../utils/env";
import { useAuthStore } from "../auth/authStore";

/** Extend config to support a retry flag */
type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const http: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // required for refresh cookie to work
});

// working with access tokens
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;

  config.headers = config.headers ?? {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // ensuring stale headers are deleted
    delete (config.headers as any).Authorization;
  }

  return config;
});

// working with refresh cookie
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

function isAuthRefreshRequest(config?: AxiosRequestConfig): boolean {
  const url = config?.url ?? "";
  return url.includes("/auth/refresh");
}

function handleAuthFailure() {
  // keep API layer clean: reset auth state only
  useAuthStore.getState().reset();
  // DO NOT redirect here; let UI/RequireAuth handle navigation
}

// refresh on 401
http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as RetryRequestConfig | undefined;

    // If there's no config
    if (!original) throw error;

    // Only handle 401s
    if (status !== 401) throw error;

    // If refresh itself fails, do not loop
    if (isAuthRefreshRequest(original)) {
      handleAuthFailure();
      throw error;
    }

    // Avoid infinite loops
    if (original._retry) throw error;
    original._retry = true;

    // Start refresh if not already running
    if (!isRefreshing) {
      isRefreshing = true;

      refreshPromise = http
        .post("/auth/refresh")
        .then((res) => {
          const newToken = (res.data as any)?.accessToken as string | undefined;
          if (!newToken) throw new Error("No access token returned from refresh");

          // update zustand store
          useAuthStore.getState().setAccessToken(newToken);

          return newToken;
        })
        .catch((e) => {
          handleAuthFailure();
          throw e;
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    const newToken = await refreshPromise;
    if (!newToken) throw error; // extra safety

    // Retry original request with new token
    original.headers = original.headers ?? {};
    original.headers.Authorization = `Bearer ${newToken}`;

    return http(original);
  }
);
