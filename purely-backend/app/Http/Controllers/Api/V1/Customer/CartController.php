<?php

namespace App\Http\Controllers\Api\V1\Customer;

use Illuminate\Routing\Controller;
use App\Http\Resources\CartResource;
use App\Services\CartService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private CartService $cartService
    ) {}

    public function index()
    {
        try {
            $cart = $this->cartService->getCart(Auth::user());
            return $this->successResponse(
                new CartResource($cart),
                'Keranjang berhasil diambil'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            $cart = $this->cartService->addItem(
                Auth::user(),
                $request->product_id,
                $request->quantity
            );

            return $this->successResponse(
                new CartResource($cart),
                'Produk berhasil ditambahkan ke keranjang'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    public function updateItem(Request $request, int $cartItemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            $cart = $this->cartService->updateItemQuantity(
                Auth::user(),
                $cartItemId,
                $request->quantity
            );

            return $this->successResponse(
                new CartResource($cart),
                'Jumlah produk berhasil diupdate'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    public function removeItem(int $cartItemId)
    {
        try {
            $cart = $this->cartService->removeItem(Auth::user(), $cartItemId);
            return $this->successResponse(
                new CartResource($cart),
                'Produk berhasil dihapus dari keranjang'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    public function clear()
    {
        try {
            $this->cartService->clearCart(Auth::user());
            return $this->successResponse(null, 'Keranjang berhasil dikosongkan');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 500);
        }
    }
}
