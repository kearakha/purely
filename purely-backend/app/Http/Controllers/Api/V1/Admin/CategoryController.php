<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Routing\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        try {
            $categories = Category::withCount('products')->get();
            return $this->successResponse(
                CategoryResource::collection($categories),
                'Data kategori berhasil diambil'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        try {
            $category = Category::create($validated);
            return $this->successResponse(
                new CategoryResource($category),
                'Kategori berhasil ditambahkan',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal menambah kategori: ' . $e->getMessage(), null, 500);
        }
    }

    public function show(int $id)
    {
        try {
            $category = Category::withCount('products')->findOrFail($id);
            return $this->successResponse(
                new CategoryResource($category),
                'Detail kategori berhasil diambil'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Kategori tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        try {
            $category = Category::findOrFail($id);
            $category->update($validated);

            return $this->successResponse(
                new CategoryResource($category),
                'Kategori berhasil diupdate'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Kategori tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal update kategori: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $category = Category::findOrFail($id);

            if ($category->products()->count() > 0) {
                return $this->errorResponse(
                    'Kategori tidak dapat dihapus karena masih memiliki produk',
                    null,
                    400
                );
            }

            $category->delete();
            return $this->successResponse(null, 'Kategori berhasil dihapus');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Kategori tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal hapus kategori: ' . $e->getMessage(), null, 500);
        }
    }
}
