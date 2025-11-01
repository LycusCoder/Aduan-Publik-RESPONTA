<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class KategoriAduan extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'kategori_aduan';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama',
        'slug',
        'icon',
        'deskripsi',
        'dinas_terkait_id',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug from nama if not provided
        static::creating(function ($kategori) {
            if (empty($kategori->slug)) {
                $kategori->slug = Str::slug($kategori->nama);
            }
        });

        static::updating(function ($kategori) {
            if ($kategori->isDirty('nama') && empty($kategori->slug)) {
                $kategori->slug = Str::slug($kategori->nama);
            }
        });
    }

    /**
     * Get all aduan for this kategori.
     */
    public function aduan(): HasMany
    {
        return $this->hasMany(Aduan::class, 'kategori_aduan_id');
    }

    /**
     * Get active aduan count.
     */
    public function getActiveAduanCountAttribute(): int
    {
        return $this->aduan()->whereIn('status', ['baru', 'diverifikasi', 'diproses'])->count();
    }

    /**
     * Get completed aduan count.
     */
    public function getCompletedAduanCountAttribute(): int
    {
        return $this->aduan()->where('status', 'selesai')->count();
    }

    /**
     * Scope to get only active categories.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
