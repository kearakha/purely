<?php

use App\Http\Controllers\Api\V1\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\V1\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Customer\CartController;
use App\Http\Controllers\Api\V1\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Api\V1\Customer\ProductController as CustomerProductController;
use App\Http\Controllers\Api\V1\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Api\V1\Seller\ProductController as SellerProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Version 1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Public Routes
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
    });

    // Public Product Routes
    Route::get('products', [CustomerProductController::class, 'index']);
    Route::get('products/{id}', [CustomerProductController::class, 'show']);
    Route::get('categories', [AdminCategoryController::class, 'index']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {

        // Auth Routes
        Route::prefix('auth')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
            Route::put('profile', [AuthController::class, 'updateProfile']);
        });

        // Addresses
        Route::apiResource('addresses', \App\Http\Controllers\Api\V1\Customer\AddressController::class);

        // Customer Routes
        Route::middleware('role:customer')->prefix('cart')->group(function () {
            Route::get('/', [CartController::class, 'index']);
            Route::post('items', [CartController::class, 'addItem']);
            Route::put('items/{id}', [CartController::class, 'updateItem']);
            Route::delete('items/{id}', [CartController::class, 'removeItem']);
            Route::delete('clear', [CartController::class, 'clear']);
        });

        Route::middleware('role:customer')->prefix('orders')->group(function () {
            Route::get('/', [CustomerOrderController::class, 'index']);
            Route::post('/', [CustomerOrderController::class, 'store']);
            Route::get('{id}', [CustomerOrderController::class, 'show']);
            Route::put('{id}/cancel', [CustomerOrderController::class, 'cancel']);
        });

        // Seller Routes
        Route::middleware('role:seller')->prefix('seller')->group(function () {
            Route::apiResource('products', SellerProductController::class);
            Route::put('products/{id}/stock', [SellerProductController::class, 'updateStock']);

            Route::get('orders', [SellerOrderController::class, 'index']);
            Route::get('orders/{id}', [SellerOrderController::class, 'show']);
            Route::put('orders/{id}/status', [SellerOrderController::class, 'updateStatus']);
        });

        // Admin Routes
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            // Users
            // Users
            Route::get('users', [AdminUserController::class, 'index']);
            Route::delete('users/{id}', [AdminUserController::class, 'destroy']);

            // Categories
            Route::apiResource('categories',AdminCategoryController::class);

            // Products
            Route::get('products', [AdminProductController::class, 'index']);
            Route::get('products/{id}', [AdminProductController::class, 'show']);
            Route::delete('products/{id}', [AdminProductController::class, 'destroy']);

            // Orders
            Route::get('orders', [AdminOrderController::class, 'index']);
            Route::get('orders/{id}', [AdminOrderController::class, 'show']);
            Route::put('orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
        });
    });
});
