# 🌿 PURELY - Frontend Next.js Implementation

## 📦 Setup & Installation

### 1. Create Next.js Project

```bash
npx create-next-app@latest purely-frontend
# Choose:
# ✅ TypeScript
# ✅ ESLint
# ✅ Tailwind CSS
# ✅ src/ directory
# ✅ App Router
# ❌ Turbopack
# ❌ Import alias (use default @/*)

cd purely-frontend
```

### 2. Install Dependencies

```bash
npm install axios zustand
npm install @headlessui/react @heroicons/react
npm install react-hot-toast
npm install date-fns
npm install sharp  # for Next.js image optimization
```

### 3. Project Structure

```
purely-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (customer)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── (seller)/
│   │   │   └── seller/
│   │   │       ├── layout.tsx
│   │   │       ├── dashboard/page.tsx
│   │   │       └── products/page.tsx
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       └── dashboard/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── product/
│   │   ├── cart/
│   │   └── auth/
│   ├── lib/
│   │   ├── api/
│   │   ├── utils/
│   │   └── constants/
│   ├── store/
│   │   ├── authStore.ts
│   │   └── cartStore.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   └── api.ts
│   └── hooks/
│       ├── useAuth.ts
│       └── useCart.ts
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🎨 Configuration Files

### 1. Environment Variables

*File: `.env.local`*

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Purely
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Next.js Config

*File: `next.config.js`*

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
}

module.exports = nextConfig
```

### 3. Tailwind Config (Green Theme)

*File: `tailwind.config.ts`*

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'Inter', 'sans-serif'],
        display: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

### 4. Global Styles

*File: `src/app/globals.css`*

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
  }

  body {
    @apply bg-gray-50 text-gray-900;
  }

  * {
    @apply border-gray-200;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors duration-200;
  }

  .btn-outline {
    @apply border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-medium px-4 py-2 rounded-lg transition-colors duration-200;
  }

  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  }

  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-100 p-4;
  }

  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }

  .badge-green {
    @apply bg-green-100 text-green-800;
  }

  .badge-yellow {
    @apply bg-yellow-100 text-yellow-800;
  }

  .badge-red {
    @apply bg-red-100 text-red-800;
  }

  .badge-blue {
    @apply bg-blue-100 text-blue-800;
  }
}
```

---

## 📁 Type Definitions

### 1. API Types

*File: `src/types/api.ts`*

```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
```

### 2. Auth Types

*File: `src/types/auth.ts`*

```typescript
export type UserRole = 'customer' | 'seller' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address?: string;
  avatar?: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  address?: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}
```

### 3. Product Types

*File: `src/types/product.ts`*

```typescript
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  products_count?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  image_url?: string;
  in_stock: boolean;
  is_active: boolean;
  category?: Category;
  seller?: {
    id: number;
    name: string;
  };
  created_at: string;
}

export interface ProductFilters {
  category_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  per_page?: number;
  page?: number;
}
```

### 4. Cart Types

*File: `src/types/cart.ts`*

```typescript
import { Product } from './product';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  total_price: number;
}

export interface AddToCartPayload {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
```

### 5. Order Types

*File: `src/types/order.ts`*

```typescript
import { Product } from './product';

export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'packed' 
  | 'shipped' 
  | 'delivered' 
  | 'canceled';

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export type PaymentMethod = 'cod' | 'transfer' | 'ewallet';

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  status_label: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  delivery_address: string;
  delivery_notes?: string;
  delivery_fee: number;
  estimated_delivery?: string;
  delivered_at?: string;
  items?: OrderItem[];
  created_at: string;
}

export interface CreateOrderPayload {
  delivery_address: string;
  delivery_notes?: string;
  payment_method: PaymentMethod;
}

export interface OrderFilters {
  status?: OrderStatus;
  per_page?: number;
  page?: number;
}
```

---

## 🔌 API Client

### 1. Axios Instance

*File: `src/lib/api/client.ts`*

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Auth API

*File: `src/lib/api/auth.ts`*

```typescript
import { ApiResponse } from '@/types/api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/auth';
import apiClient from './client';

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    return response.data.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
      '/auth/profile',
      data
    );
    return response.data.data;
  },
};
```

### 3. Products API

*File: `src/lib/api/products.ts`*

```typescript
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Category, Product, ProductFilters } from '@/types/product';
import apiClient from './client';

export const productsApi = {
  getAll: async (filters?: ProductFilters) => {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      '/products',
      { params: filters }
    );
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/${id}`
    );
    return response.data.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      '/categories'
    );
    return response.data.data;
  },
};
```

### 4. Cart API

*File: `src/lib/api/cart.ts`*

```typescript
import { ApiResponse } from '@/types/api';
import { AddToCartPayload, Cart, UpdateCartItemPayload } from '@/types/cart';
import apiClient from './client';

export const cartApi = {
  get: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  },

  addItem: async (payload: AddToCartPayload): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>(
      '/cart/items',
      payload
    );
    return response.data.data;
  },

  updateItem: async (
    itemId: number,
    payload: UpdateCartItemPayload
  ): Promise<Cart> => {
    const response = await apiClient.put<ApiResponse<Cart>>(
      `/cart/items/${itemId}`,
      payload
    );
    return response.data.data;
  },

  removeItem: async (itemId: number): Promise<Cart> => {
    const response = await apiClient.delete<ApiResponse<Cart>>(
      `/cart/items/${itemId}`
    );
    return response.data.data;
  },

  clear: async (): Promise<void> => {
    await apiClient.delete('/cart/clear');
  },
};
```

### 5. Orders API

*File: `src/lib/api/orders.ts`*

```typescript
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { CreateOrderPayload, Order, OrderFilters } from '@/types/order';
import apiClient from './client';

export const ordersApi = {
  getAll: async (filters?: OrderFilters) => {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      '/orders',
      { params: filters }
    );
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  create: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      '/orders',
      payload
    );
    return response.data.data;
  },

  cancel: async (id: number, reason?: string): Promise<Order> => {
    const response = await apiClient.put<ApiResponse<Order>>(
      `/orders/${id}/cancel`,
      { reason }
    );
    return response.data.data;
  },
};
```

---

## 🗄️ State Management (Zustand)

### 1. Auth Store

*File: `src/store/authStore.ts`*

```typescript
import { User } from '@/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### 2. Cart Store

*File: `src/store/cartStore.ts`*

```typescript
import { Cart } from '@/types/cart';
import { create } from 'zustand';

interface CartState {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,

  setCart: (cart) => set({ cart }),

  clearCart: () => set({ cart: null }),
}));
```

---

## 🪝 Custom Hooks

### 1. useAuth Hook

*File: `src/hooks/useAuth.ts`*

```typescript
'use client';

import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { LoginCredentials, RegisterData } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await authApi.register(data);
      setAuth(response.user, response.token);
      toast.success('Registrasi berhasil!');
      
      // Redirect based on role
      if (response.user.role === 'customer') {
        router.push('/');
      } else if (response.user.role === 'seller') {
        router.push('/seller/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registrasi gagal';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      setAuth(response.user, response.token);
      toast.success('Login berhasil!');

      // Redirect based on role
      if (response.user.role === 'customer') {
        router.push('/');
      } else if (response.user.role === 'seller') {
        router.push('/seller/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login gagal';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      toast.success('Logout berhasil');
      router.push('/login');
    } catch (error) {
      clearAuth();
      router.push('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
  };
};
```

### 2. useCart Hook

*File: `src/hooks/useCart.ts`*

```typescript
'use client';

import { cartApi } from '@/lib/api/cart';
import { useCartStore } from '@/store/cartStore';
import { AddToCartPayload } from '@/types/cart';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const useCart = () => {
  const { cart, setCart, clearCart: clearCartStore } = useCartStore();
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartApi.get();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (payload: AddToCartPayload) => {
    try {
      const data = await cartApi.addItem(payload);
      setCart(data);
      toast.success('Produk ditambahkan ke keranjang');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menambahkan produk';
      toast.error(message);
      throw error;
    }
  };

  const updateItem = async (itemId: number, quantity: number) => {
    try {
      const data = await cartApi.updateItem(itemId, { quantity });
      setCart(data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal update quantity';
      toast.error(message);
      throw error;
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const data = await cartApi.removeItem(itemId);
      setCart(data);
      toast.success('Produk dihapus dari keranjang');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal hapus produk';
      toast.error(message);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      clearCartStore();
      toast.success('Keranjang dikosongkan');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal kosongkan keranjang';
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
};
```

---

File terlalu panjang, akan saya lanjutkan dengan Components di file berikutnya.
