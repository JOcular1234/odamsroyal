// frontend/src/types/index.ts

export interface AppError {
  message: string;
  code: string;
  status?: number;
  details?: unknown;
}

export interface ApiError {
  message: string;
  code: string;
  status?: number;
  details?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
} 