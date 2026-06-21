# 🌿 PURELY - Arsitektur Sistem & Panduan Lengkap

> Aplikasi marketplace grocery & on-demand delivery untuk Semarang, Indonesia

---

## 📋 Daftar Isi

1. [Arsitektur Sistem](#arsitektur-sistem)
2. [Struktur Folder Backend (Laravel)](#struktur-folder-backend)
3. [Struktur Folder Frontend (Next.js)](#struktur-folder-frontend)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Keputusan Design](#keputusan-design)

---

## 🏗️ Arsitektur Sistem

### Overview

```
┌─────────────────┐
│   Next.js App   │ (Frontend - Vercel/Hosting)
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/REST
         │ API Calls + JWT Token
         ▼
┌─────────────────┐
│  Laravel API    │ (Backend - Server/VPS)
│   (Port 8000)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ MySQL/Postgres  │ (Database)
└─────────────────┘
```

### Tech Stack Detail

**Backend:**
- Laravel 11.x
- Laravel Sanctum (API Authentication)
- MySQL 8.0 / PostgreSQL 15
- PHP 8.2+

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TailwindCSS
- Zustand (State Management)
- Axios (HTTP Client)

### Alur Kerja Utama

1. **Authentication Flow**
   ```
   User → Login → Laravel API → Generate Token → 
   Store Token → Access Protected Routes
   ```

2. **Order Flow**
   ```
   Browse Products → Add to Cart → Checkout → 
   Create Order → Payment → Order Processing → Delivery
   ```

3. **Role-Based Access**
   - **Customer**: Browse, order, track orders
   - **Seller**: Manage products, view orders, update stock
   - **Admin**: Manage all data, users, categories

---

## 📁 Struktur Folder Backend (Laravel)

```
purely-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── V1/
│   │   │   │   │   ├── Auth/
│   │   │   │   │   │   ├── AuthController.php
│   │   │   │   │   │   ├── ProfileController.php
│   │   │   │   │   ├── Customer/
│   │   │   │   │   │   ├── ProductController.php
│   │   │   │   │   │   ├── CartController.php
│   │   │   │   │   │   ├── OrderController.php
│   │   │   │   │   ├── Seller/
│   │   │   │   │   │   ├── ProductController.php
│   │   │   │   │   │   ├── OrderController.php
│   │   │   │   │   │   ├── StockController.php
│   │   │   │   │   ├── Admin/
│   │   │   │   │   │   ├── UserController.php
│   │   │   │   │   │   ├── CategoryController.php
│   │   │   │   │   │   ├── ProductController.php
│   │   │   │   │   │   ├── OrderController.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Category.php
│   │   ├── Cart.php
│   │   ├── CartItem.php
│   │   ├── Order.php
│   │   ├── OrderItem.php
│   ├── Services/
│   │   ├── AuthService.php
│   │   ├── ProductService.php
│   │   ├── CartService.php
│   │   ├── OrderService.php
│   ├── Repositories/ (Optional untuk MVP)
│   │   ├── ProductRepository.php
│   │   ├── OrderRepository.php
│   ├── Http/
│   │   ├── Requests/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginRequest.php
│   │   │   │   ├── RegisterRequest.php
│   │   │   ├── Product/
│   │   │   │   ├── StoreProductRequest.php
│   │   │   │   ├── UpdateProductRequest.php
│   │   │   ├── Order/
│   │   │   │   ├── CreateOrderRequest.php
│   │   ├── Resources/
│   │   │   ├── UserResource.php
│   │   │   ├── ProductResource.php
│   │   │   ├── CategoryResource.php
│   │   │   ├── OrderResource.php
│   │   │   ├── CartResource.php
│   │   ├── Middleware/
│   │   │   ├── RoleMiddleware.php
│   │   │   ├── JsonApiResponse.php
│   ├── Traits/
│   │   ├── ApiResponseTrait.php
│   ├── Enums/
│   │   ├── OrderStatus.php
│   │   ├── UserRole.php
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000000_create_users_table.php
│   │   ├── 2024_01_02_000000_create_categories_table.php
│   │   ├── 2024_01_03_000000_create_products_table.php
│   │   ├── 2024_01_04_000000_create_carts_table.php
│   │   ├── 2024_01_05_000000_create_cart_items_table.php
│   │   ├── 2024_01_06_000000_create_orders_table.php
│   │   ├── 2024_01_07_000000_create_order_items_table.php
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── UserSeeder.php
│   │   ├── CategorySeeder.php
│   │   ├── ProductSeeder.php
├── routes/
│   ├── api.php
├── config/
│   ├── sanctum.php
│   ├── cors.php
├── .env.example
├── README.md
```

### Penjelasan Struktur Backend

**Controllers**: Dibagi per versi API dan role untuk memudahkan maintenance
**Services**: Business logic terpisah dari controller
**Repositories**: (Optional) Untuk query kompleks, bisa ditambahkan nanti
**Requests**: Validasi input
**Resources**: Format response API
**Middleware**: Role checking & JSON response standardization
**Traits**: Reusable code (ApiResponse)
**Enums**: Constants untuk status & roles

---

## 📁 Struktur Folder Frontend (Next.js)

```
purely-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   ├── (customer)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Home
│   │   │   ├── products/
│   │   │   │   ├── page.tsx                # Product List
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx            # Product Detail
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx                # Order History
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx            # Order Detail
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   ├── (seller)/
│   │   │   ├── seller/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── edit/
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   ├── orders/
│   │   │   │   │   └── page.tsx
│   │   ├── (admin)/
│   │   │   ├── admin/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── categories/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── products/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── orders/
│   │   │   │   │   └── page.tsx
│   │   ├── layout.tsx                      # Root Layout
│   │   ├── globals.css
│   ├── components/
│   │   ├── ui/                             # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Loading.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilter.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   ├── order/
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderStatus.tsx
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts                   # Axios instance
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   ├── cart.ts
│   │   │   ├── orders.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts               # Format currency, date, etc
│   │   │   ├── validators.ts
│   │   ├── constants/
│   │   │   ├── routes.ts
│   │   │   ├── api-endpoints.ts
│   ├── store/
│   │   ├── authStore.ts                    # Zustand store
│   │   ├── cartStore.ts
│   │   ├── productStore.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   ├── api.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   ├── middleware.ts                       # Next.js middleware for auth
├── public/
│   ├── images/
│   ├── icons/
├── .env.local.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
```

### Penjelasan Struktur Frontend

**Route Groups**: `(auth)`, `(customer)`, `(seller)`, `(admin)` untuk organisasi tanpa mempengaruhi URL
**Components**: Dibagi per fungsi (ui, layout, feature-specific)
**lib/api**: Semua API calls terpusat
**store**: State management dengan Zustand
**types**: TypeScript interfaces
**hooks**: Custom React hooks untuk logic reuse
**middleware.ts**: Protect routes berdasarkan auth status

---

## 🗄️ Database Schema

### Users Table
```sql
id: bigint (PK)
name: varchar(255)
email: varchar(255) UNIQUE
password: varchar(255)
role: enum('customer', 'seller', 'admin')
phone: varchar(20)
address: text
avatar: varchar(255) NULLABLE
is_active: boolean DEFAULT true
email_verified_at: timestamp NULLABLE
created_at: timestamp
updated_at: timestamp
```

### Categories Table
```sql
id: bigint (PK)
name: varchar(100)
slug: varchar(100) UNIQUE
description: text NULLABLE
icon: varchar(255) NULLABLE
is_active: boolean DEFAULT true
created_at: timestamp
updated_at: timestamp
```

### Products Table
```sql
id: bigint (PK)
seller_id: bigint (FK → users)
category_id: bigint (FK → categories)
name: varchar(255)
slug: varchar(255) UNIQUE
description: text
price: decimal(10,2)
stock: int DEFAULT 0
unit: varchar(50) (kg, pcs, liter, etc)
image: varchar(255) NULLABLE
images: json NULLABLE (multiple images)
is_active: boolean DEFAULT true
created_at: timestamp
updated_at: timestamp
```

### Carts Table
```sql
id: bigint (PK)
user_id: bigint (FK → users) UNIQUE
created_at: timestamp
updated_at: timestamp
```

### Cart Items Table
```sql
id: bigint (PK)
cart_id: bigint (FK → carts)
product_id: bigint (FK → products)
quantity: int
price: decimal(10,2) (harga saat ditambah ke cart)
created_at: timestamp
updated_at: timestamp

UNIQUE(cart_id, product_id)
```

### Orders Table
```sql
id: bigint (PK)
order_number: varchar(50) UNIQUE
user_id: bigint (FK → users)
total_amount: decimal(10,2)
status: enum('pending', 'paid', 'packed', 'shipped', 'delivered', 'canceled')
payment_method: varchar(50) NULLABLE
payment_status: enum('unpaid', 'paid', 'refunded')
delivery_address: text
delivery_notes: text NULLABLE
delivery_fee: decimal(10,2) DEFAULT 0
estimated_delivery: timestamp NULLABLE
delivered_at: timestamp NULLABLE
canceled_at: timestamp NULLABLE
cancelation_reason: text NULLABLE
created_at: timestamp
updated_at: timestamp
```

### Order Items Table
```sql
id: bigint (PK)
order_id: bigint (FK → orders)
product_id: bigint (FK → products)
seller_id: bigint (FK → users)
quantity: int
price: decimal(10,2)
subtotal: decimal(10,2)
created_at: timestamp
updated_at: timestamp
```

### Relationships

```
User → hasMany → Product (as seller)
User → hasOne → Cart
User → hasMany → Order

Category → hasMany → Product

Product → belongsTo → User (seller)
Product → belongsTo → Category

Cart → belongsTo → User
Cart → hasMany → CartItem

CartItem → belongsTo → Cart
CartItem → belongsTo → Product

Order → belongsTo → User
Order → hasMany → OrderItem

OrderItem → belongsTo → Order
OrderItem → belongsTo → Product
OrderItem → belongsTo → User (seller)
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Registrasi user baru |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout (requires auth) |
| GET | `/auth/me` | Get user profile (requires auth) |
| PUT | `/auth/profile` | Update profile (requires auth) |

### Products (Public + Auth)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | List semua produk | No |
| GET | `/products/{id}` | Detail produk | No |
| GET | `/categories` | List kategori | No |

### Cart (Customer)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get cart |
| POST | `/cart/items` | Tambah item |
| PUT | `/cart/items/{id}` | Update quantity |
| DELETE | `/cart/items/{id}` | Hapus item |
| DELETE | `/cart/clear` | Kosongkan cart |

### Orders (Customer)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create order |
| GET | `/orders` | List orders |
| GET | `/orders/{id}` | Detail order |
| PUT | `/orders/{id}/cancel` | Cancel order |

### Seller Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/seller/products` | List produk seller |
| POST | `/seller/products` | Tambah produk |
| PUT | `/seller/products/{id}` | Update produk |
| DELETE | `/seller/products/{id}` | Hapus produk |
| PUT | `/seller/products/{id}/stock` | Update stock |
| GET | `/seller/orders` | List orders untuk seller |
| PUT | `/seller/orders/{id}/status` | Update order status |

### Admin Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List users |
| PUT | `/admin/users/{id}` | Update user |
| DELETE | `/admin/users/{id}` | Delete user |
| GET | `/admin/categories` | List categories |
| POST | `/admin/categories` | Tambah category |
| PUT | `/admin/categories/{id}` | Update category |
| DELETE | `/admin/categories/{id}` | Delete category |
| GET | `/admin/products` | List all products |
| GET | `/admin/orders` | List all orders |
| PUT | `/admin/orders/{id}/status` | Update order status |

### Response Format Standar

**Success Response:**
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {
    // response data
  },
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "email": ["Email sudah terdaftar"],
    "password": ["Password minimal 8 karakter"]
  }
}
```

---

## 🎨 Keputusan Design

### 1. **Separation of Concerns**
- **Backend**: Controller → Service → Model → Database
- **Frontend**: Component → Hook → API Layer → Store
- Setiap layer punya tanggung jawab jelas

### 2. **API Versioning**
- Semua endpoint di `/api/v1`
- Memudahkan update API di masa depan tanpa breaking changes

### 3. **Authentication Strategy**
- Menggunakan **Laravel Sanctum** karena:
  - Simple untuk SPA
  - Built-in di Laravel
  - Token-based, cocok untuk mobile app
  - Tidak perlu library tambahan seperti JWT

### 4. **Role-Based Access Control (RBAC)**
- 3 roles: customer, seller, admin
- Middleware untuk setiap route group
- Fleksibel untuk ditambah role baru

### 5. **State Management (Frontend)**
- **Zustand** dipilih karena:
  - Lebih simple dari Redux
  - TypeScript friendly
  - Tidak perlu boilerplate banyak
  - Perfect untuk MVP

### 6. **API Layer Pattern**
- Semua API calls di `/lib/api`
- Axios instance dengan interceptor untuk:
  - Auto attach token
  - Handle refresh token
  - Global error handling
  - Request/response transformation

### 7. **File Upload Strategy**
- Simpan di `storage/app/public`
- Symlink ke `public/storage`
- Return URL path di API response
- Frontend display langsung URL

### 8. **Cart Management**
- Cart di database (persistent)
- Bukan localStorage karena:
  - Sync across devices
  - Data tidak hilang
  - Bisa track abandoned cart

### 9. **Order Status Flow**
```
pending → paid → packed → shipped → delivered
                           ↓
                        canceled
```

### 10. **Error Handling**
- Backend: Try-catch di service layer
- Frontend: Global error boundary + local error state
- Consistent error format

### 11. **Validation**
- Backend: Form Request classes
- Frontend: Client-side validation sebelum submit
- Double validation untuk security

### 12. **Image Optimization**
- Next.js Image component
- Lazy loading
- Responsive images
- WebP format

### 13. **SEO Friendly**
- Next.js metadata API
- Dynamic meta tags per page
- Semantic HTML

### 14. **Performance**
- Backend: Database indexing
- Frontend: Code splitting, lazy load
- Caching strategy untuk product list

### 15. **Security**
- CORS configuration
- CSRF protection
- XSS prevention
- SQL injection protection (Eloquent ORM)
- Rate limiting

---

## 🚀 MVP Feature Priority

### Phase 1 (Must Have) ✅
- Auth (register, login, logout)
- Product listing & detail
- Cart management
- Checkout & order creation
- Basic seller dashboard
- Basic admin panel

### Phase 2 (Should Have) 🔜
- Order tracking
- Payment integration
- Push notifications
- Product search & filter
- Rating & review

### Phase 3 (Nice to Have) 💡
- Real-time order tracking
- Chat with seller
- Promo & voucher
- Loyalty points
- Analytics dashboard

---

## 📝 Environment Setup

### Backend (.env)
```env
APP_NAME=Purely
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=purely
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Purely
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🎨 Design System - Green Theme

### Color Palette
```css
/* Primary Green */
--green-50: #f0fdf4
--green-100: #dcfce7
--green-200: #bbf7d0
--green-300: #86efac
--green-400: #4ade80
--green-500: #22c55e  /* Main brand color */
--green-600: #16a34a
--green-700: #15803d
--green-800: #166534
--green-900: #14532d

/* Neutral */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-500: #6b7280
--gray-700: #374151
--gray-900: #111827

/* Semantic */
--success: var(--green-500)
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6
```

### Typography
- **Display**: DM Sans (modern, clean)
- **Body**: Inter (readable)
- **Mono**: JetBrains Mono (code)

---

Ini adalah dokumentasi arsitektur lengkap untuk Purely. Selanjutnya saya akan membuat:
1. Contoh kode Backend (Laravel)
2. Contoh kode Frontend (Next.js)
3. Setup & installation guide

Apakah Anda ingin saya lanjutkan dengan implementasi kode?
