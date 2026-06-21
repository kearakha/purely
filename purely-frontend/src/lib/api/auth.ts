import { ApiResponse } from "@/types/api";
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "@/types/auth";
import apiClient from "./client";

const DEMO_ACCOUNTS: Record<string, AuthResponse> = {
  "demo@purely.app": {
    token: "demo-token-customer",
    user: {
      id: 1,
      name: "Demo Customer",
      email: "demo@purely.app",
      role: "customer",
      phone: "08123456789",
      is_active: true,
      created_at: new Date().toISOString(),
    } as User,
  },
  "admin@purely.app": {
    token: "demo-token-admin",
    user: {
      id: 2,
      name: "Demo Admin",
      email: "admin@purely.app",
      role: "admin",
      phone: "08123456780",
      is_active: true,
      created_at: new Date().toISOString(),
    } as User,
  },
  "seller@purely.app": {
    token: "demo-token-seller",
    user: {
      id: 3,
      name: "Demo Seller",
      email: "seller@purely.app",
      role: "seller",
      phone: "08123456781",
      is_active: true,
      created_at: new Date().toISOString(),
    } as User,
  },
};

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data,
    );
    return response.data.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const demo = DEMO_ACCOUNTS[credentials.email];
    if (demo && credentials.password === "demo1234") {
      return Promise.resolve(demo);
    }
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials,
    );
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
      "/auth/profile",
      data,
    );
    return response.data.data;
  },
};
