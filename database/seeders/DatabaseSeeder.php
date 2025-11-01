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
        $this->command->info('🌱 Starting RESPONTA Database Seeding...');
        $this->command->newLine();

        // Seed kategori aduan first (master data)
        $this->call(KategoriAduanSeeder::class);
        $this->command->newLine();

        // Seed users
        $this->call(UserSeeder::class);
        $this->command->newLine();

        $this->command->info('✅ All seeders completed successfully!');
        $this->command->info('🚀 RESPONTA is ready for development!');
    }
}
