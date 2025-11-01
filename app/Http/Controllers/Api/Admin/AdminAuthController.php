<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    /**
     * Admin login (separate from warga login).
     */
    public function login(Request $request)
    {
        $request->validate([
            'no_hp' => 'required|string',
            'password' => 'required|string',
        ]);

        // Find user
        $user = User::where('no_hp', $request->no_hp)->first();

        // Check if user exists
        if (!$user) {
            throw ValidationException::withMessages([
                'no_hp' => ['Nomor HP tidak terdaftar.'],
            ]);
        }

        // Check if user is admin
        if (!$user->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke admin panel.'
            ], 403);
        }

        // Check if user is active
        if (!$user->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda telah dinonaktifkan.'
            ], 403);
        }

        // Check password
        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Password salah.'],
            ]);
        }

        // Update last login
        $user->last_login_at = now();
        $user->save();

        // Create token with expiration (24 hours for admin)
        $token = $user->createToken('admin-token', ['*'], now()->addHours(24))->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'no_hp' => $user->no_hp,
                    'email' => $user->email,
                    'is_admin' => $user->is_admin,
                    'role' => [
                        'name' => $user->role?->name,
                        'display_name' => $user->role?->display_name,
                        'level' => $user->role?->level,
                    ],
                    'organization' => $user->organization ? [
                        'id' => $user->organization->id,
                        'name' => $user->organization->name,
                        'type' => $user->organization->type,
                    ] : null,
                    'dinas' => $user->dinas ? [
                        'id' => $user->dinas->id,
                        'name' => $user->dinas->name,
                        'code' => $user->dinas->code,
                    ] : null,
                ],
                'token' => $token,
            ]
        ]);
    }

    /**
     * Admin logout.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.'
        ]);
    }

    /**
     * Get current admin user.
     */
    public function me(Request $request)
    {
        $user = $request->user()->load(['role', 'organization', 'dinas']);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'no_hp' => $user->no_hp,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'is_active' => $user->is_active,
                'last_login_at' => $user->last_login_at?->format('d M Y H:i'),
                'role' => [
                    'name' => $user->role?->name,
                    'display_name' => $user->role?->display_name,
                    'level' => $user->role?->level,
                    'permissions' => $user->role?->permissions->pluck('name') ?? [],
                ],
                'organization' => $user->organization ? [
                    'id' => $user->organization->id,
                    'name' => $user->organization->name,
                    'type' => $user->organization->type,
                ] : null,
                'dinas' => $user->dinas ? [
                    'id' => $user->dinas->id,
                    'name' => $user->dinas->name,
                    'code' => $user->dinas->code,
                ] : null,
            ]
        ]);
    }
}
