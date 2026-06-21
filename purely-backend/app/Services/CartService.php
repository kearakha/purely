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
