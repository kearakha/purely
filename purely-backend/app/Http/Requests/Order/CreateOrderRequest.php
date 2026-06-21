<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'delivery_address' => ['required', 'string'],
            'delivery_notes' => ['nullable', 'string'],
            'payment_method' => ['required', 'string', 'in:cod,transfer,ewallet'],
        ];
    }

    public function messages(): array
    {
        return [
            'delivery_address.required' => 'Alamat pengiriman harus diisi',
            'payment_method.required' => 'Metode pembayaran harus dipilih',
            'payment_method.in' => 'Metode pembayaran tidak valid',
        ];
    }
}
