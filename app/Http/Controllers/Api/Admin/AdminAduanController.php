<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Aduan;
use App\Services\RBACService;
use App\Services\AduanAssignmentService;
use App\Http\Resources\AdminAduanResource;
use Illuminate\Support\Facades\Gate;

class AdminAduanController extends Controller
{
    protected $rbacService;
    protected $assignmentService;

    public function __construct(RBACService $rbacService, AduanAssignmentService $assignmentService)
    {
        $this->rbacService = $rbacService;
        $this->assignmentService = $assignmentService;
    }

    /**
     * Get list of aduan (with filters & role-based access).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get accessible aduan query based on role
        $query = $this->rbacService->getAccessibleAduanQuery($user);

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('kategori_id')) {
            $query->where('kategori_aduan_id', $request->kategori_id);
        }

        if ($request->has('dinas_id')) {
            $query->where('dinas_id', $request->dinas_id);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('organization_id')) {
            $query->where('organization_id', $request->organization_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nomor_tiket', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%")
                  ->orWhere('alamat', 'like', "%{$search}%");
            });
        }

        // Date range filter
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Sort
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 15);
        $aduan = $query->with([
            'user', 
            'kategoriAduan', 
            'dinas', 
            'assignedUser', 
            'verifikator', 
            'organization'
        ])->paginate($perPage);

        return AdminAduanResource::collection($aduan);
    }

    /**
     * Get aduan detail.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $aduan = Aduan::with([
            'user', 
            'kategoriAduan', 
            'fotos', 
            'dinas', 
            'assignedUser.role', 
            'verifikator', 
            'organization',
            'history.user'
        ])->findOrFail($id);

        // Check access
        if (Gate::denies('view', $aduan)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk melihat aduan ini.'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => new AdminAduanResource($aduan)
        ]);
    }

    /**
     * Verify aduan.
     */
    public function verify(Request $request, $id)
    {
        $user = $request->user();
        $aduan = Aduan::findOrFail($id);

        // Check permission
        if (Gate::denies('verify', $aduan)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk memverifikasi aduan ini.'
            ], 403);
        }

        $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $result = $this->assignmentService->verifyAduan(
            $aduan, 
            $user, 
            $request->notes
        );

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Aduan berhasil diverifikasi.',
                'data' => new AdminAduanResource($aduan->fresh())
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal memverifikasi aduan.'
        ], 500);
    }

    /**
     * Reject aduan.
     */
    public function reject(Request $request, $id)
    {
        $user = $request->user();
        $aduan = Aduan::findOrFail($id);

        // Check permission
        if (Gate::denies('reject', $aduan)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk menolak aduan ini.'
            ], 403);
        }

        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $result = $this->assignmentService->rejectAduan(
            $aduan, 
            $user, 
            $request->reason
        );

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Aduan berhasil ditolak.',
                'data' => new AdminAduanResource($aduan->fresh())
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal menolak aduan.'
        ], 500);
    }

    /**
     * Assign aduan to dinas or staff.
     */
    public function assign(Request $request, $id)
    {
        $user = $request->user();
        $aduan = Aduan::findOrFail($id);

        $request->validate([
            'type' => 'required|in:dinas,staff',
            'dinas_id' => 'required_if:type,dinas|exists:dinas,id',
            'staff_id' => 'required_if:type,staff|exists:users,id',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($request->type === 'dinas') {
            // Check permission
            if (Gate::denies('assignToDinas', $aduan)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses untuk menugaskan ke dinas.'
                ], 403);
            }

            $result = $this->assignmentService->assignToDinas(
                $aduan,
                $request->dinas_id,
                $user,
                $request->notes
            );

            $message = 'Aduan berhasil ditugaskan ke dinas.';
        } else {
            // Check permission
            if (Gate::denies('assignToStaff', $aduan)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses untuk menugaskan ke staff.'
                ], 403);
            }

            $result = $this->assignmentService->assignToStaff(
                $aduan,
                $request->staff_id,
                $user,
                $request->notes
            );

            $message = 'Aduan berhasil ditugaskan ke staff.';
        }

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => new AdminAduanResource($aduan->fresh())
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal menugaskan aduan.'
        ], 500);
    }

    /**
     * Update aduan status.
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        $aduan = Aduan::findOrFail($id);

        // Check permission
        if (Gate::denies('updateStatus', $aduan)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengubah status aduan ini.'
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:baru,diverifikasi,diproses,selesai,ditolak',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Check if status transition is allowed
        $allowedTransitions = $this->rbacService->getAllowedStatusTransitions($user, $aduan->status);
        if (!in_array($request->status, $allowedTransitions)) {
            return response()->json([
                'success' => false,
                'message' => 'Transisi status tidak diperbolehkan.'
            ], 422);
        }

        $result = $this->assignmentService->updateStatus(
            $aduan,
            $request->status,
            $user,
            $request->notes
        );

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Status aduan berhasil diupdate.',
                'data' => new AdminAduanResource($aduan->fresh())
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal mengupdate status aduan.'
        ], 500);
    }

    /**
     * Set aduan priority.
     */
    public function setPriority(Request $request, $id)
    {
        $user = $request->user();
        $aduan = Aduan::findOrFail($id);

        // Check permission
        if (Gate::denies('setPriority', $aduan)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengatur prioritas aduan.'
            ], 403);
        }

        $request->validate([
            'priority' => 'required|in:low,medium,high,urgent',
            'notes' => 'nullable|string|max:500',
        ]);

        $result = $this->assignmentService->setPriority(
            $aduan,
            $request->priority,
            $user,
            $request->notes
        );

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Prioritas aduan berhasil diatur.',
                'data' => new AdminAduanResource($aduan->fresh())
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal mengatur prioritas aduan.'
        ], 500);
    }

    /**
     * Update aduan progress.
     */
    public function updateProgress(Request $request, $id)
    {
        $user = $request->user();
        $aduan = Aduan::findOrFail($id);

        // Check permission
        if (Gate::denies('updateProgress', $aduan)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengupdate progress aduan ini.'
            ], 403);
        }

        $request->validate([
            'progress' => 'required|integer|min:0|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        $result = $this->assignmentService->updateProgress(
            $aduan,
            $request->progress,
            $user,
            $request->notes
        );

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Progress aduan berhasil diupdate.',
                'data' => new AdminAduanResource($aduan->fresh())
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal mengupdate progress aduan.'
        ], 500);
    }

    /**
     * Add admin notes to aduan.
     */
    public function addNotes(Request $request, $id)
    {
        $user = $request->user();
        $aduan = Aduan::findOrFail($id);

        // Check permission
        if (Gate::denies('addNotes', $aduan)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk menambah catatan.'
            ], 403);
        }

        $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        $result = $this->assignmentService->addNotes(
            $aduan,
            $user,
            $request->notes
        );

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Catatan berhasil ditambahkan.'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal menambahkan catatan.'
        ], 500);
    }

    /**
     * Get aduan history.
     */
    public function history(Request $request, $id)
    {
        $user = $request->user();
        $aduan = Aduan::findOrFail($id);

        // Check access
        if (Gate::denies('view', $aduan)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk melihat history aduan ini.'
            ], 403);
        }

        $history = $aduan->history()->with('user')->get();

        return response()->json([
            'success' => true,
            'data' => $history->map(function($item) {
                return [
                    'id' => $item->id,
                    'action' => $item->action,
                    'user' => $item->user?->name ?? 'System',
                    'old_value' => $item->old_value,
                    'new_value' => $item->new_value,
                    'notes' => $item->notes,
                    'created_at' => $item->created_at->format('d M Y H:i'),
                ];
            })
        ]);
    }
}
