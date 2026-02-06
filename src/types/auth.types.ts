import type { User, Session } from "@supabase/supabase-js";

export type AuthUser = User;
export type AuthSession = Session;

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  classYear: number;
  pronouns: number;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export type AuthProvider = "google";