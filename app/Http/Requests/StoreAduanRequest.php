<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAduanRequest extends FormRequest
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
            'kategori_aduan_id' => 'required|exists:kategori_aduan,id',
            'deskripsi' => 'required|string|min:20|max:1000',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'alamat' => 'nullable|string|max:500',
            'fotos' => 'required|array|min:1|max:3',
            'fotos.*' => 'required|image|mimes:jpeg,jpg,png,webp|max:10240', // Max 10MB per photo
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'kategori_aduan_id.required' => 'Kategori aduan harus dipilih.',
            'kategori_aduan_id.exists' => 'Kategori aduan tidak valid.',
            'deskripsi.required' => 'Deskripsi aduan harus diisi.',
            'deskripsi.min' => 'Deskripsi minimal 20 karakter.',
            'deskripsi.max' => 'Deskripsi maksimal 1000 karakter.',
            'latitude.required' => 'Lokasi (latitude) harus diisi.',
            'latitude.between' => 'Latitude harus antara -90 dan 90.',
            'longitude.required' => 'Lokasi (longitude) harus diisi.',
            'longitude.between' => 'Longitude harus antara -180 dan 180.',
            'alamat.max' => 'Alamat maksimal 500 karakter.',
            'fotos.required' => 'Minimal 1 foto harus diupload.',
            'fotos.min' => 'Minimal 1 foto harus diupload.',
            'fotos.max' => 'Maksimal 3 foto yang dapat diupload.',
            'fotos.*.required' => 'File foto harus valid.',
            'fotos.*.image' => 'File harus berupa gambar.',
            'fotos.*.mimes' => 'Format foto harus: jpeg, jpg, png, atau webp.',
            'fotos.*.max' => 'Ukuran foto maksimal 10MB.',
        ];
    }
}
