<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     * Check if user has one of the required roles.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $roles - Comma-separated role names
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // Check if user is active
        if (!$user->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated.'
            ], 403);
        }

        // Parse roles (comma-separated)
        $allowedRoles = explode(',', $roles);

        // Check if user has any of the required roles
        if ($user->hasAnyRole($allowedRoles)) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'You do not have the required role to access this resource.'
        ], 403);
    }
}
