<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('role', 'customer')->first();
        $products = Product::all();

        if (!$customer || $products->isEmpty()) {
            return;
        }

        // Create 5 sample orders
        for ($i = 0; $i < 5; $i++) {
            DB::transaction(function () use ($customer, $products, $i) {
                // Random status
                $statuses = OrderStatus::values();
                $status = $statuses[array_rand($statuses)];

                // Determine dates based on status
                $created_at = now()->subDays(rand(1, 30));
                $delivered_at = $status === OrderStatus::DELIVERED->value ? $created_at->copy()->addDays(2) : null;
                $canceled_at = $status === OrderStatus::CANCELED->value ? $created_at->copy()->addDays(1) : null;

                $order = Order::create([
                    'user_id' => $customer->id,
                    'status' => $status,
                    'payment_status' => PaymentStatus::PAID, // Assuming paid for simplicity
                    'payment_method' => 'bank_transfer',
                    'delivery_address' => $customer->address ?? 'Alamat Default',
                    'delivery_fee' => 10000,
                    'total_amount' => 0, // Will calculate below
                    'created_at' => $created_at,
                    'delivered_at' => $delivered_at,
                    'canceled_at' => $canceled_at,
                ]);

                // Add 1-3 random items
                $orderTotal = 0;
                $randomProducts = $products->random(rand(1, 3));

                foreach ($randomProducts as $product) {
                    $qty = rand(1, 5);
                    $subtotal = $product->price * $qty;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'seller_id' => $product->seller_id,
                        'quantity' => $qty,
                        'price' => $product->price,
                        'subtotal' => $subtotal,
                    ]);

                    $orderTotal += $subtotal;
                }

                // Update order total
                $order->update([
                    'total_amount' => $orderTotal + $order->delivery_fee
                ]);
            });
        }
    }
}
