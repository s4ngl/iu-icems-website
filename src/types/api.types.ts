export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: string;
}