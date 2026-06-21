'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import apiClient from '@/lib/api/client';
import { formatCurrency } from '@/lib/utils/formatters';
import { Product } from '@/types/product';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/seller/products');
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return;
    }

    try {
      await apiClient.delete(`/seller/products/${id}`);
      toast.success('Produk berhasil dihapus');
      fetchProducts();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus produk');
    }
  };

  if (loading) {
    return <Loading text="Memuat produk..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Produk</h1>
          <p className="text-gray-600">{products.length} produk</p>
        </div>
        <Button onClick={() => alert('Fitur tambah produk segera hadir!')}>
          + Tambah Produk
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum Ada Produk
          </h3>
          <p className="text-gray-600 mb-6">
            Mulai tambahkan produk Anda untuk mulai berjualan
          </p>
          <Button>+ Tambah Produk Pertama</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <div className="flex items-center gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      {product.category && (
                        <p className="text-sm text-gray-500">
                          {product.category.name}
                        </p>
                      )}
                    </div>
                    <Badge variant={product.in_stock ? 'green' : 'red'}>
                      {product.in_stock ? 'Tersedia' : 'Stok Habis'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>
                      <strong className="text-primary-600">
                        {formatCurrency(product.price)}
                      </strong>
                      {' / '}{product.unit}
                    </span>
                    <span>•</span>
                    <span>Stok: {product.stock}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => alert('Fitur edit segera hadir!')}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => alert('Fitur update stok segera hadir!')}
                    >
                      Update Stok
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="w-full sm:w-auto"
                      onClick={() => handleDelete(product.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}