# 🔧 PURELY - Backend Part 3 (Routes & Config)

## 📦 API Routes

*File: `routes/api.php`*

```php
<?php

use App\Http\Controllers\Api\V1\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\V1\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Customer\CartController;
use App\Http\Controllers\Api\V1\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Api\V1\Customer\ProductController as CustomerProductController;
use App\Http\Controllers\Api\V1\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Api\V1\Seller\ProductController as SellerProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Version 1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    
    // Public Routes
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
    });

    // Public Product Routes
    Route::get('products', [CustomerProductController::class, 'index']);
    Route::get('products/{id}', [CustomerProductController::class, 'show']);
    Route::get('categories', [AdminCategoryController::class, 'index']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        
        // Auth Routes
        Route::prefix('auth')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
            Route::put('profile', [AuthController::class, 'updateProfile']);
        });

        // Customer Routes
        Route::middleware('role:customer')->prefix('cart')->group(function () {
            Route::get('/', [CartController::class, 'index']);
            Route::post('items', [CartController::class, 'addItem']);
            Route::put('items/{id}', [CartController::class, 'updateItem']);
            Route::delete('items/{id}', [CartController::class, 'removeItem']);
            Route::delete('clear', [CartController::class, 'clear']);
        });

        Route::middleware('role:customer')->prefix('orders')->group(function () {
            Route::get('/', [CustomerOrderController::class, 'index']);
            Route::post('/', [CustomerOrderController::class, 'store']);
            Route::get('{id}', [CustomerOrderController::class, 'show']);
            Route::put('{id}/cancel', [CustomerOrderController::class, 'cancel']);
        });

        // Seller Routes
        Route::middleware('role:seller')->prefix('seller')->group(function () {
            Route::apiResource('products', SellerProductController::class);
            Route::put('products/{id}/stock', [SellerProductController::class, 'updateStock']);
            
            Route::get('orders', [SellerOrderController::class, 'index']);
            Route::get('orders/{id}', [SellerOrderController::class, 'show']);
            Route::put('orders/{id}/status', [SellerOrderController::class, 'updateStatus']);
        });

        // Admin Routes
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            // Users
            Route::get('users', [AdminUserController::class, 'index']);
            Route::get('users/{id}', [AdminUserController::class, 'show']);
            Route::put('users/{id}', [AdminUserController::class, 'update']);
            Route::delete('users/{id}', [AdminUserController::class, 'destroy']);
            
            // Categories
            Route::apiResource('categories', AdminCategoryController::class);
            
            // Products
            Route::get('products', [AdminProductController::class, 'index']);
            Route::get('products/{id}', [AdminProductController::class, 'show']);
            Route::delete('products/{id}', [AdminProductController::class, 'destroy']);
            
            // Orders
            Route::get('orders', [AdminOrderController::class, 'index']);
            Route::get('orders/{id}', [AdminOrderController::class, 'show']);
            Route::put('orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
        });
    });
});
```

---

## Admin Controllers (Bonus)

*File: `app/Http/Controllers/Api/V1/Admin/CategoryController.php`*

```php
<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        try {
            $categories = Category::withCount('products')->get();
            return $this->successResponse(
                CategoryResource::collection($categories),
                'Data kategori berhasil diambil'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        try {
            $category = Category::create($validated);
            return $this->successResponse(
                new CategoryResource($category),
                'Kategori berhasil ditambahkan',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal menambah kategori: ' . $e->getMessage(), null, 500);
        }
    }

    public function show(int $id)
    {
        try {
            $category = Category::withCount('products')->findOrFail($id);
            return $this->successResponse(
                new CategoryResource($category),
                'Detail kategori berhasil diambil'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Kategori tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        try {
            $category = Category::findOrFail($id);
            $category->update($validated);

            return $this->successResponse(
                new CategoryResource($category),
                'Kategori berhasil diupdate'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Kategori tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal update kategori: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $category = Category::findOrFail($id);
            
            if ($category->products()->count() > 0) {
                return $this->errorResponse(
                    'Kategori tidak dapat dihapus karena masih memiliki produk',
                    null,
                    400
                );
            }

            $category->delete();
            return $this->successResponse(null, 'Kategori berhasil dihapus');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Kategori tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal hapus kategori: ' . $e->getMessage(), null, 500);
        }
    }
}
```

*File: `app/Http/Controllers/Api/V1/Admin/OrderController.php`*

```php
<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private OrderService $orderService
    ) {}

    public function index(Request $request)
    {
        try {
            $orders = $this->orderService->getAllOrders($request->all());
            
            return $this->successResponseWithPagination(
                $orders->setCollection(
                    OrderResource::collection($orders->getCollection())
                ),
                'Data order berhasil diambil'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    public function show(int $id)
    {
        try {
            $order = $this->orderService->getOrderById($id, auth()->user());
            return $this->successResponse(
                new OrderResource($order),
                'Detail order berhasil diambil'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,paid,packed,shipped,delivered,canceled',
        ]);

        try {
            $order = Order::findOrFail($id);
            $order = $this->orderService->updateOrderStatus($order, $request->status);

            return $this->successResponse(
                new OrderResource($order),
                'Status order berhasil diupdate'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }
}
```

---

## 🔧 Configuration Files

### 1. CORS Configuration

*File: `config/cors.php`*

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:3001',
        env('FRONTEND_URL', 'http://localhost:3000'),
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true,
];
```

### 2. Sanctum Configuration

*File: `config/sanctum.php`*

```php
<?php

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),

    'guard' => ['web'],

    'expiration' => null,

    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],
];
```

### 3. Filesystem Configuration

*File: `config/filesystems.php`* (update bagian public)

```php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
    'throw' => false,
],
```

### 4. Bootstrap Providers

*File: `bootstrap/providers.php`*

```php
<?php

return [
    App\Providers\AppServiceProvider::class,
];
```

*File: `app/Providers/AppServiceProvider.php`*

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register services
    }

    public function boot(): void
    {
        // Add global middleware
    }
}
```

### 5. Register Middleware

*File: `bootstrap/app.php`*

```php
<?php

use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```

---

## 📝 Environment Example

*File: `.env.example`*

```env
APP_NAME=Purely
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=Asia/Jakarta
APP_URL=http://localhost:8000

APP_LOCALE=id
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=id_ID

FRONTEND_URL=http://localhost:3000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=purely
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

CACHE_STORE=database
CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@purely.id"
MAIL_FROM_NAME="${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:3001,127.0.0.1:3000

VITE_APP_NAME="${APP_NAME}"
```

---

## 🚀 Setup & Installation Commands

### 1. Initial Setup

```bash
# Clone atau create project
composer create-project laravel/laravel purely-backend
cd purely-backend

# Install Sanctum
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Setup .env
cp .env.example .env
php artisan key:generate

# Update .env dengan database credentials
```

### 2. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE purely;
exit;

# Run migrations
php artisan migrate

# Run seeders
php artisan db:seed

# Create storage symlink
php artisan storage:link
```

### 3. Testing

```bash
# Run server
php artisan serve

# Test endpoints dengan Postman atau curl
curl http://localhost:8000/api/v1/products
```

---

## 📚 API Testing Examples (using curl)

### Register

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@purely.id",
    "password": "password",
    "password_confirmation": "password",
    "phone": "081234567890",
    "role": "customer"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@purely.id",
    "password": "password"
  }'
```

### Get Products (Public)

```bash
curl http://localhost:8000/api/v1/products
```

### Get Cart (Protected)

```bash
curl http://localhost:8000/api/v1/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Add to Cart

```bash
curl -X POST http://localhost:8000/api/v1/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

### Create Order

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "delivery_address": "Jl. Pandanaran No. 456, Semarang",
    "delivery_notes": "Tolong ketuk pintu 2x",
    "payment_method": "cod"
  }'
```

---

## 🎯 Testing Credentials

Setelah menjalankan seeder, gunakan credentials ini:

**Admin:**
- Email: `admin@purely.id`
- Password: `password`

**Seller:**
- Email: `seller@purely.id`
- Password: `password`

**Customer:**
- Email: `customer@purely.id`
- Password: `password`

---

## ✅ Backend Checklist

- [x] Models & Relationships
- [x] Migrations
- [x] Seeders
- [x] Enums (Role, Status)
- [x] API Resources
- [x] Form Requests
- [x] Services
- [x] Controllers (Auth, Customer, Seller, Admin)
- [x] Middleware (Role-based)
- [x] API Routes (versioned)
- [x] API Response Trait
- [x] Configuration (CORS, Sanctum)
- [x] .env.example

---

## 📦 Struktur Response API

### Success Response
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": { ... }
}
```

### Success with Pagination
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7
  }
}
```

### Error Response
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

Backend Laravel sudah selesai! 🎉

Selanjutnya kita akan membuat Frontend Next.js dengan:
1. Struktur folder App Router
2. Components reusable
3. API service layer
4. Auth handling
5. State management (Zustand)
6. UI/UX modern dengan Tailwind
