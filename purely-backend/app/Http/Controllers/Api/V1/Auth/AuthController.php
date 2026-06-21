<?php

namespace App\Http\Controllers\Api\V1\Auth;

use Illuminate\Routing\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private AuthService $authService
    ) {}

    public function register(RegisterRequest $request)
    {
        try {
            $user = $this->authService->register($request->validated());
            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->successResponse([
                'user' => new UserResource($user),
                'token' => $token,
            ], 'Registrasi berhasil', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Registrasi gagal: ' . $e->getMessage(), null, 500);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $result = $this->authService->login(
                $request->email,
                $request->password
            );

            return $this->successResponse([
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ], 'Login berhasil');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator);
        } catch (\Exception $e) {
            return $this->errorResponse('Login gagal: ' . $e->getMessage(), null, 500);
        }
    }

    public function logout()
    {
        try {
            $this->authService->logout(Auth::user());
            return $this->successResponse(null, 'Logout berhasil');
        } catch (\Exception $e) {
            return $this->errorResponse('Logout gagal: ' . $e->getMessage(), null, 500);
        }
    }

    public function me()
    {
        return $this->successResponse(
            new UserResource(Auth::user()),
            'Data user berhasil diambil'
        );
    }
}
