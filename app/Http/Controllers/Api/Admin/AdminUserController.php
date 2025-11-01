<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Http\Resources\AdminUserResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    /**
     * Get list of users (with filters).
     */
    public function index(Request $request)
    {
        // Check permission
        if (Gate::denies('viewAny', User::class)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk melihat daftar user.'
            ], 403);
        }

        $user = $request->user();
        $query = User::query();

        // Super admin can see all
        // Admin kota cannot see super admin
        if ($user->hasRole('admin_kota')) {
            $query->whereHas('role', function($q) {
                $q->where('name', '!=', 'super_admin');
            });
        }

        // Kepala dinas can only see their staff
        if ($user->hasRole('kepala_dinas')) {
            $query->where('dinas_id', $user->dinas_id);
        }

        // Apply filters
        if ($request->has('role_id')) {
            $query->where('role_id', $request->role_id);
        }

        if ($request->has('organization_id')) {
            $query->where('organization_id', $request->organization_id);
        }

        if ($request->has('dinas_id')) {
            $query->where('dinas_id', $request->dinas_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active === 'true' || $request->is_active === '1');
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('no_hp', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 15);
        $users = $query->with(['role', 'organization', 'dinas'])->paginate($perPage);

        return AdminUserResource::collection($users);
    }

    /**
     * Create new user.
     */
    public function store(Request $request)
    {
        // Check permission
        if (Gate::denies('create', User::class)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk membuat user baru.'
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'no_hp' => 'required|string|unique:users,no_hp|regex:/^08[0-9]{8,11}$/',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
            'organization_id' => 'nullable|exists:organizations,id',
            'dinas_id' => 'nullable|exists:dinas,id',
            'is_admin' => 'required|boolean',
        ]);

        $user = User::create([
            'name' => $request->name,
            'no_hp' => $request->no_hp,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'organization_id' => $request->organization_id,
            'dinas_id' => $request->dinas_id,
            'is_admin' => $request->is_admin,
            'is_active' => true,
            'is_verified' => true, // Auto-verify admin users
            'verified_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dibuat.',
            'data' => new AdminUserResource($user->load(['role', 'organization', 'dinas']))
        ], 201);
    }

    /**
     * Get user detail.
     */
    public function show(Request $request, $id)
    {
        $user = User::with(['role.permissions', 'organization', 'dinas', 'aduan'])->findOrFail($id);

        // Check permission
        if (Gate::denies('view', [User::class, $user])) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk melihat user ini.'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => new AdminUserResource($user)
        ]);
    }

    /**
     * Update user.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Check permission
        if (Gate::denies('update', [User::class, $user])) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengupdate user ini.'
            ], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'no_hp' => ['sometimes', 'required', 'string', Rule::unique('users')->ignore($user->id), 'regex:/^08[0-9]{8,11}$/'],
            'email' => ['sometimes', 'nullable', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:8',
            'role_id' => 'sometimes|required|exists:roles,id',
            'organization_id' => 'sometimes|nullable|exists:organizations,id',
            'dinas_id' => 'sometimes|nullable|exists:dinas,id',
        ]);

        $data = $request->only(['name', 'no_hp', 'email', 'role_id', 'organization_id', 'dinas_id']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diupdate.',
            'data' => new AdminUserResource($user->fresh(['role', 'organization', 'dinas']))
        ]);
    }

    /**
     * Activate/Deactivate user.
     */
    public function activate(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Check permission
        if (Gate::denies('activate', [User::class, $user])) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengaktifkan/menonaktifkan user ini.'
            ], 403);
        }

        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $user->is_active = $request->is_active;
        $user->save();

        $message = $request->is_active ? 'User berhasil diaktifkan.' : 'User berhasil dinonaktifkan.';

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => new AdminUserResource($user)
        ]);
    }

    /**
     * Soft delete user.
     */
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Check permission
        if (Gate::denies('delete', [User::class, $user])) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk menghapus user ini.'
            ], 403);
        }

        // For now, just deactivate instead of actual delete
        $user->is_active = false;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus (dinonaktifkan).'
        ]);
    }

    /**
     * Get available roles.
     */
    public function roles(Request $request)
    {
        $user = $request->user();
        $query = Role::where('is_active', true);

        // Admin kota cannot assign super_admin role
        if ($user->hasRole('admin_kota')) {
            $query->where('name', '!=', 'super_admin');
        }

        $roles = $query->orderBy('level')->get();

        return response()->json([
            'success' => true,
            'data' => $roles->map(function($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'display_name' => $role->display_name,
                    'level' => $role->level,
                ];
            })
        ]);
    }
}
