<?php

namespace App\Services;

use App\Models\Aduan;
use App\Models\User;
use App\Models\Dinas;
use App\Models\AduanHistory;
use Illuminate\Support\Facades\DB;

class AduanAssignmentService
{
    /**
     * Assign aduan to dinas.
     */
    public function assignToDinas(Aduan $aduan, int $dinasId, User $assignedBy, ?string $notes = null): bool
    {
        try {
            DB::beginTransaction();

            $dinas = Dinas::findOrFail($dinasId);
            $oldDinasId = $aduan->dinas_id;

            $aduan->dinas_id = $dinasId;
            $aduan->save();

            // Log activity
            AduanHistory::create([
                'aduan_id' => $aduan->id,
                'user_id' => $assignedBy->id,
                'action' => 'assigned_to_dinas',
                'old_value' => $oldDinasId ? "Dinas ID: {$oldDinasId}" : null,
                'new_value' => "Dinas: {$dinas->name}",
                'notes' => $notes,
            ]);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to assign aduan to dinas: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Assign aduan to staff/teknisi.
     */
    public function assignToStaff(Aduan $aduan, int $staffId, User $assignedBy, ?string $notes = null): bool
    {
        try {
            DB::beginTransaction();

            $staff = User::findOrFail($staffId);
            $oldStaffId = $aduan->assigned_to;

            $aduan->assigned_to = $staffId;
            $aduan->save();

            // Log activity
            AduanHistory::create([
                'aduan_id' => $aduan->id,
                'user_id' => $assignedBy->id,
                'action' => 'assigned_to_staff',
                'old_value' => $oldStaffId ? "Staff ID: {$oldStaffId}" : null,
                'new_value' => "Staff: {$staff->name}",
                'notes' => $notes,
            ]);

            DB::commit();

            // Send notification to assigned staff
            // TODO: Implement notification

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to assign aduan to staff: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Verify aduan.
     */
    public function verifyAduan(Aduan $aduan, User $verifikator, ?string $notes = null): bool
    {
        try {
            DB::beginTransaction();

            $aduan->status = 'diverifikasi';
            $aduan->verifikator_id = $verifikator->id;
            $aduan->tanggal_verifikasi = now();
            $aduan->catatan_verifikasi = $notes;
            $aduan->save();

            // Log activity
            AduanHistory::create([
                'aduan_id' => $aduan->id,
                'user_id' => $verifikator->id,
                'action' => 'verified',
                'old_value' => 'baru',
                'new_value' => 'diverifikasi',
                'notes' => $notes,
            ]);

            DB::commit();

            // Send notification to aduan owner
            // TODO: Implement notification

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to verify aduan: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Reject aduan.
     */
    public function rejectAduan(Aduan $aduan, User $rejectedBy, string $reason): bool
    {
        try {
            DB::beginTransaction();

            $aduan->status = 'ditolak';
            $aduan->catatan_penolakan = $reason;
            $aduan->save();

            // Log activity
            AduanHistory::create([
                'aduan_id' => $aduan->id,
                'user_id' => $rejectedBy->id,
                'action' => 'rejected',
                'old_value' => 'baru',
                'new_value' => 'ditolak',
                'notes' => "Alasan: {$reason}",
            ]);

            DB::commit();

            // Send notification to aduan owner
            // TODO: Implement notification

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to reject aduan: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Update aduan status.
     */
    public function updateStatus(Aduan $aduan, string $newStatus, User $updatedBy, ?string $notes = null): bool
    {
        try {
            DB::beginTransaction();

            $oldStatus = $aduan->status;
            $aduan->status = $newStatus;

            // Set timestamps based on status
            if ($newStatus === 'diverifikasi' && !$aduan->tanggal_verifikasi) {
                $aduan->tanggal_verifikasi = now();
            }
            if ($newStatus === 'diproses' && !$aduan->tanggal_diproses) {
                $aduan->tanggal_diproses = now();
            }
            if ($newStatus === 'selesai' && !$aduan->tanggal_selesai) {
                $aduan->tanggal_selesai = now();
                $aduan->progress = 100;
            }

            if ($notes) {
                $aduan->catatan_admin = $notes;
            }

            $aduan->save();

            // Log activity
            AduanHistory::create([
                'aduan_id' => $aduan->id,
                'user_id' => $updatedBy->id,
                'action' => 'status_updated',
                'old_value' => $oldStatus,
                'new_value' => $newStatus,
                'notes' => $notes,
            ]);

            DB::commit();

            // Send notification to aduan owner
            // TODO: Implement notification

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to update aduan status: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Update aduan progress.
     */
    public function updateProgress(Aduan $aduan, int $progress, User $updatedBy, ?string $notes = null): bool
    {
        try {
            DB::beginTransaction();

            $oldProgress = $aduan->progress;
            $aduan->progress = $progress;

            // Auto-complete if progress reaches 100%
            if ($progress === 100 && $aduan->status !== 'selesai') {
                $aduan->status = 'selesai';
                $aduan->tanggal_selesai = now();
            }

            if ($notes) {
                $aduan->catatan_admin = $notes;
            }

            $aduan->save();

            // Log activity
            AduanHistory::create([
                'aduan_id' => $aduan->id,
                'user_id' => $updatedBy->id,
                'action' => 'progress_updated',
                'old_value' => "{$oldProgress}%",
                'new_value' => "{$progress}%",
                'notes' => $notes,
            ]);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to update aduan progress: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Set aduan priority.
     */
    public function setPriority(Aduan $aduan, string $priority, User $updatedBy, ?string $notes = null): bool
    {
        try {
            DB::beginTransaction();

            $oldPriority = $aduan->priority;
            $aduan->priority = $priority;
            $aduan->save();

            // Log activity
            AduanHistory::create([
                'aduan_id' => $aduan->id,
                'user_id' => $updatedBy->id,
                'action' => 'priority_updated',
                'old_value' => $oldPriority,
                'new_value' => $priority,
                'notes' => $notes,
            ]);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to set aduan priority: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Add admin notes to aduan.
     */
    public function addNotes(Aduan $aduan, User $user, string $notes): bool
    {
        try {
            DB::beginTransaction();

            // Log activity
            AduanHistory::create([
                'aduan_id' => $aduan->id,
                'user_id' => $user->id,
                'action' => 'note_added',
                'old_value' => null,
                'new_value' => null,
                'notes' => $notes,
            ]);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to add notes to aduan: ' . $e->getMessage());
            return false;
        }
    }
}
