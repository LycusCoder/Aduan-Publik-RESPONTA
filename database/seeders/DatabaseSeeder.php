<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting RESPONTA Phase 5 Database Seeding...');
        $this->command->newLine();

        // Phase 5: RBAC Tables (Must be in this order!)
        $this->command->info('📋 Phase 5: Creating RBAC Structure...');
        
        $this->call(RoleSeeder::class);
        $this->command->newLine();
        
        $this->call(PermissionSeeder::class);
        $this->command->newLine();
        
        $this->call(RolePermissionSeeder::class);
        $this->command->newLine();
        
        $this->call(OrganizationSeeder::class);
        $this->command->newLine();
        
        $this->call(DinasSeeder::class);
        $this->command->newLine();

        // Phase 1-3: Existing Master Data
        $this->command->info('📋 Phase 1-3: Master Data...');
        
        $this->call(KategoriAduanSeeder::class);
        $this->command->newLine();
        
        $this->call(UserSeeder::class);
        $this->command->newLine();

        // Phase 5: Admin Users (after all master data ready)
        $this->command->info('👥 Phase 5: Creating Admin Users...');
        $this->call(AdminUserSeeder::class);
        $this->command->newLine();

        $this->command->info('✅ All seeders completed successfully!');
        $this->command->info('🚀 RESPONTA Phase 5 - RBAC System is ready!');
    }
}
