<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\KategoriAduanResource;
use App\Models\KategoriAduan;
use Illuminate\Http\JsonResponse;

class KategoriAduanController extends Controller
{
    /**
     * Display a listing of active kategori aduan.
     */
    public function index(): JsonResponse
    {
        $kategori = KategoriAduan::active()
            ->orderBy('nama')
            ->get();

        return response()->json([
            'success' => true,
            'data' => KategoriAduanResource::collection($kategori),
            'message' => 'Kategori aduan berhasil diambil.',
        ]);
    }
}
