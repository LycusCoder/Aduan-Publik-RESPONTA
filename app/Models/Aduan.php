<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Aduan extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'aduan';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nomor_tiket',
        'user_id',
        'kategori_aduan_id',
        'dinas_id',
        'assigned_to',
        'verifikator_id',
        'organization_id',
        'deskripsi',
        'latitude',
        'longitude',
        'alamat',
        'status',
        'priority',
        'progress',
        'tanggal_selesai',
        'tanggal_verifikasi',
        'tanggal_diproses',
        'catatan_admin',
        'catatan_penolakan',
        'catatan_verifikasi',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'progress' => 'integer',
            'tanggal_selesai' => 'datetime',
            'tanggal_verifikasi' => 'datetime',
            'tanggal_diproses' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate nomor_tiket before creating
        static::creating(function ($aduan) {
            if (empty($aduan->nomor_tiket)) {
                $aduan->nomor_tiket = self::generateNomorTiket();
            }
        });

        // Set tanggal_selesai when status changed to 'selesai'
        static::updating(function ($aduan) {
            if ($aduan->isDirty('status')) {
                if ($aduan->status === 'selesai' && empty($aduan->tanggal_selesai)) {
                    $aduan->tanggal_selesai = now();
                }
                if ($aduan->status === 'diverifikasi' && empty($aduan->tanggal_verifikasi)) {
                    $aduan->tanggal_verifikasi = now();
                }
                if ($aduan->status === 'diproses' && empty($aduan->tanggal_diproses)) {
                    $aduan->tanggal_diproses = now();
                }
            }
        });
    }

    /**
     * Generate unique nomor tiket.
     * Format: ADU-YYYYMMDD-XXX
     */
    public static function generateNomorTiket(): string
    {
        $date = now()->format('Ymd');
        $prefix = "ADU-{$date}-";

        // Get last ticket number for today
        $lastTicket = self::where('nomor_tiket', 'like', $prefix . '%')
            ->orderBy('nomor_tiket', 'desc')
            ->first();

        if ($lastTicket) {
            // Extract number and increment
            $lastNumber = (int) substr($lastTicket->nomor_tiket, -3);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Get the user that owns the aduan.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the kategori of the aduan.
     */
    public function kategoriAduan(): BelongsTo
    {
        return $this->belongsTo(KategoriAduan::class, 'kategori_aduan_id');
    }

    /**
     * Get all photos for the aduan.
     */
    public function fotos(): HasMany
    {
        return $this->hasMany(FotoAduan::class)->orderBy('urutan');
    }

    /**
     * Get the dinas assigned to handle this aduan.
     */
    public function dinas(): BelongsTo
    {
        return $this->belongsTo(Dinas::class);
    }

    /**
     * Get the user assigned to handle this aduan.
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the verifikator who verified this aduan.
     */
    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verifikator_id');
    }

    /**
     * Get the organization (kelurahan) of this aduan.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get all history logs for this aduan.
     */
    public function history(): HasMany
    {
        return $this->hasMany(AduanHistory::class)->orderBy('created_at', 'desc');
    }

    /**
     * Scope to filter by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by user.
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to find nearby aduan within radius (in km).
     */
    public function scopeNearby($query, float $latitude, float $longitude, float $radiusKm = 5)
    {
        return $query->selectRaw(
            "*, 
            ( 6371 * acos( cos( radians(?) ) * 
            cos( radians( latitude ) ) * 
            cos( radians( longitude ) - radians(?) ) + 
            sin( radians(?) ) * 
            sin( radians( latitude ) ) ) ) AS distance",
            [$latitude, $longitude, $latitude]
        )
        ->havingRaw('distance < ?', [$radiusKm])
        ->orderBy('distance');
    }

    /**
     * Get status badge color.
     */
    public function getStatusBadgeAttribute(): string
    {
        return match($this->status) {
            'baru' => 'blue',
            'diverifikasi' => 'yellow',
            'diproses' => 'orange',
            'selesai' => 'green',
            'ditolak' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get status label in Indonesian.
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'baru' => 'Baru',
            'diverifikasi' => 'Diverifikasi',
            'diproses' => 'Sedang Diproses',
            'selesai' => 'Selesai',
            'ditolak' => 'Ditolak',
            default => 'Unknown',
        };
    }
}
