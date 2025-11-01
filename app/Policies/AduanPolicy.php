<?php

namespace App\Policies;

use App\Models\Aduan;
use App\Models\User;

class AduanPolicy
{
    /**
     * Determine if the user can view the aduan.
     */
    public function view(User $user, Aduan $aduan): bool
    {
        return $user->id === $aduan->user_id;
    }

    /**
     * Determine if the user can update the aduan.
     * Only allow update if status is still 'baru'.
     */
    public function update(User $user, Aduan $aduan): bool
    {
        return $user->id === $aduan->user_id && $aduan->status === 'baru';
    }

    /**
     * Determine if the user can delete the aduan.
     * Only allow delete if status is still 'baru'.
     */
    public function delete(User $user, Aduan $aduan): bool
    {
        return $user->id === $aduan->user_id && $aduan->status === 'baru';
    }
}
