'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ordersApi } from '@/lib/api/orders';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Order, OrderStatus } from '@/types/order';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getAll({
        status: filterStatus || undefined,
      });
      setOrders(response.data);
    } catch (error) {
      toast.error('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, 'green' | 'yellow' | 'blue' | 'red' | 'gray'> = {
      pending: 'yellow',
      paid: 'blue',
      packed: 'blue',
      shipped: 'blue',
      delivered: 'green',
      canceled: 'red',
    };
    return variants[status] || 'gray';
  };

  const statusOptions: { value: OrderStatus | ''; label: string }[] = [
    { value: '', label: 'Semua Status' },
    { value: 'pending', label: 'Menunggu Pembayaran' },
    { value: 'paid', label: 'Dibayar' },
    { value: 'packed', label: 'Dikemas' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'delivered', label: 'Selesai' },
    { value: 'canceled', label: 'Dibatalkan' },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading text="Memuat pesanan..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Saya</h1>
        <p className="text-gray-600">Lacak dan kelola pesanan Anda</p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as OrderStatus | '')}
          className="input-field w-full md:w-64"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum Ada Pesanan
          </h3>
          <p className="text-gray-600 mb-6">
            Anda belum memiliki pesanan dengan status ini
          </p>
          <Link href="/products" className="btn-primary inline-block">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {order.order_number}
                      </h3>
                      <Badge variant={getStatusBadge(order.status)}>
                        {order.status_label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                      <span>{formatDate(order.created_at)}</span>
                      <span>•</span>
                      <span>{order.items?.length || 0} produk</span>
                      <span>•</span>
                      <span>{order.payment_method.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                    <div>
                      <p className="text-sm text-gray-600 md:text-right">Total</p>
                      <p className="text-lg font-bold text-primary-600">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}