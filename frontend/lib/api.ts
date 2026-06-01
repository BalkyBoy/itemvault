import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  AuthUser,
  CreateItemPayload,
  DashboardStats,
  Item,
  ListItemsParams,
  PaginationMeta,
  RegisterDto,
} from './types';



const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});


apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});



apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authUser');
      sessionStorage.clear();
      window.location.replace('/register');
    }

    const message =
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);


export function saveTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('authUser');
  sessionStorage.clear();
}



export interface RegisterResponse {
  user: AuthUser;
  tokens: { accessToken: string; refreshToken: string; expiresIn: number };
}

export async function registerUser(data: RegisterDto): Promise<RegisterResponse> {
  const res = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data);
  if (!res.data.status || !res.data.data) throw new Error(res.data.message);
  return res.data.data;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: { accessToken: string; refreshToken: string; expiresIn: number };
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
  if (!res.data.status || !res.data.data) throw new Error(res.data.message);
  return res.data.data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const res = await apiClient.get<ApiResponse<{ user: AuthUser }>>('/auth/me');
  if (!res.data.status || !res.data.data) throw new Error(res.data.message);
  return res.data.data.user;
}


export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  if (!res.data.status || !res.data.data) throw new Error(res.data.message);
  return res.data.data;
}

export async function getRecentItems(): Promise<Item[]> {
  const res = await apiClient.get<ApiResponse<Item[]>>('/dashboard/recent-items');
  if (!res.data.status) throw new Error(res.data.message);
  return res.data.data ?? [];
}


export async function fetchItems(
  params: ListItemsParams = {}
): Promise<{ items: Item[]; meta?: PaginationMeta }> {
  const res = await apiClient.get<ApiResponse<Item[]>>('/items', { params });
  if (!res.data.status) throw new Error(res.data.message);
  return { items: res.data.data ?? [], meta: res.data.meta };
}

export async function getItem(id: string): Promise<Item> {
  const res = await apiClient.get<ApiResponse<{ item: Item }>>(`/items/${id}`);
  if (!res.data.status || !res.data.data) throw new Error(res.data.message);
  return res.data.data.item;
}

export async function createItem(payload: CreateItemPayload): Promise<Item> {
  const res = await apiClient.post<ApiResponse<{ item: Item }>>('/items', payload);
  if (!res.data.status || !res.data.data) throw new Error(res.data.message);
  return res.data.data.item;
}

export async function deleteItem(id: string): Promise<void> {
  const res = await apiClient.delete<ApiResponse<null>>(`/items/${id}`);
  if (!res.data.status) throw new Error(res.data.message);
}

export default apiClient;
