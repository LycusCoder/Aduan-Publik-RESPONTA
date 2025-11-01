<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dinas extends Model
{
    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'description',
        'phone',
        'email',
        'address',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function aduan(): HasMany
    {
        return $this->hasMany(Aduan::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCode($query, $code)
    {
        return $query->where('code', $code);
    }

    // Accessors
    public function getActiveAduanCountAttribute(): int
    {
        return $this->aduan()
            ->whereIn('status', ['baru', 'diverifikasi', 'diproses'])
            ->count();
    }

    public function getCompletedAduanCountAttribute(): int
    {
        return $this->aduan()
            ->where('status', 'selesai')
            ->count();
    }
}
