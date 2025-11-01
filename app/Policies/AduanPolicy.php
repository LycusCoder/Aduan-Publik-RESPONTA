<?php

namespace App\Policies;

use App\Models\Aduan;
use App\Models\User;

class AduanPolicy
{
    /**
     * Determine if user can view any aduan.
     */
    public function viewAny(User $user): bool
    {
        // Super admin dan admin kota bisa view all
        if ($user->hasAnyRole(['super_admin', 'admin_kota'])) {
            return true;
        }

        // Verifikator bisa view all new aduan
        if ($user->hasRole('verifikator')) {
            return true;
        }

        // Others can only view their own
        return false;
    }

    /**
     * Determine if user can view specific aduan.
     */
    public function view(User $user, Aduan $aduan): bool
    {
        // Super admin dan admin kota bisa view all
        if ($user->hasAnyRole(['super_admin', 'admin_kota'])) {
            return true;
        }

        // Owner can view their own
        if ($aduan->user_id === $user->id) {
            return true;
        }

        // Verifikator can view all
        if ($user->hasRole('verifikator')) {
            return true;
        }

        // Kepala dinas can view aduan assigned to their dinas
        if ($user->hasRole('kepala_dinas') && $aduan->dinas_id === $user->dinas_id) {
            return true;
        }

        // Staf dinas can view aduan assigned to them
        if ($user->hasRole('staf_dinas') && $aduan->assigned_to === $user->id) {
            return true;
        }

        // Teknisi can view aduan assigned to them
        if ($user->hasRole('teknisi_lapangan') && $aduan->assigned_to === $user->id) {
            return true;
        }

        // Camat can view aduan in their kecamatan
        if ($user->hasRole('camat') && $user->organization_id) {
            // Check if aduan's kelurahan is under this kecamatan
            if ($aduan->organization && $aduan->organization->parent_id === $user->organization_id) {
                return true;
            }
        }

        // Lurah can view aduan in their kelurahan
        if ($user->hasRole('lurah') && $aduan->organization_id === $user->organization_id) {
            return true;
        }

        // Staf kecamatan can view aduan in their kecamatan
        if ($user->hasRole('staf_kecamatan') && $user->organization_id) {
            if ($aduan->organization && $aduan->organization->parent_id === $user->organization_id) {
                return true;
            }
        }

        // Staf kelurahan can view aduan in their kelurahan
        if ($user->hasRole('staf_kelurahan') && $aduan->organization_id === $user->organization_id) {
            return true;
        }

        return false;
    }

    /**
     * Determine if user can create aduan.
     */
    public function create(User $user): bool
    {
        // All active users can create aduan
        return $user->isActive();
    }

    /**
     * Determine if user can update aduan.
     */
    public function update(User $user, Aduan $aduan): bool
    {
        // Only owner can update and only if status is 'baru'
        return $aduan->user_id === $user->id && $aduan->status === 'baru';
    }

    /**
     * Determine if user can delete aduan.
     */
    public function delete(User $user, Aduan $aduan): bool
    {
        // Only owner can delete and only if status is 'baru'
        return $aduan->user_id === $user->id && $aduan->status === 'baru';
    }

    /**
     * Determine if user can verify aduan.
     */
    public function verify(User $user, Aduan $aduan): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin_kota', 'verifikator']) && $aduan->status === 'baru';
    }

    /**
     * Determine if user can reject aduan.
     */
    public function reject(User $user, Aduan $aduan): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin_kota', 'verifikator']) && $aduan->status === 'baru';
    }

    /**
     * Determine if user can assign aduan to dinas.
     */
    public function assignToDinas(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin_kota']);
    }

    /**
     * Determine if user can assign aduan to staff.
     */
    public function assignToStaff(User $user, Aduan $aduan): bool
    {
        // Super admin and admin kota can assign to anyone
        if ($user->hasAnyRole(['super_admin', 'admin_kota'])) {
            return true;
        }

        // Kepala dinas can assign aduan from their dinas
        if ($user->hasRole('kepala_dinas') && $aduan->dinas_id === $user->dinas_id) {
            return true;
        }

        return false;
    }

    /**
     * Determine if user can update aduan status.
     */
    public function updateStatus(User $user, Aduan $aduan): bool
    {
        // Super admin and admin kota can update any status
        if ($user->hasAnyRole(['super_admin', 'admin_kota'])) {
            return true;
        }

        // Kepala dinas can update status of aduan assigned to their dinas
        if ($user->hasRole('kepala_dinas') && $aduan->dinas_id === $user->dinas_id) {
            return true;
        }

        return false;
    }

    /**
     * Determine if user can update progress.
     */
    public function updateProgress(User $user, Aduan $aduan): bool
    {
        // Assigned staff can update progress
        if ($aduan->assigned_to === $user->id) {
            return true;
        }

        // Kepala dinas can update progress of their dinas aduan
        if ($user->hasRole('kepala_dinas') && $aduan->dinas_id === $user->dinas_id) {
            return true;
        }

        // Super admin and admin kota can update any progress
        if ($user->hasAnyRole(['super_admin', 'admin_kota'])) {
            return true;
        }

        return false;
    }

    /**
     * Determine if user can set priority.
     */
    public function setPriority(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin_kota', 'camat', 'lurah']);
    }

    /**
     * Determine if user can add notes.
     */
    public function addNotes(User $user, Aduan $aduan): bool
    {
        // Admin roles can add notes
        if ($user->hasAnyRole(['super_admin', 'admin_kota', 'kepala_dinas', 'staf_dinas', 'camat', 'staf_kecamatan', 'lurah', 'staf_kelurahan', 'verifikator', 'teknisi_lapangan'])) {
            // Check if they have access to view the aduan first
            return $this->view($user, $aduan);
        }

        return false;
    }
}
