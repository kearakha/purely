<?php

namespace App\Services;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class AddressService
{
    /**
     * Get all addresses for a user
     */
    public function getUserAddresses(User $user): Collection
    {
        return $user->addresses()->orderBy('is_primary', 'desc')->get();
    }

    /**
     * Create a new address
     */
    public function createAddress(User $user, array $data): Address
    {
        return DB::transaction(function () use ($user, $data) {
            // If setting as primary, unset other primaries
            if (!empty($data['is_primary']) && $data['is_primary']) {
                $user->addresses()->update(['is_primary' => false]);
            }

            // If this is the first address, force it to be primary
            if ($user->addresses()->count() === 0) {
                $data['is_primary'] = true;
            }

            return $user->addresses()->create($data);
        });
    }

    /**
     * Update an existing address
     */
    public function updateAddress(User $user, Address $address, array $data): Address
    {
        return DB::transaction(function () use ($user, $address, $data) {
            // Check if user owns the address (redundant if controller checks, but good for safety)
            if ($address->user_id !== $user->id) {
                throw new \Exception('Unauthorized action.');
            }

            if (!empty($data['is_primary']) && $data['is_primary']) {
                $user->addresses()->where('id', '!=', $address->id)->update(['is_primary' => false]);
            }

            $address->update($data);

            return $address->refresh();
        });
    }

    /**
     * Delete an address
     */
    public function deleteAddress(User $user, Address $address): bool
    {
        return DB::transaction(function () use ($user, $address) {
            if ($address->user_id !== $user->id) {
                throw new \Exception('Unauthorized action.');
            }

            $wasPrimary = $address->is_primary;
            $address->delete();

            // If primary was deleted, set another one as primary if exists
            if ($wasPrimary) {
                $newPrimary = $user->addresses()->first();
                if ($newPrimary) {
                    $newPrimary->update(['is_primary' => true]);
                }
            }

            return true;
        });
    }
}
