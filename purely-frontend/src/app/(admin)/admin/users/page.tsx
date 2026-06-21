"use client";

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';
import { toast } from 'react-hot-toast';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get('/admin/users');
            console.log('Users response:', response.data);
            const usersData = response.data?.data?.data || [];
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Gagal memuat data user');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah anda yakin ingin menghapus user ini?')) return;

        try {
            await apiClient.delete(`/admin/users/${id}`);
            toast.success('User berhasil dihapus');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Gagal menghapus user');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">Loading users...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Users</h1>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Nama</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Role</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Bergabung</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Belum ada user terdaftar
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : user.role === 'seller'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                                                disabled={user.role === 'admin'} 
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
