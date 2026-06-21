<?php

namespace App\Http\Controllers\Api\V1\Customer;

use Illuminate\Routing\Controller;
use App\Http\Requests\Order\CreateOrderRequest;
use App\Http\Resources\OrderResource;
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
            $orders = $this->orderService->getUserOrders(Auth::user(), $request->all());

            return $this->successResponseWithPagination(
                $orders->map(fn($order) => new OrderResource($order)),
                'Data order berhasil diambil'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    public function store(CreateOrderRequest $request)
    {
        try {
            $order = $this->orderService->createOrder(
                Auth::user(),
                $request->validated()
            );

            return $this->successResponse(
                new OrderResource($order),
                'Order berhasil dibuat',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
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

    public function cancel(Request $request, int $id)
    {
        $request->validate([
            'reason' => 'nullable|string',
        ]);

        try {
            $order = $this->orderService->getOrderById($id, Auth::user());
            $order = $this->orderService->cancelOrder($order, $request->reason);

            return $this->successResponse(
                new OrderResource($order),
                'Order berhasil dibatalkan'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }
}
