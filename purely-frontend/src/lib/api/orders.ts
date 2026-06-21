import { ApiResponse, PaginatedResponse } from '@/types/api';
import { CreateOrderPayload, Order, OrderFilters } from '@/types/order';
import apiClient from './client';

export const ordersApi = {
  getAll: async (filters?: OrderFilters) => {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      '/orders',
      { params: filters }
    );
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  create: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      '/orders',
      payload
    );
    return response.data.data;
  },

  cancel: async (id: number, reason?: string): Promise<Order> => {
    const response = await apiClient.put<ApiResponse<Order>>(
      `/orders/${id}/cancel`,
      { reason }
    );
    return response.data.data;
  },
};