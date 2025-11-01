<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Budi Santoso',
                'no_hp' => '081234567890',
                'nik' => '3201234567890001',
                'password' => Hash::make('password123'),
            ],
            [
                'name' => 'Siti Nurhaliza',
                'no_hp' => '081234567891',
                'nik' => '3201234567890002',
                'password' => Hash::make('password123'),
            ],
            [
                'name' => 'Ahmad Dhani',
                'no_hp' => '081234567892',
                'nik' => '3201234567890003',
                'password' => Hash::make('password123'),
            ],
            [
                'name' => 'Dewi Lestari',
                'no_hp' => '081234567893',
                'nik' => '3201234567890004',
                'password' => Hash::make('password123'),
            ],
            [
                'name' => 'Rizky Febian',
                'no_hp' => '081234567894',
                'nik' => '3201234567890005',
                'password' => Hash::make('password123'),
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        $this->command->info('✅ Users seeded successfully! Total: ' . count($users) . ' users');
        $this->command->info('📱 Login credentials:');
        $this->command->info('   No HP: 081234567890 | Password: password123');
    }
}
