<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all roles
        $superAdmin = Role::where('name', 'super_admin')->first();
        $adminKota = Role::where('name', 'admin_kota')->first();
        $kepalaDinas = Role::where('name', 'kepala_dinas')->first();
        $stafDinas = Role::where('name', 'staf_dinas')->first();
        $camat = Role::where('name', 'camat')->first();
        $stafKecamatan = Role::where('name', 'staf_kecamatan')->first();
        $lurah = Role::where('name', 'lurah')->first();
        $stafKelurahan = Role::where('name', 'staf_kelurahan')->first();
        $verifikator = Role::where('name', 'verifikator')->first();
        $teknisiLapangan = Role::where('name', 'teknisi_lapangan')->first();
        $warga = Role::where('name', 'warga')->first();

        // Get permissions by name helper
        $getPermissions = function ($names) {
            return Permission::whereIn('name', $names)->get();
        };

        // 1. Super Admin - Full Access
        if ($superAdmin) {
            $superAdmin->permissions()->sync(Permission::all()->pluck('id'));
        }

        // 2. Admin Kota
        if ($adminKota) {
            $adminKota->permissions()->sync($getPermissions([
                'view_all_aduan',
                'create_aduan',
                'verify_aduan',
                'reject_aduan',
                'assign_to_dinas',
                'assign_to_staff',
                'update_status',
                'set_priority',
                'add_notes',
                'view_all_users',
                'create_user',
                'update_user',
                'activate_user',
                'view_all_statistics',
                'generate_reports',
                'export_data',
                'manage_categories',
            ])->pluck('id'));
        }

        // 3. Kepala Dinas
        if ($kepalaDinas) {
            $kepalaDinas->permissions()->sync($getPermissions([
                'view_dinas_aduan',
                'assign_to_staff',
                'update_status',
                'set_priority',
                'add_notes',
                'upload_photos',
                'manage_staff',
                'view_dinas_statistics',
                'generate_reports',
            ])->pluck('id'));
        }

        // 4. Staf Dinas
        if ($stafDinas) {
            $stafDinas->permissions()->sync($getPermissions([
                'view_assigned_aduan',
                'update_progress',
                'add_notes',
                'upload_photos',
            ])->pluck('id'));
        }

        // 5. Camat
        if ($camat) {
            $camat->permissions()->sync($getPermissions([
                'view_kecamatan_aduan',
                'set_priority',
                'add_notes',
                'view_kecamatan_statistics',
                'generate_reports',
            ])->pluck('id'));
        }

        // 6. Staf Kecamatan
        if ($stafKecamatan) {
            $stafKecamatan->permissions()->sync($getPermissions([
                'view_kecamatan_aduan',
                'add_notes',
            ])->pluck('id'));
        }

        // 7. Lurah
        if ($lurah) {
            $lurah->permissions()->sync($getPermissions([
                'view_kelurahan_aduan',
                'add_notes',
                'view_kelurahan_statistics',
                'generate_reports',
            ])->pluck('id'));
        }

        // 8. Staf Kelurahan
        if ($stafKelurahan) {
            $stafKelurahan->permissions()->sync($getPermissions([
                'view_kelurahan_aduan',
                'add_notes',
            ])->pluck('id'));
        }

        // 9. Verifikator
        if ($verifikator) {
            $verifikator->permissions()->sync($getPermissions([
                'view_all_aduan',
                'verify_aduan',
                'reject_aduan',
                'add_notes',
            ])->pluck('id'));
        }

        // 10. Teknisi Lapangan
        if ($teknisiLapangan) {
            $teknisiLapangan->permissions()->sync($getPermissions([
                'view_assigned_aduan',
                'update_progress',
                'upload_photos',
                'add_notes',
            ])->pluck('id'));
        }

        // 11. Warga
        if ($warga) {
            $warga->permissions()->sync($getPermissions([
                'view_own_aduan',
                'create_aduan',
                'update_own_aduan',
                'delete_own_aduan',
                'upload_photos',
            ])->pluck('id'));
        }

        $this->command->info('✅ Permissions berhasil di-assign ke semua roles!');
    }
}
