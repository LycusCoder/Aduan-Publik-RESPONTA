<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'no_hp' => [
                'required',
                'string',
                'regex:/^08[0-9]{8,11}$/',
            ],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'no_hp.required' => 'Nomor HP harus diisi.',
            'no_hp.regex' => 'Format nomor HP tidak valid.',
            'password.required' => 'Password harus diisi.',
        ];
    }
}
