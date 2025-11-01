<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class FileUploadService
{
    /**
     * Upload multiple photos for aduan.
     * 
     * @param array $photos Array of UploadedFile
     * @param string $aduanId Unique identifier for organizing files
     * @return array Array of file info ['path', 'thumbnail_path', 'file_size', 'mime_type']
     */
    public function uploadAduanPhotos(array $photos, string $aduanId): array
    {
        $uploadedFiles = [];

        foreach ($photos as $index => $photo) {
            $uploadedFiles[] = $this->uploadSinglePhoto($photo, $aduanId, $index + 1);
        }

        return $uploadedFiles;
    }

    /**
     * Upload and process a single photo.
     */
    private function uploadSinglePhoto(UploadedFile $photo, string $aduanId, int $urutan): array
    {
        // Generate unique filename
        $filename = time() . '_' . $urutan . '_' . uniqid() . '.jpg';
        $path = "aduan/{$aduanId}/{$filename}";
        $thumbnailPath = "aduan/{$aduanId}/thumb_{$filename}";

        // Process and save main image (compressed to max 1MB)
        $image = Image::read($photo->getRealPath());
        
        // Resize if too large while maintaining aspect ratio
        if ($image->width() > 1920 || $image->height() > 1920) {
            $image->scale(width: 1920);
        }
        
        // Compress to max 1MB
        $quality = 85;
        $encoded = $image->toJpeg($quality);
        
        // If still > 1MB, reduce quality
        while (strlen($encoded) > 1048576 && $quality > 50) {
            $quality -= 5;
            $encoded = $image->toJpeg($quality);
        }
        
        Storage::disk('public')->put($path, $encoded);

        // Create thumbnail (300x300)
        $thumbnail = Image::read($photo->getRealPath());
        $thumbnail->cover(300, 300);
        Storage::disk('public')->put($thumbnailPath, $thumbnail->toJpeg(80));

        // Get file size
        $fileSize = Storage::disk('public')->size($path);

        return [
            'path' => $path,
            'thumbnail_path' => $thumbnailPath,
            'file_size' => $fileSize,
            'mime_type' => 'image/jpeg',
            'urutan' => $urutan,
        ];
    }

    /**
     * Delete photos and thumbnails.
     */
    public function deletePhotos(array $paths): void
    {
        foreach ($paths as $path) {
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }
    }

    /**
     * Validate photo file.
     */
    public function validatePhoto(UploadedFile $file): bool
    {
        // Check if file is image
        if (!in_array($file->getMimeType(), ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])) {
            return false;
        }

        // Check file size (max 10MB before compression)
        if ($file->getSize() > 10485760) {
            return false;
        }

        return true;
    }
}
