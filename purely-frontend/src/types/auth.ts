export type UserRole = 'customer' | 'seller' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address?: string;
  avatar?: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  address?: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}