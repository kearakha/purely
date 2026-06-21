<?php

namespace App\Http\Controllers\Api\V1\Customer;

use Illuminate\Routing\Controller;
use App\Models\Address;
use App\Services\AddressService;
use App\Http\Resources\AddressResource;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private AddressService $addressService
    ) {}

    public function index()
    {
        try {
            $user = Auth::user();
            $addresses = $this->addressService->getUserAddresses($user);

            return $this->successResponse(
                AddressResource::collection($addresses),
                'Daftar alamat berhasil diambil'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipient_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'full_address' => 'required|string',
            'notes' => 'nullable|string',
            'label' => 'required|string|max:50',
            'is_primary' => 'boolean',
        ]);

        try {
            $user = Auth::user();
            $address = $this->addressService->createAddress($user, $validated);

            return $this->successResponse(
                new AddressResource($address),
                'Alamat berhasil ditambahkan',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    public function update(Request $request, Address $address)
    {
        // Simple ownership check before validating to fail fast if unauthorized
        if ($address->user_id !== Auth::id()) {
            return $this->unauthorizedResponse();
        }

        $validated = $request->validate([
            'recipient_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'full_address' => 'required|string',
            'notes' => 'nullable|string',
            'label' => 'required|string|max:50',
            'is_primary' => 'boolean',
        ]);

        try {
            $user = Auth::user();
            $updatedAddress = $this->addressService->updateAddress($user, $address, $validated);

            return $this->successResponse(
                new AddressResource($updatedAddress),
                'Alamat berhasil diperbarui'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    public function destroy(Address $address)
    {
        if ($address->user_id !== Auth::id()) {
            return $this->unauthorizedResponse();
        }

        try {
            $user = Auth::user();
            $this->addressService->deleteAddress($user, $address);

            return $this->successResponse(null, 'Alamat berhasil dihapus');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }
}
