'use client';

import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/lib/api/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  lowStockProducts: number;
}

interface RecentOrder {
  id: number;
  customer_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Parallel requests for efficiency
      const [productsRes, ordersRes, pendingRes] = await Promise.all([
        apiClient.get('/seller/products?per_page=1'),
        apiClient.get('/seller/orders?per_page=5'), // Get 5 recent orders
        apiClient.get('/seller/orders?status=pending&per_page=1'),
      ]);

      setStats({
        totalProducts: productsRes.data.meta?.total || 0,
        totalOrders: ordersRes.data.meta?.total || 0,
        pendingOrders: pendingRes.data.meta?.total || 0,
        lowStockProducts: 0, // Placeholder as endpoint might not exist yet
        revenue: 0, // Placeholder
      });

      // Transform recent orders
      if (ordersRes.data.data) {
        setRecentOrders(ordersRes.data.data.map((order: any) => ({
          id: order.id,
          customer_name: order.user?.name || 'Customer',
          total_price: order.total_price,
          status: order.status,
          created_at: order.created_at,
        })));
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  if (loading) {
    return <Loading text="Memuat dashboard..." />;
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Seller</h1>
          <p className="text-gray-600">Hai {user?.name}, berikut ringkasan tokomu hari ini.</p>
        </div>
        <Link href="/seller/products/create" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition w-full sm:w-auto text-center shadow-lg shadow-primary-500/30">
          + Tambah Produk
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-linear-to-br from-blue-500 to-blue-600 text-white p-4">
          <div className="flex flex-col">
            <p className="text-blue-100 text-xs sm:text-sm">Total Produk</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.totalProducts}</p>
            <div className="mt-2 text-blue-100 text-xs flex items-center">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] mr-1">Store</span>
              <span>Aktif</span>
            </div>
          </div>
        </Card>

        <Card className="bg-linear-to-br from-green-500 to-green-600 text-white p-4">
          <div className="flex flex-col">
            <p className="text-green-100 text-xs sm:text-sm">Total Pesanan</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.totalOrders}</p>
            <div className="mt-2 text-green-100 text-xs flex items-center">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] mr-1">All</span>
              <span>Total masuk</span>
            </div>
          </div>
        </Card>

        <Card className="bg-linear-to-br from-yellow-500 to-yellow-600 text-white p-4">
          <div className="flex flex-col">
            <p className="text-yellow-100 text-xs sm:text-sm">Perlu Diproses</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.pendingOrders}</p>
            <div className="mt-2 text-yellow-100 text-xs flex items-center">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] mr-1">Action</span>
              <span>Segera proses</span>
            </div>
          </div>
        </Card>

        <Card className="bg-linear-to-br from-purple-500 to-purple-600 text-white p-4">
          <div className="flex flex-col">
            <p className="text-purple-100 text-xs sm:text-sm">Pendapatan</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{formatCurrency(stats.revenue)}</p>
            <div className="mt-2 text-purple-100 text-xs flex items-center">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] mr-1">IDR</span>
              <span>Total omset</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Pesanan Terbaru</h2>
              <Link href="/seller/orders" className="text-primary-600 text-sm hover:underline">Lihat Semua</Link>
            </div>
             {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-3 font-medium text-gray-500">ID</th>
                      <th className="p-3 font-medium text-gray-500">Pelanggan</th>
                      <th className="p-3 font-medium text-gray-500">Total</th>
                      <th className="p-3 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="p-3 font-medium">#{order.id}</td>
                        <td className="p-3 text-gray-600">{order.customer_name}</td>
                        <td className="p-3 font-medium">{formatCurrency(order.total_price)}</td>
                        <td className="p-3">
                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada pesanan terbaru.
              </div>
            )}
          </Card>
        </div>

        {/* Quick Tips / Notifications */}
        <div className="lg:col-span-1">
          <Card className="h-full bg-orange-50 border border-orange-100">
            <h2 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Seller Center
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-orange-100">
                 <h3 className="font-medium text-gray-900 text-sm">Maksimalkan Penjualan</h3>
                 <p className="text-gray-600 text-xs mt-1">Lengkapi foto produk dan deskripsi yang detail agar pembeli lebih percaya.</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-orange-100">
                 <h3 className="font-medium text-gray-900 text-sm">Cek Stok Berkala</h3>
                 <p className="text-gray-600 text-xs mt-1">Pastikan stok selalu update untuk menghindari pembatalan pesanan.</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-orange-100">
                 <h3 className="font-medium text-gray-900 text-sm">Respon Cepat</h3>
                 <p className="text-gray-600 text-xs mt-1">Balas chat dan proses pesanan secepat mungkin untuk rating bintang 5.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}