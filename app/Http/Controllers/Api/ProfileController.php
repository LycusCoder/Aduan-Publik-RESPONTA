<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    /**
     * Get authenticated user profile
     */
    public function show(): JsonResponse
    {
        $user = auth()->user();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'no_hp' => $user->no_hp,
                'email' => $user->email,
                'is_verified' => $user->is_verified,
                'verified_at' => $user->verified_at?->toDateTimeString(),
                'created_at' => $user->created_at->toDateTimeString(),
                'statistics' => [
                    'total_aduan' => $user->total_aduan,
                    'active_aduan' => $user->active_aduan,
                    'completed_aduan' => $user->completed_aduan,
                ],
            ],
        ], 200);
    }

    /**
     * Update user profile
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = auth()->user();
        $validated = $request->validated();

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile berhasil diperbarui!',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'no_hp' => $user->no_hp,
                'email' => $user->email,
            ],
        ], 200);
    }
}
