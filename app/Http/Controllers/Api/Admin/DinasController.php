<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dinas;
use App\Http\Resources\DinasResource;
use Illuminate\Support\Facades\Gate;

class DinasController extends Controller
{
    /**
     * Get list of dinas.
     */
    public function index(Request $request)
    {
        $query = Dinas::query();

        // Only active
        if ($request->input('active_only', false)) {
            $query->where('is_active', true);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $dinas = $query->with('organization')->orderBy('name')->get();

        return DinasResource::collection($dinas);
    }

    /**
     * Get dinas detail.
     */
    public function show(Request $request, $id)
    {
        $dinas = Dinas::with('organization')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new DinasResource($dinas)
        ]);
    }

    /**
     * Create new dinas (Super Admin only).
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['super_admin', 'admin_kota'])) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk membuat dinas baru.'
            ], 403);
        }

        $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:dinas,code',
            'description' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
        ]);

        $dinas = Dinas::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Dinas berhasil dibuat.',
            'data' => new DinasResource($dinas->load('organization'))
        ], 201);
    }

    /**
     * Update dinas.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['super_admin', 'admin_kota'])) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengupdate dinas.'
            ], 403);
        }

        $dinas = Dinas::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:50|unique:dinas,code,' . $id,
            'description' => 'sometimes|nullable|string',
            'phone' => 'sometimes|nullable|string|max:20',
            'email' => 'sometimes|nullable|email|max:255',
            'address' => 'sometimes|nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $dinas->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Dinas berhasil diupdate.',
            'data' => new DinasResource($dinas->fresh('organization'))
        ]);
    }

    /**
     * Get staff list for a dinas.
     */
    public function staff(Request $request, $id)
    {
        $dinas = Dinas::findOrFail($id);
        $staff = $dinas->users()->with('role')->get();

        return response()->json([
            'success' => true,
            'data' => $staff->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'no_hp' => $user->no_hp,
                    'email' => $user->email,
                    'role' => $user->role?->display_name,
                    'is_active' => $user->is_active,
                ];
            })
        ]);
    }
}
