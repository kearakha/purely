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
