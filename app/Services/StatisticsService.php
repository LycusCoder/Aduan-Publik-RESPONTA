<?php

namespace App\Services;

use App\Models\User;
use App\Models\Aduan;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatisticsService
{
    /**
     * Get dashboard statistics based on user role.
     */
    public function getDashboardStats(User $user): array
    {
        $rbacService = new RBACService();
        $query = $rbacService->getAccessibleAduanQuery($user);

        $stats = [
            'total_aduan' => $query->count(),
            'aduan_baru' => (clone $query)->where('status', 'baru')->count(),
            'aduan_diverifikasi' => (clone $query)->where('status', 'diverifikasi')->count(),
            'aduan_diproses' => (clone $query)->where('status', 'diproses')->count(),
            'aduan_selesai' => (clone $query)->where('status', 'selesai')->count(),
            'aduan_ditolak' => (clone $query)->where('status', 'ditolak')->count(),
        ];

        // Add role-specific stats
        if ($user->hasAnyRole(['super_admin', 'admin_kota'])) {
            $stats['total_users'] = User::count();
            $stats['active_users'] = User::where('is_active', true)->count();
            $stats['total_dinas'] = \App\Models\Dinas::count();
        }

        if ($user->hasRole('kepala_dinas') && $user->dinas_id) {
            $stats['staff_count'] = User::where('dinas_id', $user->dinas_id)
                ->where('role_id', '!=', $user->role_id)
                ->count();
            $stats['assigned_aduan'] = Aduan::where('dinas_id', $user->dinas_id)
                ->whereNotNull('assigned_to')
                ->count();
            $stats['unassigned_aduan'] = Aduan::where('dinas_id', $user->dinas_id)
                ->whereNull('assigned_to')
                ->count();
        }

        return $stats;
    }

    /**
     * Get aduan statistics by status over time.
     */
    public function getAduanByStatusOverTime(User $user, int $days = 30): array
    {
        $rbacService = new RBACService();
        $query = $rbacService->getAccessibleAduanQuery($user);

        $startDate = Carbon::now()->subDays($days);

        $data = $query->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                'status',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date', 'status')
            ->orderBy('date')
            ->get();

        return $data->toArray();
    }

    /**
     * Get aduan statistics by kategori.
     */
    public function getAduanByKategori(User $user): array
    {
        $rbacService = new RBACService();
        $query = $rbacService->getAccessibleAduanQuery($user);

        $data = $query->select(
                'kategori_aduan_id',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('kategori_aduan_id')
            ->with('kategoriAduan:id,nama')
            ->get();

        return $data->map(function($item) {
            return [
                'kategori' => $item->kategoriAduan?->nama ?? 'Unknown',
                'count' => $item->count,
            ];
        })->toArray();
    }

    /**
     * Get aduan statistics by priority.
     */
    public function getAduanByPriority(User $user): array
    {
        $rbacService = new RBACService();
        $query = $rbacService->getAccessibleAduanQuery($user);

        $data = $query->select(
                'priority',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('priority')
            ->get();

        return $data->map(function($item) {
            return [
                'priority' => $item->priority,
                'count' => $item->count,
            ];
        })->toArray();
    }

    /**
     * Get aduan statistics by organization (kecamatan/kelurahan).
     */
    public function getAduanByOrganization(User $user): array
    {
        // Only for admin kota and super admin
        if (!$user->hasAnyRole(['super_admin', 'admin_kota'])) {
            return [];
        }

        $data = Aduan::select(
                'organization_id',
                DB::raw('COUNT(*) as count')
            )
            ->whereNotNull('organization_id')
            ->groupBy('organization_id')
            ->with('organization:id,name,type')
            ->get();

        return $data->map(function($item) {
            return [
                'organization' => $item->organization?->name ?? 'Unknown',
                'type' => $item->organization?->type ?? 'unknown',
                'count' => $item->count,
            ];
        })->toArray();
    }

    /**
     * Get aduan statistics by dinas.
     */
    public function getAduanByDinas(User $user): array
    {
        // Only for admin kota and super admin
        if (!$user->hasAnyRole(['super_admin', 'admin_kota'])) {
            return [];
        }

        $data = Aduan::select(
                'dinas_id',
                DB::raw('COUNT(*) as count')
            )
            ->whereNotNull('dinas_id')
            ->groupBy('dinas_id')
            ->with('dinas:id,name')
            ->get();

        return $data->map(function($item) {
            return [
                'dinas' => $item->dinas?->name ?? 'Belum Ditugaskan',
                'count' => $item->count,
            ];
        })->toArray();
    }

    /**
     * Get average resolution time.
     */
    public function getAverageResolutionTime(User $user): ?float
    {
        $rbacService = new RBACService();
        $query = $rbacService->getAccessibleAduanQuery($user);

        $completedAduan = $query->where('status', 'selesai')
            ->whereNotNull('tanggal_selesai')
            ->get();

        if ($completedAduan->isEmpty()) {
            return null;
        }

        $totalHours = 0;
        foreach ($completedAduan as $aduan) {
            $created = Carbon::parse($aduan->created_at);
            $completed = Carbon::parse($aduan->tanggal_selesai);
            $totalHours += $created->diffInHours($completed);
        }

        return $totalHours / $completedAduan->count();
    }

    /**
     * Get response time statistics.
     */
    public function getResponseTimeStats(User $user): array
    {
        $rbacService = new RBACService();
        $query = $rbacService->getAccessibleAduanQuery($user);

        // Average time to verification
        $avgVerificationTime = $query->where('status', '!=', 'baru')
            ->whereNotNull('tanggal_verifikasi')
            ->get()
            ->map(function($aduan) {
                $created = Carbon::parse($aduan->created_at);
                $verified = Carbon::parse($aduan->tanggal_verifikasi);
                return $created->diffInHours($verified);
            })
            ->average();

        // Average time to start processing
        $avgProcessTime = $query->whereIn('status', ['diproses', 'selesai'])
            ->whereNotNull('tanggal_diproses')
            ->get()
            ->map(function($aduan) {
                $verified = Carbon::parse($aduan->tanggal_verifikasi ?? $aduan->created_at);
                $processed = Carbon::parse($aduan->tanggal_diproses);
                return $verified->diffInHours($processed);
            })
            ->average();

        return [
            'avg_verification_time_hours' => round($avgVerificationTime ?? 0, 2),
            'avg_process_start_time_hours' => round($avgProcessTime ?? 0, 2),
            'avg_resolution_time_hours' => round($this->getAverageResolutionTime($user) ?? 0, 2),
        ];
    }

    /**
     * Get recent activities (last 10).
     */
    public function getRecentActivities(User $user): array
    {
        $rbacService = new RBACService();
        $query = $rbacService->getAccessibleAduanQuery($user);

        $aduanIds = $query->pluck('id');

        $activities = \App\Models\AduanHistory::whereIn('aduan_id', $aduanIds)
            ->with(['user:id,name', 'aduan:id,nomor_tiket'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return $activities->map(function($activity) {
            return [
                'action' => $activity->action,
                'user' => $activity->user?->name ?? 'System',
                'nomor_tiket' => $activity->aduan?->nomor_tiket ?? 'N/A',
                'notes' => $activity->notes,
                'created_at' => $activity->created_at->format('d M Y H:i'),
            ];
        })->toArray();
    }
}
