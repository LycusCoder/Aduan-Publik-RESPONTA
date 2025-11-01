<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Aduan Permissions
            ['name' => 'view_all_aduan', 'display_name' => 'View All Aduan', 'group' => 'aduan', 'description' => 'Dapat melihat semua aduan'],
            ['name' => 'view_own_aduan', 'display_name' => 'View Own Aduan', 'group' => 'aduan', 'description' => 'Dapat melihat aduan sendiri'],
            ['name' => 'view_assigned_aduan', 'display_name' => 'View Assigned Aduan', 'group' => 'aduan', 'description' => 'Dapat melihat aduan yang di-assign'],
            ['name' => 'view_dinas_aduan', 'display_name' => 'View Dinas Aduan', 'group' => 'aduan', 'description' => 'Dapat melihat aduan dinas sendiri'],
            ['name' => 'view_kecamatan_aduan', 'display_name' => 'View Kecamatan Aduan', 'group' => 'aduan', 'description' => 'Dapat melihat aduan di kecamatan'],
            ['name' => 'view_kelurahan_aduan', 'display_name' => 'View Kelurahan Aduan', 'group' => 'aduan', 'description' => 'Dapat melihat aduan di kelurahan'],
            
            ['name' => 'create_aduan', 'display_name' => 'Create Aduan', 'group' => 'aduan', 'description' => 'Dapat membuat aduan'],
            ['name' => 'update_own_aduan', 'display_name' => 'Update Own Aduan', 'group' => 'aduan', 'description' => 'Dapat update aduan sendiri'],
            ['name' => 'delete_own_aduan', 'display_name' => 'Delete Own Aduan', 'group' => 'aduan', 'description' => 'Dapat delete aduan sendiri'],
            
            ['name' => 'verify_aduan', 'display_name' => 'Verify Aduan', 'group' => 'aduan', 'description' => 'Dapat verifikasi aduan'],
            ['name' => 'reject_aduan', 'display_name' => 'Reject Aduan', 'group' => 'aduan', 'description' => 'Dapat menolak aduan'],
            ['name' => 'assign_to_dinas', 'display_name' => 'Assign to Dinas', 'group' => 'aduan', 'description' => 'Dapat assign aduan ke dinas'],
            ['name' => 'assign_to_staff', 'display_name' => 'Assign to Staff', 'group' => 'aduan', 'description' => 'Dapat assign aduan ke staff'],
            
            ['name' => 'update_status', 'display_name' => 'Update Status', 'group' => 'aduan', 'description' => 'Dapat update status aduan'],
            ['name' => 'update_progress', 'display_name' => 'Update Progress', 'group' => 'aduan', 'description' => 'Dapat update progress aduan'],
            ['name' => 'set_priority', 'display_name' => 'Set Priority', 'group' => 'aduan', 'description' => 'Dapat set priority aduan'],
            ['name' => 'add_notes', 'display_name' => 'Add Notes', 'group' => 'aduan', 'description' => 'Dapat menambah catatan'],
            ['name' => 'upload_photos', 'display_name' => 'Upload Photos', 'group' => 'aduan', 'description' => 'Dapat upload foto'],
            
            // User Management Permissions
            ['name' => 'view_all_users', 'display_name' => 'View All Users', 'group' => 'user', 'description' => 'Dapat melihat semua user'],
            ['name' => 'create_user', 'display_name' => 'Create User', 'group' => 'user', 'description' => 'Dapat membuat user baru'],
            ['name' => 'update_user', 'display_name' => 'Update User', 'group' => 'user', 'description' => 'Dapat update user'],
            ['name' => 'delete_user', 'display_name' => 'Delete User', 'group' => 'user', 'description' => 'Dapat delete user'],
            ['name' => 'manage_staff', 'display_name' => 'Manage Staff', 'group' => 'user', 'description' => 'Dapat manage staff sendiri'],
            ['name' => 'activate_user', 'display_name' => 'Activate User', 'group' => 'user', 'description' => 'Dapat activate/deactivate user'],
            
            // Statistics & Reports
            ['name' => 'view_all_statistics', 'display_name' => 'View All Statistics', 'group' => 'report', 'description' => 'Dapat melihat semua statistics'],
            ['name' => 'view_dinas_statistics', 'display_name' => 'View Dinas Statistics', 'group' => 'report', 'description' => 'Dapat melihat statistics dinas'],
            ['name' => 'view_kecamatan_statistics', 'display_name' => 'View Kecamatan Statistics', 'group' => 'report', 'description' => 'Dapat melihat statistics kecamatan'],
            ['name' => 'view_kelurahan_statistics', 'display_name' => 'View Kelurahan Statistics', 'group' => 'report', 'description' => 'Dapat melihat statistics kelurahan'],
            ['name' => 'generate_reports', 'display_name' => 'Generate Reports', 'group' => 'report', 'description' => 'Dapat generate reports'],
            ['name' => 'export_data', 'display_name' => 'Export Data', 'group' => 'report', 'description' => 'Dapat export data'],
            
            // System Settings
            ['name' => 'manage_roles', 'display_name' => 'Manage Roles', 'group' => 'system', 'description' => 'Dapat manage roles'],
            ['name' => 'manage_permissions', 'display_name' => 'Manage Permissions', 'group' => 'system', 'description' => 'Dapat manage permissions'],
            ['name' => 'manage_organizations', 'display_name' => 'Manage Organizations', 'group' => 'system', 'description' => 'Dapat manage organizations'],
            ['name' => 'manage_dinas', 'display_name' => 'Manage Dinas', 'group' => 'system', 'description' => 'Dapat manage dinas'],
            ['name' => 'manage_categories', 'display_name' => 'Manage Categories', 'group' => 'system', 'description' => 'Dapat manage kategori aduan'],
            ['name' => 'system_settings', 'display_name' => 'System Settings', 'group' => 'system', 'description' => 'Dapat mengubah system settings'],
            ['name' => 'view_audit_log', 'display_name' => 'View Audit Log', 'group' => 'system', 'description' => 'Dapat melihat audit log'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        $this->command->info('✅ ' . count($permissions) . ' permissions berhasil dibuat!');
    }
}
