import { ApiResponse } from '@/types/api';
import { AddToCartPayload, Cart, UpdateCartItemPayload } from '@/types/cart';
import apiClient from './client';

export const cartApi = {
  get: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  },

  addItem: async (payload: AddToCartPayload): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>(
      '/cart/items',
      payload
    );
    return response.data.data;
  },

  updateItem: async (
    itemId: number,
    payload: UpdateCartItemPayload
  ): Promise<Cart> => {
    const response = await apiClient.put<ApiResponse<Cart>>(
      `/cart/items/${itemId}`,
      payload
    );
    return response.data.data;
  },

  removeItem: async (itemId: number): Promise<Cart> => {
    const response = await apiClient.delete<ApiResponse<Cart>>(
      `/cart/items/${itemId}`
    );
    return response.data.data;
  },

  clear: async (): Promise<void> => {
    await apiClient.delete('/cart/clear');
  },
};