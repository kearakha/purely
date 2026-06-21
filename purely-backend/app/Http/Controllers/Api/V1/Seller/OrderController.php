<?php

namespace App\Http\Controllers\Api\V1\Seller;

use Illuminate\Routing\Controller;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private OrderService $orderService
    ) {}

    /**
     * Get all orders for the authenticated seller
     */
    public function index(Request $request)
    {
        try {
            $orders = $this->orderService->getSellerOrders(
                Auth::id(),
                $request->all()
            );

            return $this->successResponseWithPagination(
                $orders->setCollection(
                    OrderResource::collection($orders->getCollection())->collection
                ),
                'Data order berhasil diambil'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Get order detail
     */
    public function show(int $id)
    {
        try {
            $order = Order::with(['items.product', 'user'])
                ->whereHas('items', function ($q) {
                    $q->where('seller_id', Auth::id());
                })
                ->findOrFail($id);

            return $this->successResponse(
                new OrderResource($order),
                'Detail order berhasil diambil'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,paid,packed,shipped,delivered,canceled',
        ]);

        try {
            $order = Order::whereHas('items', function ($q) {
                $q->where('seller_id', Auth::id());
            })->findOrFail($id);

            $order = $this->orderService->updateOrderStatus($order, $request->status);

            return $this->successResponse(
                new OrderResource($order),
                'Status order berhasil diupdate'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }
}
