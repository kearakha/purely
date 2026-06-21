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
