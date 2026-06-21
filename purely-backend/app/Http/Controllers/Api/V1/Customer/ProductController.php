<?php

namespace App\Http\Controllers\Api\V1\Customer;

use Illuminate\Routing\Controller;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private ProductService $productService
    ) {}

    public function index(Request $request)
    {
        try {
            $products = $this->productService->getAllProducts($request->all());

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

    public function show(int $id)
    {
        try {
            $product = $this->productService->getProductById($id);
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
}
