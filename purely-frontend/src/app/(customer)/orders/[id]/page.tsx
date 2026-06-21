'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ordersApi } from '@/lib/api/orders';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import { Order, OrderStatus } from '@/types/order';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getById(orderId);
      setOrder(data);
    } catch (error) {
      toast.error('Gagal memuat detail pesanan');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      return;
    }

    try {
      setCanceling(true);
      const updatedOrder = await ordersApi.cancel(order.id, 'Dibatalkan oleh customer');
      setOrder(updatedOrder);
      toast.success('Pesanan berhasil dibatalkan');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membatalkan pesanan');
    } finally {
      setCanceling(false);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading text="Memuat detail pesanan..." />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const canCancel = order.status === 'pending' || order.status === 'paid';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Detail Pesanan
            </h1>
            <p className="text-gray-600">{order.order_number}</p>
          </div>
          <Badge variant={getStatusBadge(order.status)} className="text-base px-4 py-2">
            {order.status_label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Status Pesanan
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium text-gray-900">Pesanan Dibuat</p>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(order.created_at)}
                  </p>
                </div>
              </div>
              {order.status !== 'canceled' && order.status !== 'pending' && (
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-900">Pembayaran Diterima</p>
                    <p className="text-sm text-gray-600">Pesanan sedang diproses</p>
                  </div>
                </div>
              )}
              {order.delivered_at && (
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-900">Pesanan Diterima</p>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(order.delivered_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Order Items */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Produk Dipesan
            </h3>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Delivery Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Pengiriman
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Alamat Pengiriman</p>
                <p className="text-gray-900">{order.delivery_address}</p>
              </div>
              {order.delivery_notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Catatan</p>
                  <p className="text-gray-900">{order.delivery_notes}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ringkasan Pembayaran
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.total_amount - order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Biaya Pengiriman</span>
                <span>{formatCurrency(order.delivery_fee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary-600">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Metode Pembayaran</span>
                <span className="font-medium text-gray-900 uppercase">
                  {order.payment_method}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status Pembayaran</span>
                <Badge variant={order.payment_status === 'paid' ? 'green' : 'yellow'}>
                  {order.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                </Badge>
              </div>
            </div>

            {canCancel && (
              <div className="pt-6">
                <Button
                  variant="danger"
                  onClick={handleCancelOrder}
                  isLoading={canceling}
                  disabled={canceling}
                  className="w-full"
                >
                  Batalkan Pesanan
                </Button>
              </div>
            )}

            {order.status === 'delivered' && (
              <div className="pt-6">
                <Button className="w-full">
                  Beli Lagi
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}