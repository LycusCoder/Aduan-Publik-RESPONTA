<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AduanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nomor_tiket' => $this->nomor_tiket,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'no_hp' => $this->user->no_hp,
            ],
            'kategori' => new KategoriAduanResource($this->whenLoaded('kategoriAduan')),
            'deskripsi' => $this->deskripsi,
            'lokasi' => [
                'latitude' => (float) $this->latitude,
                'longitude' => (float) $this->longitude,
                'alamat' => $this->alamat,
            ],
            'status' => $this->status,
            'status_label' => $this->status_label,
            'status_badge' => $this->status_badge,
            'catatan_admin' => $this->catatan_admin,
            'fotos' => FotoAduanResource::collection($this->whenLoaded('fotos')),
            'tanggal_selesai' => $this->tanggal_selesai?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
