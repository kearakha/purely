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
