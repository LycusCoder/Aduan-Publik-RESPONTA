<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAduanRequest;
use App\Http\Requests\UpdateAduanRequest;
use App\Http\Resources\AduanResource;
use App\Http\Resources\AduanCollection;
use App\Models\Aduan;
use App\Models\FotoAduan;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class AduanController extends Controller
{
    protected FileUploadService $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of user's aduan.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 10);
        $status = $request->input('status');
        $kategoriId = $request->input('kategori_aduan_id');

        $query = Aduan::with(['user', 'kategoriAduan', 'fotos'])
            ->where('user_id', auth()->id());

        // Filter by status
        if ($status) {
            $query->where('status', $status);
        }

        // Filter by kategori
        if ($kategoriId) {
            $query->where('kategori_aduan_id', $kategoriId);
        }

        // Order by newest first
        $query->orderBy('created_at', 'desc');

        $aduan = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => AduanResource::collection($aduan),
            'meta' => [
                'total' => $aduan->total(),
                'count' => $aduan->count(),
                'per_page' => $aduan->perPage(),
                'current_page' => $aduan->currentPage(),
                'total_pages' => $aduan->lastPage(),
            ],
            'links' => [
                'first' => $aduan->url(1),
                'last' => $aduan->url($aduan->lastPage()),
                'prev' => $aduan->previousPageUrl(),
                'next' => $aduan->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Store a newly created aduan in storage.
     */
    public function store(StoreAduanRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Create aduan
            $aduan = Aduan::create([
                'user_id' => auth()->id(),
                'kategori_aduan_id' => $request->kategori_aduan_id,
                'deskripsi' => $request->deskripsi,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'alamat' => $request->alamat,
                'status' => 'baru',
            ]);

            // Upload photos
            $photos = $request->file('fotos');
            $uploadedFiles = $this->fileUploadService->uploadAduanPhotos($photos, $aduan->id);

            // Save foto records
            foreach ($uploadedFiles as $fileInfo) {
                FotoAduan::create([
                    'aduan_id' => $aduan->id,
                    'path' => $fileInfo['path'],
                    'thumbnail_path' => $fileInfo['thumbnail_path'],
                    'file_size' => $fileInfo['file_size'],
                    'mime_type' => $fileInfo['mime_type'],
                    'urutan' => $fileInfo['urutan'],
                ]);
            }

            DB::commit();

            // Load relationships
            $aduan->load(['user', 'kategoriAduan', 'fotos']);

            return response()->json([
                'success' => true,
                'data' => new AduanResource($aduan),
                'message' => 'Aduan berhasil dibuat dengan nomor tiket: ' . $aduan->nomor_tiket,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat aduan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified aduan.
     */
    public function show(string $nomorTiket): JsonResponse
    {
        $aduan = Aduan::with(['user', 'kategoriAduan', 'fotos'])
            ->where('nomor_tiket', $nomorTiket)
            ->firstOrFail();

        // Check authorization
        if (Gate::denies('view', $aduan)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke aduan ini.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => new AduanResource($aduan),
        ]);
    }

    /**
     * Update the specified aduan in storage.
     */
    public function update(UpdateAduanRequest $request, string $nomorTiket): JsonResponse
    {
        $aduan = Aduan::where('nomor_tiket', $nomorTiket)->firstOrFail();

        // Check authorization
        if (Gate::denies('update', $aduan)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat mengubah aduan ini. Hanya aduan dengan status "baru" yang dapat diubah.',
            ], 403);
        }

        $aduan->update($request->only([
            'kategori_aduan_id',
            'deskripsi',
            'latitude',
            'longitude',
            'alamat',
        ]));

        $aduan->load(['user', 'kategoriAduan', 'fotos']);

        return response()->json([
            'success' => true,
            'data' => new AduanResource($aduan),
            'message' => 'Aduan berhasil diperbarui.',
        ]);
    }

    /**
     * Remove the specified aduan from storage.
     */
    public function destroy(string $nomorTiket): JsonResponse
    {
        $aduan = Aduan::where('nomor_tiket', $nomorTiket)->firstOrFail();

        // Check authorization
        if (Gate::denies('delete', $aduan)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat menghapus aduan ini. Hanya aduan dengan status "baru" yang dapat dihapus.',
            ], 403);
        }

        try {
            DB::beginTransaction();

            // Delete photos (FotoAduan model has event to delete files)
            $aduan->fotos()->delete();

            // Delete aduan
            $aduan->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Aduan berhasil dihapus.',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus aduan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
