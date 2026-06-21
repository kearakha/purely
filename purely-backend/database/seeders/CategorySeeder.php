<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Sayuran', 'description' => 'Sayuran segar setiap hari', 'icon' => '🥬'],
            ['name' => 'Buah-buahan', 'description' => 'Buah segar dan manis', 'icon' => '🍎'],
            ['name' => 'Daging & Ikan', 'description' => 'Protein hewani berkualitas', 'icon' => '🥩'],
            ['name' => 'Telur & Susu', 'description' => 'Produk susu dan telur', 'icon' => '🥚'],
            ['name' => 'Bumbu Dapur', 'description' => 'Bumbu dan rempah', 'icon' => '🧄'],
            ['name' => 'Minuman', 'description' => 'Minuman segar', 'icon' => '🥤'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
