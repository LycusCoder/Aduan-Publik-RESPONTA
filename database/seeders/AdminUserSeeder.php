<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Organization;
use App\Models\Dinas;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Create sample admin users for testing.
     */
    public function run(): void
    {
        // Get roles
        $superAdminRole = Role::where('name', 'super_admin')->first();
        $adminKotaRole = Role::where('name', 'admin_kota')->first();
        $kepalaDinasRole = Role::where('name', 'kepala_dinas')->first();
        $verifikatorRole = Role::where('name', 'verifikator')->first();
        $wargaRole = Role::where('name', 'warga')->first();

        // Get organizations & dinas
        $kotaTegal = Organization::where('type', 'kota')->first();
        $kecamatanTegalBarat = Organization::where('name', 'Kecamatan Tegal Barat')->first();
        $kelurahanKraton = Organization::where('name', 'Kelurahan Kraton')->first();
        $dinasDPU = Dinas::where('code', 'DPU')->first();

        $users = [];

        // 1. Super Admin
        if ($superAdminRole) {
            $users[] = User::create([
                'name' => 'Super Administrator',
                'no_hp' => '08111111111',
                'nik' => '3376010101850001',
                'email' => 'superadmin@responta.id',
                'password' => Hash::make('admin123'),
                'role_id' => $superAdminRole->id,
                'organization_id' => $kotaTegal?->id,
                'dinas_id' => null,
                'is_admin' => true,
                'is_active' => true,
                'is_verified' => true,
                'verified_at' => now(),
            ]);
        }

        // 2. Admin Kota Tegal
        if ($adminKotaRole) {
            $users[] = User::create([
                'name' => 'Admin Kota Tegal',
                'no_hp' => '08122222222',
                'nik' => '3376010101860002',
                'email' => 'admin.kota@tegalkota.go.id',
                'password' => Hash::make('admin123'),
                'role_id' => $adminKotaRole->id,
                'organization_id' => $kotaTegal?->id,
                'dinas_id' => null,
                'is_admin' => true,
                'is_active' => true,
                'is_verified' => true,
                'verified_at' => now(),
            ]);
        }

        // 3. Kepala Dinas DPU
        if ($kepalaDinasRole && $dinasDPU) {
            $users[] = User::create([
                'name' => 'Ir. Budi Santoso',
                'no_hp' => '08133333333',
                'nik' => '3376010101870003',
                'email' => 'kepala.dpu@tegalkota.go.id',
                'password' => Hash::make('admin123'),
                'role_id' => $kepalaDinasRole->id,
                'organization_id' => $kotaTegal?->id,
                'dinas_id' => $dinasDPU->id,
                'is_admin' => true,
                'is_active' => true,
                'is_verified' => true,
                'verified_at' => now(),
            ]);
        }

        // 4. Verifikator
        if ($verifikatorRole) {
            $users[] = User::create([
                'name' => 'Andi Verifikator',
                'no_hp' => '08144444444',
                'nik' => '3376010101880004',
                'email' => 'verifikator@tegalkota.go.id',
                'password' => Hash::make('admin123'),
                'role_id' => $verifikatorRole->id,
                'organization_id' => $kotaTegal?->id,
                'dinas_id' => null,
                'is_admin' => true,
                'is_active' => true,
                'is_verified' => true,
                'verified_at' => now(),
            ]);
        }

        // 5. Warga (Sample user yang sudah ada update role-nya)
        $existingWarga = User::where('no_hp', '081234567890')->first();
        if ($existingWarga && $wargaRole && $kelurahanKraton) {
            $existingWarga->update([
                'role_id' => $wargaRole->id,
                'organization_id' => $kelurahanKraton->id,
                'dinas_id' => null,
                'is_admin' => false,
                'is_active' => true,
            ]);
            $this->command->info('   ✓ Updated existing warga user: ' . $existingWarga->name);
        }

        // 6. Additional warga for testing
        if ($wargaRole && $kelurahanKraton) {
            $users[] = User::create([
                'name' => 'Siti Nurhaliza',
                'no_hp' => '08155555555',
                'nik' => '3376010201890005',
                'email' => 'siti@example.com',
                'password' => Hash::make('warga123'),
                'role_id' => $wargaRole->id,
                'organization_id' => $kelurahanKraton->id,
                'dinas_id' => null,
                'is_admin' => false,
                'is_active' => true,
                'is_verified' => true,
                'verified_at' => now(),
            ]);
        }

        $this->command->info('✅ Admin users created:');
        $this->command->info('   📌 CREDENTIALS FOR TESTING:');
        $this->command->info('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('   1. Super Admin:');
        $this->command->info('      No HP: 08111111111');
        $this->command->info('      Password: admin123');
        $this->command->info('');
        $this->command->info('   2. Admin Kota:');
        $this->command->info('      No HP: 08122222222');
        $this->command->info('      Password: admin123');
        $this->command->info('');
        $this->command->info('   3. Kepala Dinas DPU:');
        $this->command->info('      No HP: 08133333333');
        $this->command->info('      Password: admin123');
        $this->command->info('');
        $this->command->info('   4. Verifikator:');
        $this->command->info('      No HP: 08144444444');
        $this->command->info('      Password: admin123');
        $this->command->info('');
        $this->command->info('   5. Warga (existing):');
        $this->command->info('      No HP: 081234567890');
        $this->command->info('      Password: password123');
        $this->command->info('');
        $this->command->info('   6. Warga (new):');
        $this->command->info('      No HP: 08155555555');
        $this->command->info('      Password: warga123');
        $this->command->info('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
