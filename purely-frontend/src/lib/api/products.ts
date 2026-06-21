import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Category, Product, ProductFilters } from '@/types/product';
import apiClient from './client';

export const productsApi = {
  getAll: async (filters?: ProductFilters) => {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      '/products',
      { params: filters }
    );
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/${id}`
    );
    return response.data.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      '/categories'
    );
    return response.data.data;
  },
};