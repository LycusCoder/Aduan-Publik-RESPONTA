<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminAduanResource extends JsonResource
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
            'deskripsi' => $this->deskripsi,
            'alamat' => $this->alamat,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'status_badge' => $this->status_badge,
            'priority' => $this->priority,
            'progress' => $this->progress,
            'created_at' => $this->created_at->format('d M Y H:i'),
            'tanggal_verifikasi' => $this->tanggal_verifikasi?->format('d M Y H:i'),
            'tanggal_diproses' => $this->tanggal_diproses?->format('d M Y H:i'),
            'tanggal_selesai' => $this->tanggal_selesai?->format('d M Y H:i'),
            
            // User information
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'no_hp' => $this->user?->no_hp,
            ],
            
            // Kategori
            'kategori' => [
                'id' => $this->kategoriAduan?->id,
                'nama' => $this->kategoriAduan?->nama,
                'slug' => $this->kategoriAduan?->slug,
            ],
            
            // Dinas (if assigned)
            'dinas' => $this->when($this->dinas_id, [
                'id' => $this->dinas?->id,
                'name' => $this->dinas?->name,
                'code' => $this->dinas?->code,
            ]),
            
            // Assigned staff (if assigned)
            'assigned_user' => $this->when($this->assigned_to, [
                'id' => $this->assignedUser?->id,
                'name' => $this->assignedUser?->name,
                'role' => $this->assignedUser?->role?->display_name,
            ]),
            
            // Verifikator (if verified)
            'verifikator' => $this->when($this->verifikator_id, [
                'id' => $this->verifikator?->id,
                'name' => $this->verifikator?->name,
            ]),
            
            // Organization (kelurahan)
            'organization' => $this->when($this->organization_id, [
                'id' => $this->organization?->id,
                'name' => $this->organization?->name,
                'type' => $this->organization?->type,
            ]),
            
            // Photos
            'photos' => $this->fotos->map(function($foto) {
                return [
                    'id' => $foto->id,
                    'url' => asset('storage/' . $foto->file_path),
                    'urutan' => $foto->urutan,
                ];
            }),
            
            // Notes
            'catatan_admin' => $this->catatan_admin,
            'catatan_verifikasi' => $this->catatan_verifikasi,
            'catatan_penolakan' => $this->catatan_penolakan,
            
            // Activity history (optional, load when needed)
            'history' => $this->when($this->relationLoaded('history'), 
                $this->history->map(function($item) {
                    return [
                        'action' => $item->action,
                        'user' => $item->user?->name,
                        'old_value' => $item->old_value,
                        'new_value' => $item->new_value,
                        'notes' => $item->notes,
                        'created_at' => $item->created_at->format('d M Y H:i'),
                    ];
                })
            ),
        ];
    }
}
