<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine if user can view any users.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin_kota', 'kepala_dinas']);
    }

    /**
     * Determine if user can view specific user.
     */
    public function view(User $user, User $model): bool
    {
        // Super admin can view all
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Admin kota can view non-super-admin users
        if ($user->hasRole('admin_kota') && !$model->hasRole('super_admin')) {
            return true;
        }

        // Kepala dinas can view their staff
        if ($user->hasRole('kepala_dinas') && $model->dinas_id === $user->dinas_id) {
            return true;
        }

        // Can view own profile
        return $user->id === $model->id;
    }

    /**
     * Determine if user can create users.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin_kota']);
    }

    /**
     * Determine if user can update users.
     */
    public function update(User $user, User $model): bool
    {
        // Super admin can update all except other super admins
        if ($user->hasRole('super_admin')) {
            return !$model->hasRole('super_admin') || $user->id === $model->id;
        }

        // Admin kota can update non-admin users
        if ($user->hasRole('admin_kota') && !$model->hasAnyRole(['super_admin', 'admin_kota'])) {
            return true;
        }

        // Kepala dinas can update their staff
        if ($user->hasRole('kepala_dinas') && $model->dinas_id === $user->dinas_id && $model->hasRole('staf_dinas')) {
            return true;
        }

        // Can update own profile
        return $user->id === $model->id;
    }

    /**
     * Determine if user can delete users.
     */
    public function delete(User $user, User $model): bool
    {
        // Super admin can soft delete (deactivate) users
        if ($user->hasRole('super_admin') && !$model->hasRole('super_admin')) {
            return true;
        }

        return false;
    }

    /**
     * Determine if user can activate/deactivate users.
     */
    public function activate(User $user, User $model): bool
    {
        // Super admin can activate/deactivate all
        if ($user->hasRole('super_admin') && !$model->hasRole('super_admin')) {
            return true;
        }

        // Admin kota can activate/deactivate non-admin users
        if ($user->hasRole('admin_kota') && !$model->hasAnyRole(['super_admin', 'admin_kota'])) {
            return true;
        }

        return false;
    }
}
