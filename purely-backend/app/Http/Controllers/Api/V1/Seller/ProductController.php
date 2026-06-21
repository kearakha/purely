<?php

namespace App\Http\Controllers\Api\V1\Seller;

use Illuminate\Routing\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private ProductService $productService
    ) {}

    public function index(Request $request)
    {
        try {
            $products = Product::with(['category'])
                ->where('seller_id', Auth::user()->id)
                ->latest()
                ->paginate($request->per_page ?? 15);

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

    public function store(StoreProductRequest $request)
    {
        try {
            $product = $this->productService->createProduct(
                $request->validated(),
                Auth::user()->id
            );

            return $this->successResponse(
                new ProductResource($product),
                'Produk berhasil ditambahkan',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal menambah produk: ' . $e->getMessage(), null, 500);
        }
    }

    public function update(StoreProductRequest $request, int $id)
    {
        try {
            $product = Product::where('seller_id', Auth::user()->id)->findOrFail($id);
            $product = $this->productService->updateProduct($product, $request->validated());

            return $this->successResponse(
                new ProductResource($product),
                'Produk berhasil diupdate'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Produk tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal update produk: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $product = Product::where('seller_id', Auth::user()->id)->findOrFail($id);
            $this->productService->deleteProduct($product);

            return $this->successResponse(null, 'Produk berhasil dihapus');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Produk tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal hapus produk: ' . $e->getMessage(), null, 500);
        }
    }

    public function updateStock(Request $request, int $id)
    {
        $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        try {
            $product = Product::where('seller_id', Auth::user()->id)->findOrFail($id);
            $product = $this->productService->updateStock($product, $request->stock);

            return $this->successResponse(
                new ProductResource($product),
                'Stok berhasil diupdate'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Produk tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal update stok: ' . $e->getMessage(), null, 500);
        }
    }
}
