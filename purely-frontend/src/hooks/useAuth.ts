'use client';

import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { LoginCredentials, RegisterData } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await authApi.register(data);
      setAuth(response.user, response.token);
      toast.success('Registrasi berhasil!');
      
      // Redirect based on role
      if (response.user.role === 'customer') {
        router.push('/');
      } else if (response.user.role === 'seller') {
        router.push('/seller/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registrasi gagal';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      setAuth(response.user, response.token);
      toast.success('Login berhasil!');

      // Redirect based on role
      if (response.user.role === 'customer') {
        router.push('/');
      } else if (response.user.role === 'seller') {
        router.push('/seller/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login gagal';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      toast.success('Logout berhasil');
      router.push('/login');
    } catch (error) {
      clearAuth();
      router.push('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
  };
};