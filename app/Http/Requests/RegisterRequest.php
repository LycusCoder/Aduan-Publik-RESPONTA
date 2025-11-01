<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'no_hp' => [
                'required',
                'string',
                'regex:/^08[0-9]{8,11}$/',
                'unique:users,no_hp',
            ],
            'nik' => [
                'required',
                'string',
                'regex:/^[0-9]{16}$/',
                'unique:users,nik',
            ],
            'email' => ['nullable', 'email', 'unique:users,email'],
            'password' => [
                'required',
                'string',
                Password::min(8)
                    ->letters()
                    ->numbers(),
                'confirmed',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama harus diisi.',
            'no_hp.required' => 'Nomor HP harus diisi.',
            'no_hp.regex' => 'Format nomor HP tidak valid. Harus dimulai dengan 08 dan 10-13 digit.',
            'no_hp.unique' => 'Nomor HP sudah terdaftar.',
            'nik.required' => 'NIK harus diisi.',
            'nik.regex' => 'NIK harus 16 digit.',
            'nik.unique' => 'NIK sudah terdaftar.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Password harus diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ];
    }
}
