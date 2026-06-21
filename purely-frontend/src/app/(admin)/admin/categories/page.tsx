"use client";

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';
import { toast } from 'react-hot-toast';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    products_count: number;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryIcon, setNewCategoryIcon] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get('/admin/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Gagal memuat kategori');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName) return;

        setIsSubmitting(true);
        try {
            await apiClient.post('/admin/categories', {
                name: newCategoryName,
                icon: newCategoryIcon
            });
            toast.success('Kategori berhasil ditambahkan');
            setNewCategoryName('');
            setNewCategoryIcon('');
            setIsModalOpen(false);
            fetchCategories();
        } catch (error: any) {
            console.error('Error adding category:', error);
            toast.error(error.response?.data?.message || 'Gagal menambah kategori');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah anda yakin ingin menghapus kategori ini?')) return;

        try {
            await apiClient.delete(`/admin/categories/${id}`);
            toast.success('Kategori berhasil dihapus');
            fetchCategories();
        } catch (error: any) {
            console.error('Error deleting category:', error);
            toast.error(error.response?.data?.message || 'Gagal menghapus kategori');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">Loading categories...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Kategori</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    + Tambah Kategori
                </button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Icon</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Nama</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Slug</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Jumlah Produk</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Belum ada kategori
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 text-xl">{category.icon}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">{category.slug}</td>
                                        <td className="px-6 py-4 text-gray-600">{category.products_count}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(category.id)}
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

            {/* Add Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">Tambah Kategori Baru</h3>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Contoh: Sayur Segar"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                                <input
                                    type="text"
                                    value={newCategoryIcon}
                                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Contoh: 🥬"
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
