<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\StatisticsService;
use App\Services\RBACService;

class AdminDashboardController extends Controller
{
    protected $statisticsService;
    protected $rbacService;

    public function __construct(StatisticsService $statisticsService, RBACService $rbacService)
    {
        $this->statisticsService = $statisticsService;
        $this->rbacService = $rbacService;
    }

    /**
     * Get dashboard statistics (role-based).
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $stats = $this->statisticsService->getDashboardStats($user);

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get statistics for charts.
     */
    public function statistics(Request $request)
    {
        $user = $request->user();
        $days = $request->input('days', 30);

        $data = [
            'aduan_over_time' => $this->statisticsService->getAduanByStatusOverTime($user, $days),
            'aduan_by_kategori' => $this->statisticsService->getAduanByKategori($user),
            'aduan_by_priority' => $this->statisticsService->getAduanByPriority($user),
            'response_time' => $this->statisticsService->getResponseTimeStats($user),
            'recent_activities' => $this->statisticsService->getRecentActivities($user),
        ];

        // Add admin-specific data
        if ($user->hasAnyRole(['super_admin', 'admin_kota'])) {
            $data['aduan_by_organization'] = $this->statisticsService->getAduanByOrganization($user);
            $data['aduan_by_dinas'] = $this->statisticsService->getAduanByDinas($user);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
