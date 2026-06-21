"use client";

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';
import { toast } from 'react-hot-toast';

interface Product {
    id: number;
    name: string;
    price: string;
    stock: number;
    seller: {
        name: string;
    };
    category: {
        name: string;
    };
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await apiClient.get('/admin/products');
            console.log('Products response:', response.data);
            const productsData = response.data?.data?.data || [];
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Gagal memuat produk');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) return;

        try {
            await apiClient.delete(`/admin/products/${id}`);
            toast.success('Produk berhasil dihapus');
            fetchProducts();
        } catch (error: any) {
            console.error('Error deleting product:', error);
            toast.error(error.response?.data?.message || 'Gagal menghapus produk');
        }
    };

    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(value));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">Loading products...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Nama Produk</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Penjual</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Kategori</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Harga</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Stok</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Belum ada produk
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{product.seller?.name || '-'}</td>
                                        <td className="px-6 py-4 text-gray-600">{product.category?.name || '-'}</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">{formatCurrency(product.price)}</td>
                                        <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:text-red-700 font-medium text-sm"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
