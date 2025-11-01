<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    protected $fillable = [
        'parent_id',
        'type',
        'name',
        'code',
        'address',
        'phone',
        'email',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Organization::class, 'parent_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function aduan(): HasMany
    {
        return $this->hasMany(Aduan::class);
    }

    public function dinas(): HasMany
    {
        return $this->hasMany(Dinas::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeKota($query)
    {
        return $query->where('type', 'kota');
    }

    public function scopeKecamatan($query)
    {
        return $query->where('type', 'kecamatan');
    }

    public function scopeKelurahan($query)
    {
        return $query->where('type', 'kelurahan');
    }

    // Helper Methods
    public function getFullHierarchy(): string
    {
        $hierarchy = [];
        $current = $this;
        
        while ($current) {
            array_unshift($hierarchy, $current->name);
            $current = $current->parent;
        }
        
        return implode(' > ', $hierarchy);
    }
}
