<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends JsonResource
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
            'type' => $this->type,
            'code' => $this->code,
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('d M Y'),
            
            // Parent organization
            'parent' => $this->when($this->parent_id, [
                'id' => $this->parent?->id,
                'name' => $this->parent?->name,
                'type' => $this->parent?->type,
            ]),
            
            // Child organizations (when loaded)
            'children' => $this->when(
                $this->relationLoaded('children'),
                OrganizationResource::collection($this->children)
            ),
            
            // Statistics
            'statistics' => [
                'total_users' => $this->users()->count(),
                'total_aduan' => $this->aduan()->count(),
            ],
        ];
    }
}
