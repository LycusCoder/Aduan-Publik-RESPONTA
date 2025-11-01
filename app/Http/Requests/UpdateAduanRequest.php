<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAduanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth('sanctum')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'kategori_aduan_id' => 'sometimes|exists:kategori_aduan,id',
            'deskripsi' => 'sometimes|string|min:20|max:1000',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
            'alamat' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'kategori_aduan_id.exists' => 'Kategori aduan tidak valid.',
            'deskripsi.min' => 'Deskripsi minimal 20 karakter.',
            'deskripsi.max' => 'Deskripsi maksimal 1000 karakter.',
            'latitude.between' => 'Latitude harus antara -90 dan 90.',
            'longitude.between' => 'Longitude harus antara -180 dan 180.',
            'alamat.max' => 'Alamat maksimal 500 karakter.',
        ];
    }
}
