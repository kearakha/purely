"use client";

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';
import { toast } from 'react-hot-toast';

interface Order {
    id: number;
    order_number: string;
    total_amount: string;
    status: string;
    created_at: string;
    user: {
        name: string;
    };
    items_count?: number;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const fetchOrders = async () => {
        try {
            const response = await apiClient.get('/admin/orders');
            console.log('Orders response:', response.data);
            const ordersData = response.data?.data?.data || [];
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Gagal memuat pesanan');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        setUpdatingId(id);
        try {
            await apiClient.put(`/admin/orders/${id}/status`, { status: newStatus });
            toast.success('Status pesanan diperbarui');
            fetchOrders();
        } catch (error: any) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.message || 'Gagal update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(value));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'paid': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-indigo-100 text-indigo-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">Loading orders...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Pesanan</h1>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Order #</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Pembeli</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Total</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Tanggal</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Belum ada pesanan
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{order.order_number}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.user?.name}</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">{formatCurrency(order.total_amount)}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)} capitalize`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                disabled={updatingId === order.id}
                                                className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-1"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="paid">Paid</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
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
