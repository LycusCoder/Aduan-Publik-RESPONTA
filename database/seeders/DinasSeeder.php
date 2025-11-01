<?php

namespace Database\Seeders;

use App\Models\Dinas;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class DinasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Kota Tegal organization
        $kotaTegal = Organization::where('type', 'kota')->where('code', '3376')->first();

        if (!$kotaTegal) {
            $this->command->error('⚠️  Kota Tegal tidak ditemukan! Run OrganizationSeeder terlebih dahulu.');
            return;
        }

        $dinasData = [
            [
                'name' => 'Dinas Pekerjaan Umum dan Penataan Ruang',
                'code' => 'DPU',
                'description' => 'Menangani infrastruktur jalan, jembatan, saluran air, dan penataan ruang',
                'phone' => '(0283) 351234',
                'email' => 'dpu@tegalkota.go.id',
                'address' => 'Jl. Sukarso No. 15, Kota Tegal',
            ],
            [
                'name' => 'Dinas Perhubungan',
                'code' => 'DISHUB',
                'description' => 'Menangani lampu lalu lintas, rambu jalan, terminal, dan parkir',
                'phone' => '(0283) 352345',
                'email' => 'dishub@tegalkota.go.id',
                'address' => 'Jl. Veteran No. 22, Kota Tegal',
            ],
            [
                'name' => 'Dinas Lingkungan Hidup',
                'code' => 'DLH',
                'description' => 'Menangani kebersihan, sampah, taman kota, dan lingkungan hidup',
                'phone' => '(0283) 353456',
                'email' => 'dlh@tegalkota.go.id',
                'address' => 'Jl. Pancasila No. 8, Kota Tegal',
            ],
            [
                'name' => 'Dinas Sosial',
                'code' => 'DINSOS',
                'description' => 'Menangani masalah sosial masyarakat, kemiskinan, dan bantuan sosial',
                'phone' => '(0283) 354567',
                'email' => 'dinsos@tegalkota.go.id',
                'address' => 'Jl. Dr. Sutomo No. 11, Kota Tegal',
            ],
            [
                'name' => 'Dinas Perumahan dan Kawasan Permukiman',
                'code' => 'DPKP',
                'description' => 'Menangani perumahan, air bersih, sanitasi, dan permukiman',
                'phone' => '(0283) 355678',
                'email' => 'dpkp@tegalkota.go.id',
                'address' => 'Jl. HOS Cokroaminoto No. 19, Kota Tegal',
            ],
            [
                'name' => 'Satuan Polisi Pamong Praja',
                'code' => 'SATPOL_PP',
                'description' => 'Menangani ketertiban umum, pedagang kaki lima, dan penegakan perda',
                'phone' => '(0283) 356789',
                'email' => 'satpolpp@tegalkota.go.id',
                'address' => 'Jl. Werkudara No. 5, Kota Tegal',
            ],
        ];

        foreach ($dinasData as $dinas) {
            Dinas::create([
                'organization_id' => $kotaTegal->id,
                'name' => $dinas['name'],
                'code' => $dinas['code'],
                'description' => $dinas['description'],
                'phone' => $dinas['phone'],
                'email' => $dinas['email'],
                'address' => $dinas['address'],
                'is_active' => true,
            ]);
        }

        $this->command->info('✅ ' . count($dinasData) . ' dinas berhasil dibuat!');
        $this->command->info('   - DPU, DISHUB, DLH, DINSOS, DPKP, SATPOL_PP');
    }
}
