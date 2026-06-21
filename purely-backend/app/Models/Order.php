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
