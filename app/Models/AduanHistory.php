<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AduanHistory extends Model
{
    public $timestamps = false; // Only created_at

    protected $table = 'aduan_history';

    protected $fillable = [
        'aduan_id',
        'user_id',
        'action',
        'old_value',
        'new_value',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    // Relationships
    public function aduan(): BelongsTo
    {
        return $this->belongsTo(Aduan::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeByAction($query, $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByAduan($query, $aduanId)
    {
        return $query->where('aduan_id', $aduanId);
    }

    public function scopeRecent($query, $limit = 10)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }

    // Helper Method
    public static function log($aduanId, $userId, $action, $oldValue = null, $newValue = null, $notes = null)
    {
        return self::create([
            'aduan_id' => $aduanId,
            'user_id' => $userId,
            'action' => $action,
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'notes' => $notes,
        ]);
    }
}
