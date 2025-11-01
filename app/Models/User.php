<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        'role_id',
        'organization_id',
        'dinas_id',
        'is_admin',
        'is_active',
        'last_login_at',
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
            'is_admin' => 'boolean',
            'is_active' => 'boolean',
            'otp_expires_at' => 'datetime',
            'verified_at' => 'datetime',
            'last_login_at' => 'datetime',
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
     * Get user's role.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get user's organization.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get user's dinas.
     */
    public function dinas(): BelongsTo
    {
        return $this->belongsTo(Dinas::class);
    }

    /**
     * Get aduan assigned to this user (for admin/teknisi).
     */
    public function assignedAduan(): HasMany
    {
        return $this->hasMany(Aduan::class, 'assigned_to');
    }

    /**
     * Get aduan verified by this user (for verifikator).
     */
    public function verifiedAduan(): HasMany
    {
        return $this->hasMany(Aduan::class, 'verifikator_id');
    }

    /**
     * Get history logs by this user.
     */
    public function aduanHistory(): HasMany
    {
        return $this->hasMany(AduanHistory::class);
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

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $roleName): bool
    {
        return $this->role && $this->role->name === $roleName;
    }

    /**
     * Check if user has any of the given roles.
     */
    public function hasAnyRole(array $roles): bool
    {
        return $this->role && in_array($this->role->name, $roles);
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission(string $permissionName): bool
    {
        return $this->role && $this->role->hasPermission($permissionName);
    }

    /**
     * Check if user has any of the given permissions.
     */
    public function hasAnyPermission(array $permissions): bool
    {
        return $this->role && $this->role->hasAnyPermission($permissions);
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }

    /**
     * Check if user is active.
     */
    public function isActive(): bool
    {
        return $this->is_active === true;
    }
}
