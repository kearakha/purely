<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Routing\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private OrderService $orderService
    ) {}

    public function index(Request $request)
    {
        try {
            $orders = $this->orderService->getAllOrders($request->all());

            return $this->successResponseWithPagination(
                $orders,
                'Data order berhasil diambil',
                OrderResource::collection($orders->getCollection())
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }
    public function show(int $id)
    {
        try {
            $order = $this->orderService->getOrderById($id, Auth::user());
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

    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,paid,packed,shipped,delivered,canceled',
        ]);
        try {
            $order = Order::findOrFail($id);
            $order = $this->orderService->updateOrderStatus($order, $request->status);

            return $this->successResponse(
                new OrderResource($order),
                'Status order berhasil diupdate'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }
}
