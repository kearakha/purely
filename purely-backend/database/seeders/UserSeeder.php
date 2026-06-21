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
