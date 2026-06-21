'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { AddressCard } from '@/components/address/AddressCard';
import { AddressForm } from '@/components/address/AddressForm';
import { AddressList } from '@/components/address/AddressList';
import { useAddress } from '@/hooks/useAddress';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { ordersApi } from '@/lib/api/orders';
import { formatCurrency } from '@/lib/utils/formatters';
import { Address } from '@/types/address';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type PaymentMethod = 'cod' | 'transfer' | 'ewallet';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, loading: cartLoading } = useCart();
  const {
    addresses,
    loading: addressLoading,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  } = useAddress();

  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState({
    delivery_notes: '',
    payment_method: 'cod' as PaymentMethod,
  });

  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      toast.error('Keranjang kosong');
      router.push('/cart');
    }
  }, [cart, cartLoading, router]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const primary = addresses.find((a) => a.is_primary) || addresses[0];
      setSelectedAddress(primary);
    }
  }, [addresses, selectedAddress]);

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading text="Memuat data..." />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const deliveryFee = 5000;
  const subtotal = cart.total_price;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddress) {
      toast.error('Silakan pilih alamat pengiriman');
      return;
    }

    try {
      setLoading(true);
      const orderPayload = {
        delivery_address: `${selectedAddress.recipient_name} (${selectedAddress.phone_number})\n${selectedAddress.full_address}\n${selectedAddress.label}`,
        delivery_notes: formData.delivery_notes,
        payment_method: formData.payment_method,
      };

      const order = await ordersApi.create(orderPayload);
      toast.success('Pesanan berhasil dibuat!');
      router.push(`/orders/${order.id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (data: Partial<Address>) => {
    if (editingAddress) {
      await updateAddress(editingAddress.id, data);
    } else {
      await createAddress(data);
    }
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery (COD)',
      description: 'Bayar saat barang diterima',
      icon: '💵',
    },
    {
      id: 'transfer',
      name: 'Transfer Bank',
      description: 'Transfer ke rekening toko',
      icon: '🏦',
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      description: 'OVO, GoPay, Dana, dll',
      icon: '📱',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Lengkapi data pengiriman Anda</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Alamat Pengiriman
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressModal(true)}
                >
                  {selectedAddress ? 'Ganti Alamat' : 'Pilih Alamat'}
                </Button>
              </div>

              {selectedAddress ? (
                <AddressCard address={selectedAddress} showActions={false} />
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-2">Belum ada alamat dipilih</p>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(true);
                      setShowAddressModal(true);
                    }}
                  >
                    + Tambah Alamat Baru
                  </Button>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan Pengiriman (Opsional)
                </label>
                <textarea
                  value={formData.delivery_notes}
                  onChange={(e) =>
                    setFormData({ ...formData, delivery_notes: e.target.value })
                  }
                  rows={2}
                  className="input-field"
                  placeholder="Contoh: Rumah warna hijau, depan warung"
                />
              </div>
            </Card>

            {/* Payment Method */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Metode Pembayaran
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.payment_method === method.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.id}
                      checked={formData.payment_method === method.id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_method: e.target.value as PaymentMethod,
                        })
                      }
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium text-gray-900">
                          {method.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            {/* Order Items */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Produk Dipesan ({cart.total_items} item)
              </h3>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 relative overflow-hidden">
                       {/* Image placeholder or component if available */}
                    </div>
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
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ringkasan Pesanan
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.total_items} item)</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Biaya Pengiriman</span>
                  <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total Pembayaran</span>
                    <span className="text-primary-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-lg"
                isLoading={loading}
                disabled={loading || !selectedAddress}
              >
                Buat Pesanan
              </Button>
            </Card>
          </div>
        </div>
      </form>

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {showAddressForm
                  ? editingAddress
                    ? 'Ubah Alamat'
                    : 'Tambah Alamat Baru'
                  : 'Pilih Alamat Pengiriman'}
              </h2>
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  setShowAddressForm(false);
                  setEditingAddress(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              {showAddressForm ? (
                <AddressForm
                  initialData={editingAddress || undefined}
                  onSubmit={handleAddressSubmit}
                  onCancel={() => {
                    setShowAddressForm(false);
                    setEditingAddress(null);
                  }}
                  loading={addressLoading}
                />
              ) : (
                <AddressList
                  addresses={addresses}
                  selectedId={selectedAddress?.id}
                  onSelect={(address) => {
                    setSelectedAddress(address);
                    setShowAddressModal(false);
                  }}
                  onEdit={(address) => {
                    setEditingAddress(address);
                    setShowAddressForm(true);
                  }}
                  onDelete={deleteAddress}
                  onAddNew={() => setShowAddressForm(true)}
                  loading={addressLoading}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}