<?php

namespace App\Services;

use App\Models\User;
use App\Models\Aduan;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send notification when aduan status changes.
     */
    public function notifyStatusChange(Aduan $aduan, string $oldStatus, string $newStatus): void
    {
        try {
            $user = $aduan->user;
            
            if (!$user || !$user->email) {
                Log::info("User email not found for aduan {$aduan->nomor_tiket}");
                return;
            }

            $statusLabels = [
                'baru' => 'Baru',
                'diverifikasi' => 'Diverifikasi',
                'diproses' => 'Sedang Diproses',
                'selesai' => 'Selesai',
                'ditolak' => 'Ditolak',
            ];

            $data = [
                'user_name' => $user->name,
                'nomor_tiket' => $aduan->nomor_tiket,
                'old_status' => $statusLabels[$oldStatus] ?? $oldStatus,
                'new_status' => $statusLabels[$newStatus] ?? $newStatus,
                'deskripsi' => $aduan->deskripsi,
            ];

            // For now, just log the notification
            // In production, use Laravel Mail with proper email templates
            Log::info("Notification sent to {$user->email}: Aduan {$aduan->nomor_tiket} status changed from {$oldStatus} to {$newStatus}");

            // TODO: Implement actual email sending
            // Mail::to($user->email)->send(new AduanStatusChangedMail($data));

        } catch (\Exception $e) {
            Log::error('Failed to send status change notification: ' . $e->getMessage());
        }
    }

    /**
     * Send notification when aduan is assigned.
     */
    public function notifyAssignment(Aduan $aduan, User $assignedUser): void
    {
        try {
            if (!$assignedUser->email) {
                Log::info("Assigned user email not found for aduan {$aduan->nomor_tiket}");
                return;
            }

            $data = [
                'user_name' => $assignedUser->name,
                'nomor_tiket' => $aduan->nomor_tiket,
                'deskripsi' => $aduan->deskripsi,
                'alamat' => $aduan->alamat,
            ];

            Log::info("Assignment notification sent to {$assignedUser->email}: Aduan {$aduan->nomor_tiket} assigned");

            // TODO: Implement actual email sending
            // Mail::to($assignedUser->email)->send(new AduanAssignedMail($data));

        } catch (\Exception $e) {
            Log::error('Failed to send assignment notification: ' . $e->getMessage());
        }
    }

    /**
     * Send notification when aduan is verified.
     */
    public function notifyVerification(Aduan $aduan, bool $isApproved): void
    {
        try {
            $user = $aduan->user;
            
            if (!$user || !$user->email) {
                Log::info("User email not found for aduan {$aduan->nomor_tiket}");
                return;
            }

            $status = $isApproved ? 'diverifikasi' : 'ditolak';
            $message = $isApproved 
                ? "Aduan Anda telah diverifikasi dan akan segera diproses."
                : "Aduan Anda ditolak. Alasan: {$aduan->catatan_penolakan}";

            $data = [
                'user_name' => $user->name,
                'nomor_tiket' => $aduan->nomor_tiket,
                'status' => $status,
                'message' => $message,
            ];

            Log::info("Verification notification sent to {$user->email}: Aduan {$aduan->nomor_tiket} {$status}");

            // TODO: Implement actual email sending
            // Mail::to($user->email)->send(new AduanVerificationMail($data));

        } catch (\Exception $e) {
            Log::error('Failed to send verification notification: ' . $e->getMessage());
        }
    }

    /**
     * Send notification when aduan is completed.
     */
    public function notifyCompletion(Aduan $aduan): void
    {
        try {
            $user = $aduan->user;
            
            if (!$user || !$user->email) {
                Log::info("User email not found for aduan {$aduan->nomor_tiket}");
                return;
            }

            $data = [
                'user_name' => $user->name,
                'nomor_tiket' => $aduan->nomor_tiket,
                'deskripsi' => $aduan->deskripsi,
                'tanggal_selesai' => $aduan->tanggal_selesai?->format('d M Y H:i'),
            ];

            Log::info("Completion notification sent to {$user->email}: Aduan {$aduan->nomor_tiket} completed");

            // TODO: Implement actual email sending
            // Mail::to($user->email)->send(new AduanCompletedMail($data));

        } catch (\Exception $e) {
            Log::error('Failed to send completion notification: ' . $e->getMessage());
        }
    }

    /**
     * Send notification to admin when new aduan is created.
     */
    public function notifyNewAduan(Aduan $aduan): void
    {
        try {
            // Get all verifikators and admin kota
            $admins = User::whereHas('role', function($q) {
                $q->whereIn('name', ['super_admin', 'admin_kota', 'verifikator']);
            })->where('is_active', true)->get();

            foreach ($admins as $admin) {
                if ($admin->email) {
                    Log::info("New aduan notification sent to admin {$admin->email}: {$aduan->nomor_tiket}");
                    // TODO: Implement actual email sending
                }
            }

        } catch (\Exception $e) {
            Log::error('Failed to send new aduan notification to admins: ' . $e->getMessage());
        }
    }
}
