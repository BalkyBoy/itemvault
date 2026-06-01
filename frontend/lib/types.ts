export type ItemStatus = 'draft' | 'active' | 'archived';

export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface DashboardStats {
  total: number;
  totalContributors: number;
  totalCategories: number;
  addedToday: number;
  categories: Record<string, number>;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface ListItemsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: ItemStatus | '';
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

export interface CreateItemPayload {
  name: string;
  description: string;
  category?: string;
  status?: ItemStatus;
}
