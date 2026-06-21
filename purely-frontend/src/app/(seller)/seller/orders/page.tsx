'use client';

import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import apiClient from '@/lib/api/client';
import { formatCurrency } from '@/lib/utils/formatters';
import { useEffect, useState } from 'react';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/seller/orders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'packed': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loading text="Memuat pesanan..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pesanan Masuk</h1>
      
      {orders.length === 0 ? (
        <Card className="text-center py-12">
            <p className="text-gray-500">Belum ada pesanan.</p>
        </Card>
      ) : (
        <div className="space-y-4">
             {orders.map((order: any) => (
                 <Card key={order.id} className="hover:shadow-md transition-shadow">
                     <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                         <div>
                             <div className="flex items-center gap-2 mb-1">
                                 <span className="font-bold text-lg">{order.order_number}</span>
                                 <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${getStatusColor(order.status)}`}>
                                     {order.status}
                                 </span>
                             </div>
                             <p className="text-sm text-gray-500">{order.created_at}</p>
                             <p className="text-sm text-gray-600 mt-1">
                               {order.items?.length || 0} Barang
                             </p>
                         </div>
                         <div className="text-right">
                             <p className="font-bold text-lg text-primary-600">
                               {formatCurrency(order.total_amount)}
                             </p>
                             <button 
                               onClick={() => setSelectedOrder(order)}
                               className="text-sm text-primary-600 hover:text-primary-700 font-medium underline mt-1"
                             >
                               Lihat Detail
                             </button>
                         </div>
                     </div>
                 </Card>
             ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-bold">Detail Pesanan {selectedOrder.order_number}</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status & Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium uppercase mt-1 ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                   <p className="text-sm text-gray-500">Tanggal Order</p>
                   <p className="font-medium">{selectedOrder.created_at}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3 border-b pb-2">Daftar Produk</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-md shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-900">{item.product?.name || 'Produk'}</p>
                          <p className="text-sm text-gray-500">{item.quantity} x {formatCurrency(item.price)}</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3 border-b pb-2">Info Pengiriman</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
                   <p><span className="font-medium">Pembeli:</span> {selectedOrder.user?.name}</p>
                   <p><span className="font-medium">Alamat:</span></p>
                   <p className="whitespace-pre-wrap text-gray-600 pl-4 border-l-2 border-gray-300">
                     {selectedOrder.delivery_address}
                   </p>
                   {selectedOrder.delivery_notes && (
                     <p><span className="font-medium">Catatan:</span> {selectedOrder.delivery_notes}</p>
                   )}
                </div>
              </div>

              {/* Payment Info */}
              <div>
                 <h3 className="font-semibold mb-3 border-b pb-2">Rincian Pembayaran</h3>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-600">Metode Pembayaran</span>
                     <span className="font-medium uppercase">{selectedOrder.payment_method}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Total Harga Barang</span>
                     <span>{formatCurrency(selectedOrder.total_amount - (selectedOrder.delivery_fee || 0))}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Ongkos Kirim</span>
                     <span>{formatCurrency(selectedOrder.delivery_fee || 0)}</span>
                   </div>
                   <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                     <span>Total Bayar</span>
                     <span className="text-primary-600">{formatCurrency(selectedOrder.total_amount)}</span>
                   </div>
                 </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
               <button 
                 onClick={() => setSelectedOrder(null)}
                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
               >
                 Tutup
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
