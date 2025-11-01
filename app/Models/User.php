<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'no_hp',
        'nik',
        'email',
        'password',
        'otp_code',
        'otp_expires_at',
        'is_verified',
        'verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'nik', // Hide encrypted NIK from JSON
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'nik' => 'encrypted', // Automatically encrypt/decrypt NIK
            'is_verified' => 'boolean',
            'otp_expires_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }

    /**
     * Get all aduan created by this user.
     */
    public function aduan(): HasMany
    {
        return $this->hasMany(Aduan::class);
    }

    /**
     * Get aduan count by status.
     */
    public function getAduanCountByStatus(string $status): int
    {
        return $this->aduan()->where('status', $status)->count();
    }

    /**
     * Get total aduan count.
     */
    public function getTotalAduanAttribute(): int
    {
        return $this->aduan()->count();
    }

    /**
     * Get active aduan (not completed/rejected).
     */
    public function getActiveAduanAttribute(): int
    {
        return $this->aduan()->whereIn('status', ['baru', 'diverifikasi', 'diproses'])->count();
    }

    /**
     * Get completed aduan.
     */
    public function getCompletedAduanAttribute(): int
    {
        return $this->aduan()->where('status', 'selesai')->count();
    }
}
