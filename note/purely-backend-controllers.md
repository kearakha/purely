# 🔧 PURELY - Backend Part 2 (Controllers, Services, Routes)

## 📦 Controllers, Services, Requests, Resources

### 1. **Form Requests**

*File: `app/Http/Requests/Auth/RegisterRequest.php`*

```php
<?php

namespace App\Http\Requests\Auth;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'role' => ['required', Rule::in(UserRole::values())],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama harus diisi',
            'email.required' => 'Email harus diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Password harus diisi',
            'password.min' => 'Password minimal 8 karakter',
            'password.confirmed' => 'Konfirmasi password tidak cocok',
            'phone.required' => 'Nomor telepon harus diisi',
            'role.required' => 'Role harus dipilih',
        ];
    }
}
```

*File: `app/Http/Requests/Auth/LoginRequest.php`*

```php
<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email harus diisi',
            'email.email' => 'Format email tidak valid',
            'password.required' => 'Password harus diisi',
        ];
    }
}
```

*File: `app/Http/Requests/Product/StoreProductRequest.php`*

```php
<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori harus dipilih',
            'category_id.exists' => 'Kategori tidak valid',
            'name.required' => 'Nama produk harus diisi',
            'description.required' => 'Deskripsi harus diisi',
            'price.required' => 'Harga harus diisi',
            'price.numeric' => 'Harga harus berupa angka',
            'price.min' => 'Harga tidak boleh negatif',
            'stock.required' => 'Stok harus diisi',
            'stock.integer' => 'Stok harus berupa angka bulat',
            'unit.required' => 'Satuan harus diisi',
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format gambar harus jpeg, png, atau jpg',
            'image.max' => 'Ukuran gambar maksimal 2MB',
        ];
    }
}
```

*File: `app/Http/Requests/Order/CreateOrderRequest.php`*

```php
<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'delivery_address' => ['required', 'string'],
            'delivery_notes' => ['nullable', 'string'],
            'payment_method' => ['required', 'string', 'in:cod,transfer,ewallet'],
        ];
    }

    public function messages(): array
    {
        return [
            'delivery_address.required' => 'Alamat pengiriman harus diisi',
            'payment_method.required' => 'Metode pembayaran harus dipilih',
            'payment_method.in' => 'Metode pembayaran tidak valid',
        ];
    }
}
```

---

### 2. **API Resources**

*File: `app/Http/Resources/UserResource.php`*

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role->value,
            'phone' => $this->phone,
            'address' => $this->address,
            'avatar' => $this->avatar,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
```

*File: `app/Http/Resources/CategoryResource.php`*

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'icon' => $this->icon,
            'is_active' => $this->is_active,
            'products_count' => $this->whenCounted('products'),
        ];
    }
}
```

*File: `app/Http/Resources/ProductResource.php`*

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'stock' => $this->stock,
            'unit' => $this->unit,
            'image_url' => $this->image_url,
            'in_stock' => $this->in_stock,
            'is_active' => $this->is_active,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'seller' => new UserResource($this->whenLoaded('seller')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
```

*File: `app/Http/Resources/CartResource.php`*

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'total_items' => $this->total_items,
            'total_price' => $this->total_price,
        ];
    }
}
```

*File: `app/Http/Resources/CartItemResource.php`*

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => new ProductResource($this->whenLoaded('product')),
            'quantity' => $this->quantity,
            'price' => $this->price,
            'subtotal' => $this->subtotal,
        ];
    }
}
```

*File: `app/Http/Resources/OrderResource.php`*

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'total_amount' => $this->total_amount,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status->value,
            'delivery_address' => $this->delivery_address,
            'delivery_notes' => $this->delivery_notes,
            'delivery_fee' => $this->delivery_fee,
            'estimated_delivery' => $this->estimated_delivery?->format('Y-m-d H:i:s'),
            'delivered_at' => $this->delivered_at?->format('Y-m-d H:i:s'),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
```

*File: `app/Http/Resources/OrderItemResource.php`*

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => new ProductResource($this->whenLoaded('product')),
            'quantity' => $this->quantity,
            'price' => $this->price,
            'subtotal' => $this->subtotal,
        ];
    }
}
```

---

### 3. **Services**

*File: `app/Services/AuthService.php`*

```php
<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function register(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        
        $user = User::create($data);
        
        // Auto create cart for customer
        if ($user->isCustomer()) {
            $user->cart()->create();
        }
        
        return $user;
    }

    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Akun Anda tidak aktif'],
            ]);
        }

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
```

*File: `app/Services/ProductService.php`*

```php
<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function getAllProducts(array $filters = []): LengthAwarePaginator
    {
        $query = Product::with(['category', 'seller'])
            ->active();

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (isset($filters['in_stock']) && $filters['in_stock']) {
            $query->inStock();
        }

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    public function getProductById(int $id): Product
    {
        return Product::with(['category', 'seller'])
            ->findOrFail($id);
    }

    public function createProduct(array $data, int $sellerId): Product
    {
        $data['seller_id'] = $sellerId;

        if (isset($data['image'])) {
            $data['image'] = $this->uploadImage($data['image']);
        }

        return Product::create($data);
    }

    public function updateProduct(Product $product, array $data): Product
    {
        if (isset($data['image'])) {
            // Delete old image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $this->uploadImage($data['image']);
        }

        $product->update($data);
        return $product->fresh();
    }

    public function deleteProduct(Product $product): void
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
    }

    public function updateStock(Product $product, int $stock): Product
    {
        $product->update(['stock' => $stock]);
        return $product;
    }

    private function uploadImage($image): string
    {
        return $image->store('products', 'public');
    }
}
```

*File: `app/Services/CartService.php`*

```php
<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Product;
use App\Models\User;

class CartService
{
    public function getCart(User $user): Cart
    {
        return $user->cart()->with(['items.product.category'])->firstOrCreate([
            'user_id' => $user->id,
        ]);
    }

    public function addItem(User $user, int $productId, int $quantity = 1): Cart
    {
        $product = Product::findOrFail($productId);

        if (!$product->is_active) {
            throw new \Exception('Produk tidak tersedia');
        }

        if ($product->stock < $quantity) {
            throw new \Exception('Stok tidak mencukupi');
        }

        $cart = $this->getCart($user);
        $cart->addItem($product, $quantity);

        return $cart->load(['items.product']);
    }

    public function updateItemQuantity(User $user, int $cartItemId, int $quantity): Cart
    {
        $cart = $this->getCart($user);
        
        $cartItem = $cart->items()->findOrFail($cartItemId);
        
        if ($cartItem->product->stock < $quantity) {
            throw new \Exception('Stok tidak mencukupi');
        }

        $cart->updateItemQuantity($cartItemId, $quantity);

        return $cart->load(['items.product']);
    }

    public function removeItem(User $user, int $cartItemId): Cart
    {
        $cart = $this->getCart($user);
        $cart->removeItem($cartItemId);

        return $cart->load(['items.product']);
    }

    public function clearCart(User $user): void
    {
        $cart = $this->getCart($user);
        $cart->clear();
    }
}
```

*File: `app/Services/OrderService.php`*

```php
<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        private CartService $cartService
    ) {}

    public function createOrder(User $user, array $data): Order
    {
        $cart = $this->cartService->getCart($user);

        if ($cart->items->isEmpty()) {
            throw new \Exception('Keranjang kosong');
        }

        // Check stock availability
        foreach ($cart->items as $item) {
            if ($item->product->stock < $item->quantity) {
                throw new \Exception("Stok {$item->product->name} tidak mencukupi");
            }
        }

        return DB::transaction(function () use ($user, $cart, $data) {
            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $cart->total_price,
                'status' => OrderStatus::PENDING,
                'payment_status' => PaymentStatus::UNPAID,
                'delivery_address' => $data['delivery_address'],
                'delivery_notes' => $data['delivery_notes'] ?? null,
                'payment_method' => $data['payment_method'],
                'delivery_fee' => 5000, // Fixed delivery fee for MVP
            ]);

            // Create order items
            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'seller_id' => $item->product->seller_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->subtotal,
                ]);

                // Decrease product stock
                $item->product->decreaseStock($item->quantity);
            }

            // Clear cart
            $cart->clear();

            return $order->load(['items.product', 'user']);
        });
    }

    public function getUserOrders(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = Order::with(['items.product'])
            ->forUser($user->id);

        if (isset($filters['status'])) {
            $query->byStatus(OrderStatus::from($filters['status']));
        }

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    public function getOrderById(int $orderId, User $user): Order
    {
        return Order::with(['items.product.category', 'user'])
            ->forUser($user->id)
            ->findOrFail($orderId);
    }

    public function cancelOrder(Order $order, string $reason = null): Order
    {
        if (!$order->canBeCanceled()) {
            throw new \Exception('Order tidak dapat dibatalkan');
        }

        $order->cancel($reason);

        return $order->fresh();
    }

    public function updateOrderStatus(Order $order, string $status): Order
    {
        $newStatus = OrderStatus::from($status);
        $order->updateStatus($newStatus);

        return $order->fresh();
    }

    public function getSellerOrders(int $sellerId, array $filters = []): LengthAwarePaginator
    {
        $query = Order::with(['items.product', 'user'])
            ->forSeller($sellerId);

        if (isset($filters['status'])) {
            $query->byStatus(OrderStatus::from($filters['status']));
        }

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    public function getAllOrders(array $filters = []): LengthAwarePaginator
    {
        $query = Order::with(['items.product', 'user']);

        if (isset($filters['status'])) {
            $query->byStatus(OrderStatus::from($filters['status']));
        }

        if (isset($filters['user_id'])) {
            $query->forUser($filters['user_id']);
        }

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }
}
```

---

### 4. **Middleware**

*File: `app/Http/Middleware/RoleMiddleware.php`*

```php
<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        $allowedRoles = array_map(fn($role) => UserRole::from($role), $roles);

        if (!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden - Anda tidak memiliki akses',
            ], 403);
        }

        return $next($request);
    }
}
```

---

### 5. **Controllers**

*File: `app/Http/Controllers/Api/V1/Auth/AuthController.php`*

```php
<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponseTrait;

class AuthController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private AuthService $authService
    ) {}

    public function register(RegisterRequest $request)
    {
        try {
            $user = $this->authService->register($request->validated());
            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->successResponse([
                'user' => new UserResource($user),
                'token' => $token,
            ], 'Registrasi berhasil', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Registrasi gagal: ' . $e->getMessage(), null, 500);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $result = $this->authService->login(
                $request->email,
                $request->password
            );

            return $this->successResponse([
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ], 'Login berhasil');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator);
        } catch (\Exception $e) {
            return $this->errorResponse('Login gagal: ' . $e->getMessage(), null, 500);
        }
    }

    public function logout()
    {
        try {
            $this->authService->logout(auth()->user());
            return $this->successResponse(null, 'Logout berhasil');
        } catch (\Exception $e) {
            return $this->errorResponse('Logout gagal: ' . $e->getMessage(), null, 500);
        }
    }

    public function me()
    {
        return $this->successResponse(
            new UserResource(auth()->user()),
            'Data user berhasil diambil'
        );
    }
}
```

*File: `app/Http/Controllers/Api/V1/Customer/ProductController.php`*

```php
<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private ProductService $productService
    ) {}

    public function index(Request $request)
    {
        try {
            $products = $this->productService->getAllProducts($request->all());
            
            return $this->successResponseWithPagination(
                $products->setCollection(
                    ProductResource::collection($products->getCollection())
                ),
                'Data produk berhasil diambil'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    public function show(int $id)
    {
        try {
            $product = $this->productService->getProductById($id);
            return $this->successResponse(
                new ProductResource($product),
                'Detail produk berhasil diambil'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Produk tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }
}
```

*File: `app/Http/Controllers/Api/V1/Customer/CartController.php`*

```php
<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Services\CartService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private CartService $cartService
    ) {}

    public function index()
    {
        try {
            $cart = $this->cartService->getCart(auth()->user());
            return $this->successResponse(
                new CartResource($cart),
                'Keranjang berhasil diambil'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            $cart = $this->cartService->addItem(
                auth()->user(),
                $request->product_id,
                $request->quantity
            );

            return $this->successResponse(
                new CartResource($cart),
                'Produk berhasil ditambahkan ke keranjang'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    public function updateItem(Request $request, int $cartItemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            $cart = $this->cartService->updateItemQuantity(
                auth()->user(),
                $cartItemId,
                $request->quantity
            );

            return $this->successResponse(
                new CartResource($cart),
                'Jumlah produk berhasil diupdate'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    public function removeItem(int $cartItemId)
    {
        try {
            $cart = $this->cartService->removeItem(auth()->user(), $cartItemId);
            return $this->successResponse(
                new CartResource($cart),
                'Produk berhasil dihapus dari keranjang'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    public function clear()
    {
        try {
            $this->cartService->clearCart(auth()->user());
            return $this->successResponse(null, 'Keranjang berhasil dikosongkan');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 500);
        }
    }
}
```

*File: `app/Http/Controllers/Api/V1/Customer/OrderController.php`*

```php
<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateOrderRequest;
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
            $orders = $this->orderService->getUserOrders(auth()->user(), $request->all());
            
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

    public function store(CreateOrderRequest $request)
    {
        try {
            $order = $this->orderService->createOrder(
                auth()->user(),
                $request->validated()
            );

            return $this->successResponse(
                new OrderResource($order),
                'Order berhasil dibuat',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
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

    public function cancel(Request $request, int $id)
    {
        $request->validate([
            'reason' => 'nullable|string',
        ]);

        try {
            $order = $this->orderService->getOrderById($id, auth()->user());
            $order = $this->orderService->cancelOrder($order, $request->reason);

            return $this->successResponse(
                new OrderResource($order),
                'Order berhasil dibatalkan'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }
}
```

*File: `app/Http/Controllers/Api/V1/Seller/ProductController.php`*

```php
<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private ProductService $productService
    ) {}

    public function index(Request $request)
    {
        try {
            $filters = array_merge($request->all(), [
                'seller_id' => auth()->id(),
            ]);
            
            $products = Product::with(['category'])
                ->where('seller_id', auth()->id())
                ->latest()
                ->paginate($request->per_page ?? 15);
            
            return $this->successResponseWithPagination(
                $products->setCollection(
                    ProductResource::collection($products->getCollection())
                ),
                'Data produk berhasil diambil'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    public function store(StoreProductRequest $request)
    {
        try {
            $product = $this->productService->createProduct(
                $request->validated(),
                auth()->id()
            );

            return $this->successResponse(
                new ProductResource($product),
                'Produk berhasil ditambahkan',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal menambah produk: ' . $e->getMessage(), null, 500);
        }
    }

    public function update(StoreProductRequest $request, int $id)
    {
        try {
            $product = Product::where('seller_id', auth()->id())->findOrFail($id);
            $product = $this->productService->updateProduct($product, $request->validated());

            return $this->successResponse(
                new ProductResource($product),
                'Produk berhasil diupdate'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Produk tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal update produk: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $product = Product::where('seller_id', auth()->id())->findOrFail($id);
            $this->productService->deleteProduct($product);

            return $this->successResponse(null, 'Produk berhasil dihapus');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Produk tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal hapus produk: ' . $e->getMessage(), null, 500);
        }
    }

    public function updateStock(Request $request, int $id)
    {
        $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        try {
            $product = Product::where('seller_id', auth()->id())->findOrFail($id);
            $product = $this->productService->updateStock($product, $request->stock);

            return $this->successResponse(
                new ProductResource($product),
                'Stok berhasil diupdate'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Produk tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal update stok: ' . $e->getMessage(), null, 500);
        }
    }
}
```

---

File terlalu panjang, akan saya lanjutkan di file berikutnya untuk Routes dan Admin Controllers.
