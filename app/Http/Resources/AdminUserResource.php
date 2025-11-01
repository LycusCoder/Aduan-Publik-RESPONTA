<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminUserResource extends JsonResource
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
            'no_hp' => $this->no_hp,
            'email' => $this->email,
            'is_verified' => $this->is_verified,
            'is_admin' => $this->is_admin,
            'is_active' => $this->is_active,
            'last_login_at' => $this->last_login_at?->format('d M Y H:i'),
            'verified_at' => $this->verified_at?->format('d M Y H:i'),
            'created_at' => $this->created_at->format('d M Y H:i'),
            
            // Role information
            'role' => [
                'id' => $this->role?->id,
                'name' => $this->role?->name,
                'display_name' => $this->role?->display_name,
                'level' => $this->role?->level,
            ],
            
            // Organization information
            'organization' => $this->when($this->organization_id, [
                'id' => $this->organization?->id,
                'name' => $this->organization?->name,
                'type' => $this->organization?->type,
            ]),
            
            // Dinas information
            'dinas' => $this->when($this->dinas_id, [
                'id' => $this->dinas?->id,
                'name' => $this->dinas?->name,
                'code' => $this->dinas?->code,
            ]),
            
            // Statistics
            'statistics' => [
                'total_aduan' => $this->aduan()->count(),
                'active_aduan' => $this->aduan()->whereIn('status', ['baru', 'diverifikasi', 'diproses'])->count(),
                'completed_aduan' => $this->aduan()->where('status', 'selesai')->count(),
                'assigned_aduan' => $this->assignedAduan()->count(),
            ],
        ];
    }
}
