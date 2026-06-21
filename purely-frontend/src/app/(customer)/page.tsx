'use client';

import { ProductGrid } from '@/components/product/ProductGrid';
import { Loading } from '@/components/ui/Loading';
import { useCart } from '@/hooks/useCart';
import { productsApi } from '@/lib/api/products';
import { Category, Product } from '@/types/product';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productsApi.getAll({ 
          category_id: selectedCategory || undefined,
          per_page: 12 
        }),
        productsApi.getCategories(),
      ]);
      setProducts(productsData.data);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem({ product_id: product.id, quantity: 1 });
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Belanja Kebutuhan Sehari-hari 🛒
        </h1>
        <p className="text-lg text-primary-100 mb-6">
          Produk segar, harga terjangkau, diantar ke rumah
        </p>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Kategori</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              selectedCategory === null
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-xl font-bold mb-4">Produk</h2>
        {loading ? (
          <Loading />
        ) : (
          <ProductGrid products={products} onAddToCart={handleAddToCart} />
        )}
      </div>
    </div>
  );
}