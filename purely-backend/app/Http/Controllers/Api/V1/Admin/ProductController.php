<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Routing\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private ProductService $productService
    ) {}

    /**
     * Get all products (admin can see all)
     */
    public function index(Request $request)
    {
        try {
            $query = Product::with(['category', 'seller']);

            // Filter by category
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            // Filter by seller
            if ($request->has('seller_id')) {
                $query->where('seller_id', $request->seller_id);
            }

            // Search by name
            if ($request->has('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }

            // Filter by status
            if ($request->has('is_active')) {
                $query->where('is_active', $request->is_active);
            }

            $products = $query->latest()->paginate($request->per_page ?? 15);

            return $this->successResponseWithPagination(
                $products->setCollection(
                    ProductResource::collection($products->getCollection())->collection
                ),
                'Data produk berhasil diambil'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Get product detail by ID
     */
    public function show(int $id)
    {
        try {
            $product = Product::with(['category', 'seller'])->findOrFail($id);
            return $this->successResponse(
                new ProductResource($product),
                'Detail produk berhasil diambil'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Produk tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Delete product (admin only)
     */
    public function destroy(int $id)
    {
        try {
            $product = Product::findOrFail($id);
            $this->productService->deleteProduct($product);

            return $this->successResponse(null, 'Produk berhasil dihapus');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Produk tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal hapus produk: ' . $e->getMessage(), null, 500);
        }
    }
}
