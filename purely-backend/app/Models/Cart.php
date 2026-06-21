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
