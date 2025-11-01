<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Organization;
use App\Http\Resources\OrganizationResource;

class OrganizationController extends Controller
{
    /**
     * Get list of organizations.
     */
    public function index(Request $request)
    {
        $query = Organization::query();

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by parent
        if ($request->has('parent_id')) {
            if ($request->parent_id === 'null' || $request->parent_id === '') {
                $query->whereNull('parent_id');
            } else {
                $query->where('parent_id', $request->parent_id);
            }
        }

        // Only active
        if ($request->input('active_only', false)) {
            $query->where('is_active', true);
        }

        $organizations = $query->with('parent')->orderBy('name')->get();

        return OrganizationResource::collection($organizations);
    }

    /**
     * Get organization hierarchy tree.
     */
    public function tree(Request $request, $id)
    {
        $organization = Organization::with(['children.children'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new OrganizationResource($organization)
        ]);
    }

    /**
     * Get organization detail.
     */
    public function show(Request $request, $id)
    {
        $organization = Organization::with(['parent', 'children'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new OrganizationResource($organization)
        ]);
    }
}
