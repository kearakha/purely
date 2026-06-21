'use client';

import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils/formatters';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, updateItem, removeItem, clearCart } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading text="Memuat keranjang..." />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-600 mb-6">
            Anda belum menambahkan produk ke keranjang
          </p>
          <Link href="/products" className="btn-primary inline-block">
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee = 5000; // Fixed untuk MVP
  const subtotal = cart.total_price;
  const total = subtotal + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Belanja</h1>
        <p className="text-gray-600">{cart.total_items} produk dalam keranjang</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateItem}
              onRemove={removeItem}
            />
          ))}

          <div className="pt-4">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Kosongkan Keranjang
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ringkasan Belanja
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.total_items} produk)</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Biaya Pengiriman</span>
                <span className="font-medium">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 text-lg"
            >
              Lanjut ke Pembayaran
            </Button>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>
                  Belanja aman dengan metode pembayaran yang terpercaya
                </p>
              </div>
            </div>
          </Card>

          {/* Promo Info */}
          <Card className="mt-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Promo Tersedia!</p>
                <p className="text-sm text-gray-600">Dapatkan diskon hingga 20%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="mt-8 text-center">
        <Link
          href="/products"
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Lanjut Belanja
        </Link>
      </div>
    </div>
  );
}