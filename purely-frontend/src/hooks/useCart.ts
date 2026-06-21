'use client';

import { cartApi } from '@/lib/api/cart';
import { useCartStore } from '@/store/cartStore';
import { AddToCartPayload } from '@/types/cart';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const useCart = () => {
  const { cart, setCart, clearCart: clearCartStore } = useCartStore();
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartApi.get();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (payload: AddToCartPayload) => {
    try {
      const data = await cartApi.addItem(payload);
      setCart(data);
      toast.success('Produk ditambahkan ke keranjang');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menambahkan produk';
      toast.error(message);
      throw error;
    }
  };

  const updateItem = async (itemId: number, quantity: number) => {
    try {
      const data = await cartApi.updateItem(itemId, { quantity });
      setCart(data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal update quantity';
      toast.error(message);
      throw error;
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const data = await cartApi.removeItem(itemId);
      setCart(data);
      toast.success('Produk dihapus dari keranjang');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal hapus produk';
      toast.error(message);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      clearCartStore();
      toast.success('Keranjang dikosongkan');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal kosongkan keranjang';
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
};