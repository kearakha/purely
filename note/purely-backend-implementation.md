# 🔧 PURELY - Implementasi Backend (Laravel)

## 📦 Installation & Setup

### 1. Install Laravel

```bash
composer create-project laravel/laravel purely-backend
cd purely-backend
```

### 2. Install Dependencies

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 3. Setup Database

```bash
# Edit .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=purely
DB_USERNAME=root
DB_PASSWORD=

# Migrate
php artisan migrate
```

---

## 🏗️ Implementasi Kode

### 1. **Trait ApiResponseTrait**
*File: `app/Traits/ApiResponseTrait.php`*

```php
<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponseTrait
{
    /**
     * Success response
     */
    protected function successResponse($data = null, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Success response with pagination
     */
    protected function successResponseWithPagination($paginator, string $message = 'Success'): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ], 200);
    }

    /**
     * Error response
     */
    protected function errorResponse(string $message = 'Error', $errors = null, int $code = 400): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Validation error response
     */
    protected function validationErrorResponse($validator): JsonResponse
    {
        return $this->errorResponse(
            'Validasi gagal',
            $validator->errors(),
            422
        );
    }

    /**
     * Not found response
     */
    protected function notFoundResponse(string $message = 'Data tidak ditemukan'): JsonResponse
    {
        return $this->errorResponse($message, null, 404);
    }

    /**
     * Unauthorized response
     */
    protected function unauthorizedResponse(string $message = 'Unauthorized'): JsonResponse
    {
        return $this->errorResponse($message, null, 401);
    }

    /**
     * Forbidden response
     */
    protected function forbiddenResponse(string $message = 'Forbidden'): JsonResponse
    {
        return $this->errorResponse($message, null, 403);
    }
}
```

---

### 2. **Enums**

*File: `app/Enums/UserRole.php`*

```php
<?php

namespace App\Enums;

enum UserRole: string
{
    case CUSTOMER = 'customer';
    case SELLER = 'seller';
    case ADMIN = 'admin';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
```

*File: `app/Enums/OrderStatus.php`*

```php
<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case PACKED = 'packed';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELED = 'canceled';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Menunggu Pembayaran',
            self::PAID => 'Dibayar',
            self::PACKED => 'Dikemas',
            self::SHIPPED => 'Dikirim',
            self::DELIVERED => 'Selesai',
            self::CANCELED => 'Dibatalkan',
        };
    }

    public function canTransitionTo(OrderStatus $newStatus): bool
    {
        return match($this) {
            self::PENDING => in_array($newStatus, [self::PAID, self::CANCELED]),
            self::PAID => in_array($newStatus, [self::PACKED, self::CANCELED]),
            self::PACKED => in_array($newStatus, [self::SHIPPED]),
            self::SHIPPED => in_array($newStatus, [self::DELIVERED]),
            self::DELIVERED => false,
            self::CANCELED => false,
        };
    }
}
```

*File: `app/Enums/PaymentStatus.php`*

```php
<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case UNPAID = 'unpaid';
    case PAID = 'paid';
    case REFUNDED = 'refunded';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
```

---

### 3. **Models**

*File: `app/Models/User.php`*

```php
<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'avatar',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'role' => UserRole::class,
    ];

    // Relationships
    public function products()
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Helpers
    public function isCustomer(): bool
    {
        return $this->role === UserRole::CUSTOMER;
    }

    public function isSeller(): bool
    {
        return $this->role === UserRole::SELLER;
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::ADMIN;
    }
}
```

*File: `app/Models/Category.php`*

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    // Relationships
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
```

*File: `app/Models/Product.php`*

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'unit',
        'image',
        'images',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'is_active' => 'boolean',
        'images' => 'array',
    ];

    protected $appends = ['image_url', 'in_stock'];

    // Auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    // Relationships
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Accessors
    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    public function getInStockAttribute()
    {
        return $this->stock > 0;
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    // Methods
    public function decreaseStock(int $quantity): void
    {
        $this->decrement('stock', $quantity);
    }

    public function increaseStock(int $quantity): void
    {
        $this->increment('stock', $quantity);
    }
}
```

*File: `app/Models/Cart.php`*

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id'];

    protected $appends = ['total_items', 'total_price'];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    // Accessors
    public function getTotalItemsAttribute()
    {
        return $this->items()->sum('quantity');
    }

    public function getTotalPriceAttribute()
    {
        return $this->items()->with('product')->get()->sum(function ($item) {
            return $item->quantity * $item->price;
        });
    }

    // Methods
    public function addItem(Product $product, int $quantity = 1)
    {
        $cartItem = $this->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $quantity);
        } else {
            $this->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $product->price,
            ]);
        }
    }

    public function updateItemQuantity(int $cartItemId, int $quantity)
    {
        $cartItem = $this->items()->findOrFail($cartItemId);
        $cartItem->update(['quantity' => $quantity]);
    }

    public function removeItem(int $cartItemId)
    {
        $this->items()->findOrFail($cartItemId)->delete();
    }

    public function clear()
    {
        $this->items()->delete();
    }
}
```

*File: `app/Models/CartItem.php`*

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
    ];

    protected $appends = ['subtotal'];

    // Relationships
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Accessors
    public function getSubtotalAttribute()
    {
        return $this->quantity * $this->price;
    }
}
```

*File: `app/Models/Order.php`*

```php
<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'total_amount',
        'status',
        'payment_method',
        'payment_status',
        'delivery_address',
        'delivery_notes',
        'delivery_fee',
        'estimated_delivery',
        'delivered_at',
        'canceled_at',
        'cancelation_reason',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'status' => OrderStatus::class,
        'payment_status' => PaymentStatus::class,
        'estimated_delivery' => 'datetime',
        'delivered_at' => 'datetime',
        'canceled_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . strtoupper(uniqid());
            }
        });
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scopes
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForSeller($query, int $sellerId)
    {
        return $query->whereHas('items', function ($q) use ($sellerId) {
            $q->where('seller_id', $sellerId);
        });
    }

    public function scopeByStatus($query, OrderStatus $status)
    {
        return $query->where('status', $status);
    }

    // Methods
    public function canBeCanceled(): bool
    {
        return in_array($this->status, [OrderStatus::PENDING, OrderStatus::PAID]);
    }

    public function cancel(string $reason = null): void
    {
        if (!$this->canBeCanceled()) {
            throw new \Exception('Order tidak dapat dibatalkan');
        }

        $this->update([
            'status' => OrderStatus::CANCELED,
            'canceled_at' => now(),
            'cancelation_reason' => $reason,
        ]);

        // Restore stock
        foreach ($this->items as $item) {
            $item->product->increaseStock($item->quantity);
        }
    }

    public function updateStatus(OrderStatus $newStatus): void
    {
        if (!$this->status->canTransitionTo($newStatus)) {
            throw new \Exception('Status order tidak valid');
        }

        $this->update(['status' => $newStatus]);

        if ($newStatus === OrderStatus::DELIVERED) {
            $this->update(['delivered_at' => now()]);
        }
    }
}
```

*File: `app/Models/OrderItem.php`*

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'seller_id',
        'quantity',
        'price',
        'subtotal',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
```

---

### 4. **Migrations**

*File: `database/migrations/2024_01_01_000000_create_users_table.php`*

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['customer', 'seller', 'admin'])->default('customer');
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('avatar')->nullable();
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

*File: `database/migrations/2024_01_02_000000_create_categories_table.php`*

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

*File: `database/migrations/2024_01_03_000000_create_products_table.php`*

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            $table->string('unit', 50)->default('pcs'); // kg, liter, pcs, etc
            $table->string('image')->nullable();
            $table->json('images')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['seller_id', 'is_active']);
            $table->index('category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

*File: `database/migrations/2024_01_04_000000_create_carts_table.php`*

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
```

*File: `database/migrations/2024_01_05_000000_create_cart_items_table.php`*

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->timestamps();

            $table->unique(['cart_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
```

*File: `database/migrations/2024_01_06_000000_create_orders_table.php`*

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['pending', 'paid', 'packed', 'shipped', 'delivered', 'canceled'])->default('pending');
            $table->string('payment_method', 50)->nullable();
            $table->enum('payment_status', ['unpaid', 'paid', 'refunded'])->default('unpaid');
            $table->text('delivery_address');
            $table->text('delivery_notes')->nullable();
            $table->decimal('delivery_fee', 10, 2)->default(0);
            $table->timestamp('estimated_delivery')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('canceled_at')->nullable();
            $table->text('cancelation_reason')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('order_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
```

*File: `database/migrations/2024_01_07_000000_create_order_items_table.php`*

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();

            $table->index('order_id');
            $table->index('seller_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
```

---

### 5. **Seeders**

*File: `database/seeders/DatabaseSeeder.php`*

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
```

*File: `database/seeders/UserSeeder.php`*

```php
<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin Purely',
            'email' => 'admin@purely.id',
            'password' => bcrypt('password'),
            'role' => UserRole::ADMIN,
            'phone' => '081234567890',
            'address' => 'Semarang, Jawa Tengah',
        ]);

        // Seller
        User::create([
            'name' => 'Toko Sayur Segar',
            'email' => 'seller@purely.id',
            'password' => bcrypt('password'),
            'role' => UserRole::SELLER,
            'phone' => '081234567891',
            'address' => 'Jl. Pemuda No. 123, Semarang',
        ]);

        // Customer
        User::create([
            'name' => 'Budi Santoso',
            'email' => 'customer@purely.id',
            'password' => bcrypt('password'),
            'role' => UserRole::CUSTOMER,
            'phone' => '081234567892',
            'address' => 'Jl. Pandanaran No. 456, Semarang',
        ]);
    }
}
```

*File: `database/seeders/CategorySeeder.php`*

```php
<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Sayuran', 'description' => 'Sayuran segar setiap hari', 'icon' => '🥬'],
            ['name' => 'Buah-buahan', 'description' => 'Buah segar dan manis', 'icon' => '🍎'],
            ['name' => 'Daging & Ikan', 'description' => 'Protein hewani berkualitas', 'icon' => '🥩'],
            ['name' => 'Telur & Susu', 'description' => 'Produk susu dan telur', 'icon' => '🥚'],
            ['name' => 'Bumbu Dapur', 'description' => 'Bumbu dan rempah', 'icon' => '🧄'],
            ['name' => 'Minuman', 'description' => 'Minuman segar', 'icon' => '🥤'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
```

*File: `database/seeders/ProductSeeder.php`*

```php
<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $seller = User::where('role', 'seller')->first();
        $sayuran = Category::where('name', 'Sayuran')->first();
        $buah = Category::where('name', 'Buah-buahan')->first();

        $products = [
            [
                'seller_id' => $seller->id,
                'category_id' => $sayuran->id,
                'name' => 'Bayam Hijau Segar',
                'description' => 'Bayam hijau segar dari petani lokal Semarang',
                'price' => 5000,
                'stock' => 50,
                'unit' => 'ikat',
            ],
            [
                'seller_id' => $seller->id,
                'category_id' => $sayuran->id,
                'name' => 'Kangkung Organik',
                'description' => 'Kangkung organik tanpa pestisida',
                'price' => 4500,
                'stock' => 60,
                'unit' => 'ikat',
            ],
            [
                'seller_id' => $seller->id,
                'category_id' => $sayuran->id,
                'name' => 'Tomat Merah',
                'description' => 'Tomat merah segar, cocok untuk masakan',
                'price' => 12000,
                'stock' => 40,
                'unit' => 'kg',
            ],
            [
                'seller_id' => $seller->id,
                'category_id' => $buah->id,
                'name' => 'Jeruk Pontianak',
                'description' => 'Jeruk manis dari Pontianak',
                'price' => 18000,
                'stock' => 30,
                'unit' => 'kg',
            ],
            [
                'seller_id' => $seller->id,
                'category_id' => $buah->id,
                'name' => 'Apel Malang',
                'description' => 'Apel segar dari Malang',
                'price' => 25000,
                'stock' => 25,
                'unit' => 'kg',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
```

---

File ini sudah mencakup Models, Enums, Migrations, dan Seeders. Selanjutnya akan saya lanjutkan dengan Controllers, Services, Requests, dan Resources.

Apakah Anda ingin saya lanjutkan dengan bagian berikutnya?
