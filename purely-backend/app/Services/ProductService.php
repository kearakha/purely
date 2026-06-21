<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function getAllProducts(array $filters = []): LengthAwarePaginator
    {
        $query = Product::with(['category', 'seller'])
            ->active();

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (isset($filters['in_stock']) && $filters['in_stock']) {
            $query->inStock();
        }

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    public function getProductById(int $id): Product
    {
        return Product::with(['category', 'seller'])
            ->findOrFail($id);
    }

    public function createProduct(array $data, int $sellerId): Product
    {
        $data['seller_id'] = $sellerId;

        if (isset($data['image'])) {
            $data['image'] = $this->uploadImage($data['image']);
        }

        return Product::create($data);
    }

    public function updateProduct(Product $product, array $data): Product
    {
        if (isset($data['image'])) {
            // Delete old image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $this->uploadImage($data['image']);
        }

        $product->update($data);
        return $product->fresh();
    }

    public function deleteProduct(Product $product): void
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
    }

    public function updateStock(Product $product, int $stock): Product
    {
        $product->update(['stock' => $stock]);
        return $product;
    }

    private function uploadImage($image): string
    {
        return $image->store('products', 'public');
    }
}
