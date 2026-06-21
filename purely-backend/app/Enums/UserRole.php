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
