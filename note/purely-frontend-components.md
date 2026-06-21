# 🌿 PURELY - Frontend Components & Pages

## 🧩 Reusable Components

### 1. UI Components

*File: `src/components/ui/Button.tsx`*

```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </button>
  );
};
```

*File: `src/components/ui/Input.tsx`*

```typescript
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-field ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

*File: `src/components/ui/Card.tsx`*

```typescript
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`card ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
```

*File: `src/components/ui/Badge.tsx`*

```typescript
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'gray',
  className = '' 
}) => {
  const variants = {
    green: 'badge-green',
    yellow: 'badge-yellow',
    red: 'badge-red',
    blue: 'badge-blue',
    gray: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
```

*File: `src/components/ui/Loading.tsx`*

```typescript
import React from 'react';

export const Loading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  );
};

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <Loading />
      </div>
    </div>
  );
};
```

---

### 2. Layout Components

*File: `src/components/layout/Header.tsx`*

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Purely</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`font-medium ${
                isActive('/') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/products"
              className={`font-medium ${
                isActive('/products') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Produk
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {user.role === 'customer' && (
                  <Link
                    href="/cart"
                    className="relative p-2 text-gray-600 hover:text-primary-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cart && cart.total_items > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {cart.total_items}
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="py-2">
                      {user.role === 'customer' && (
                        <>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Pesanan Saya
                          </Link>
                        </>
                      )}
                      {user.role === 'seller' && (
                        <Link
                          href="/seller/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Dashboard Seller
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link
                          href="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Dashboard Admin
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-medium text-gray-600 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
```

*File: `src/components/layout/Footer.tsx`*

```typescript
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Purely</h3>
            <p className="text-sm">
              Marketplace grocery & delivery terpercaya untuk Semarang. 
              Belanja kebutuhan sehari-hari jadi lebih mudah.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tautan</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Beranda</Link></li>
              <li><Link href="/products" className="hover:text-white">Produk</Link></li>
              <li><Link href="/about" className="hover:text-white">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="text-white font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white">Kontak</Link></li>
              <li><Link href="/terms" className="hover:text-white">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: hello@purely.id</li>
              <li>Phone: 0812-3456-7890</li>
              <li>Semarang, Jawa Tengah</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 Purely. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
```

---

### 3. Product Components

*File: `src/components/product/ProductCard.tsx`*

```typescript
import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatters';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart 
}) => {
  return (
    <div className="card group hover:shadow-lg transition-all duration-200">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative mb-3 bg-gray-100 rounded-lg overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Stok Habis
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {product.category && (
          <p className="text-xs text-gray-500">{product.category.name}</p>
        )}

        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-primary-600">
              {formatCurrency(product.price)}
            </p>
            <p className="text-xs text-gray-500">per {product.unit}</p>
          </div>

          {product.in_stock && onAddToCart && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              + Keranjang
            </Button>
          )}
        </div>

        {product.seller && (
          <p className="text-xs text-gray-500">
            Dijual oleh {product.seller.name}
          </p>
        )}
      </div>
    </div>
  );
};
```

*File: `src/components/product/ProductGrid.tsx`*

```typescript
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onAddToCart 
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Tidak ada produk ditemukan</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
```

---

### 4. Cart Components

*File: `src/components/cart/CartItem.tsx`*

```typescript
import { CartItem as CartItemType } from '@/types/cart';
import { formatCurrency } from '@/lib/utils/formatters';
import Image from 'next/image';
import { Button } from '../ui/Button';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.product.stock) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
        {item.product.image_url ? (
          <Image
            src={item.product.image_url}
            alt={item.product.name}
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
        <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
        <p className="text-sm text-gray-500">
          {formatCurrency(item.price)} / {item.product.unit}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            -
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.product.stock}
            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            +
          </button>

          <button
            onClick={() => onRemove(item.id)}
            className="ml-auto text-red-600 hover:text-red-700 text-sm"
          >
            Hapus
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="font-bold text-gray-900">
          {formatCurrency(item.subtotal)}
        </p>
      </div>
    </div>
  );
};
```

---

### 5. Utility Functions

*File: `src/lib/utils/formatters.ts`*

```typescript
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
```

---

## 📄 Example Pages

### 1. Home Page

*File: `src/app/(customer)/page.tsx`*

```typescript
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
```

### 2. Login Page

*File: `src/app/(auth)/login/page.tsx`*

```typescript
'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await login(formData);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Masuk ke Purely
          </h1>
          <p className="text-gray-600">
            Belanja kebutuhan sehari-hari jadi lebih mudah
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
            >
              Masuk
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. Root Layout

*File: `src/app/layout.tsx`*

```typescript
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Purely - Grocery Marketplace Semarang',
  description: 'Belanja kebutuhan sehari-hari jadi lebih mudah',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${dmSans.variable} font-sans`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#374151',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
```

### 4. Customer Layout

*File: `src/app/(customer)/layout.tsx`*

```typescript
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

---

## ✅ Checklist Implementasi

### Backend ✅
- [x] Models & Relationships
- [x] Migrations
- [x] Seeders
- [x] Enums
- [x] Services
- [x] Controllers
- [x] API Routes
- [x] Middleware
- [x] Resources
- [x] Requests

### Frontend ✅
- [x] Next.js Setup
- [x] TypeScript Types
- [x] API Client (Axios)
- [x] Auth Store (Zustand)
- [x] Cart Store
- [x] Custom Hooks
- [x] UI Components
- [x] Layout Components
- [x] Product Components
- [x] Cart Components
- [x] Auth Pages
- [x] Home Page
- [x] Tailwind Config

---

## 🚀 Getting Started

### Backend
```bash
cd purely-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### Frontend
```bash
cd purely-frontend
npm install
npm run dev
```

Open http://localhost:3000

**Login credentials:**
- Customer: customer@purely.id / password
- Seller: seller@purely.id / password
- Admin: admin@purely.id / password

---

🎉 Selesai! Purely siap digunakan untuk MVP.
