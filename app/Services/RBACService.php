<?php

namespace App\Services;

use App\Models\User;

class RBACService
{
    /**
     * Check if user has permission to perform action.
     */
    public function hasPermission(User $user, string $permission): bool
    {
        // Super admin has all permissions
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return $user->hasPermission($permission);
    }

    /**
     * Check if user has any of the given permissions.
     */
    public function hasAnyPermission(User $user, array $permissions): bool
    {
        // Super admin has all permissions
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return $user->hasAnyPermission($permissions);
    }

    /**
     * Get user's accessible aduan query based on role.
     */
    public function getAccessibleAduanQuery(User $user)
    {
        $query = \App\Models\Aduan::query();

        // Super admin and admin kota can see all
        if ($user->hasAnyRole(['super_admin', 'admin_kota'])) {
            return $query;
        }

        // Verifikator can see all new aduan
        if ($user->hasRole('verifikator')) {
            return $query->where('status', 'baru');
        }

        // Kepala dinas can see aduan from their dinas
        if ($user->hasRole('kepala_dinas')) {
            return $query->where('dinas_id', $user->dinas_id);
        }

        // Staf dinas can see aduan assigned to them
        if ($user->hasRole('staf_dinas')) {
            return $query->where('assigned_to', $user->id);
        }

        // Teknisi can see aduan assigned to them
        if ($user->hasRole('teknisi_lapangan')) {
            return $query->where('assigned_to', $user->id);
        }

        // Camat can see aduan in their kecamatan
        if ($user->hasRole('camat') && $user->organization_id) {
            // Get all kelurahan under this kecamatan
            $kelurahanIds = \App\Models\Organization::where('parent_id', $user->organization_id)->pluck('id');
            return $query->whereIn('organization_id', $kelurahanIds);
        }

        // Lurah can see aduan in their kelurahan
        if ($user->hasRole('lurah')) {
            return $query->where('organization_id', $user->organization_id);
        }

        // Staf kecamatan can see aduan in their kecamatan
        if ($user->hasRole('staf_kecamatan') && $user->organization_id) {
            $kelurahanIds = \App\Models\Organization::where('parent_id', $user->organization_id)->pluck('id');
            return $query->whereIn('organization_id', $kelurahanIds);
        }

        // Staf kelurahan can see aduan in their kelurahan
        if ($user->hasRole('staf_kelurahan')) {
            return $query->where('organization_id', $user->organization_id);
        }

        // Warga can only see their own
        return $query->where('user_id', $user->id);
    }

    /**
     * Get allowed status transitions based on user role.
     */
    public function getAllowedStatusTransitions(User $user, string $currentStatus): array
    {
        // Super admin can transition to any status
        if ($user->hasRole('super_admin')) {
            return ['baru', 'diverifikasi', 'diproses', 'selesai', 'ditolak'];
        }

        // Admin kota can transition to any status
        if ($user->hasRole('admin_kota')) {
            return ['baru', 'diverifikasi', 'diproses', 'selesai', 'ditolak'];
        }

        // Verifikator can verify or reject new aduan
        if ($user->hasRole('verifikator')) {
            if ($currentStatus === 'baru') {
                return ['diverifikasi', 'ditolak'];
            }
        }

        // Kepala dinas can move verified aduan to processing or completion
        if ($user->hasRole('kepala_dinas')) {
            if ($currentStatus === 'diverifikasi') {
                return ['diproses'];
            }
            if ($currentStatus === 'diproses') {
                return ['selesai'];
            }
        }

        // Staf dinas and teknisi can only mark as completed
        if ($user->hasAnyRole(['staf_dinas', 'teknisi_lapangan'])) {
            if ($currentStatus === 'diproses') {
                return ['selesai'];
            }
        }

        return [];
    }

    /**
     * Check if user can assign aduan to specific dinas.
     */
    public function canAssignToDinas(User $user, int $dinasId): bool
    {
        // Super admin and admin kota can assign to any dinas
        if ($user->hasAnyRole(['super_admin', 'admin_kota'])) {
            return true;
        }

        return false;
    }

    /**
     * Check if user can assign aduan to specific staff.
     */
    public function canAssignToStaff(User $user, int $staffId): bool
    {
        // Super admin and admin kota can assign to anyone
        if ($user->hasAnyRole(['super_admin', 'admin_kota'])) {
            return true;
        }

        // Kepala dinas can assign to their dinas staff
        if ($user->hasRole('kepala_dinas')) {
            $staff = User::find($staffId);
            return $staff && $staff->dinas_id === $user->dinas_id;
        }

        return false;
    }
}
