'use client';

import apiClient from '@/lib/api/client';
import { Address } from '@/types/address';
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useAddress = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/addresses');
      setAddresses(response.data.data);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAddress = async (data: Partial<Address>) => {
    try {
      setLoading(true);
      await apiClient.post('/addresses', data);
      toast.success('Alamat berhasil ditambahkan');
      await fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menambah alamat');
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (id: number, data: Partial<Address>) => {
    try {
      setLoading(true);
      await apiClient.put(`/addresses/${id}`, data);
      toast.success('Alamat berhasil diperbarui');
      await fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal update alamat');
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      setLoading(true);
      await apiClient.delete(`/addresses/${id}`);
      toast.success('Alamat berhasil dihapus');
      await fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal hapus alamat');
    } finally {
      setLoading(false);
    }
  };

  return {
    addresses,
    loading,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  };
};
