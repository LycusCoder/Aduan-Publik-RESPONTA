<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DinasResource extends JsonResource
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
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('d M Y'),
            
            // Organization
            'organization' => $this->when($this->organization_id, [
                'id' => $this->organization?->id,
                'name' => $this->organization?->name,
                'type' => $this->organization?->type,
            ]),
            
            // Statistics
            'statistics' => [
                'total_staff' => $this->users()->count(),
                'total_aduan' => $this->aduan()->count(),
                'aduan_selesai' => $this->aduan()->where('status', 'selesai')->count(),
                'aduan_diproses' => $this->aduan()->where('status', 'diproses')->count(),
            ],
        ];
    }
}
