<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Routing\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    use ApiResponseTrait;

    /**
     * Get all users with pagination
     */
    public function index(Request $request)
    {
        try {
            $query = User::query();

            // Filter by role
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }

            // Search by name or email
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $users = $query->latest()->paginate($request->per_page ?? 15);

            return $this->successResponseWithPagination(
                $users->setCollection(
                    UserResource::collection($users->getCollection())->collection
                ),
                'Data user berhasil diambil'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Get user detail by ID
     */
    public function show(int $id)
    {
        try {
            $user = User::findOrFail($id);
            return $this->successResponse(
                new UserResource($user),
                'Detail user berhasil diambil'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('User tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil data: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Update user data
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'role' => 'sometimes|in:customer,seller,admin',
            'is_active' => 'sometimes|boolean',
        ]);

        try {
            $user = User::findOrFail($id);
            $user->update($validated);

            return $this->successResponse(
                new UserResource($user),
                'User berhasil diupdate'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('User tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal update user: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Delete user
     */
    public function destroy(int $id)
    {
        try {
            $user = User::findOrFail($id);

            // Prevent deleting self
            if ($user->id === Auth::id()) {
                return $this->errorResponse('Tidak dapat menghapus akun sendiri', null, 400);
            }

            $user->delete();

            return $this->successResponse(null, 'User berhasil dihapus');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('User tidak ditemukan');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal hapus user: ' . $e->getMessage(), null, 500);
        }
    }
}
