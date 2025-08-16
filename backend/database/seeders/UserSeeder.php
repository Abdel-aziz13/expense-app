<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin CM',
            'email' => 'admin@local.cm',
            'phone' => '696106676',
            'password' => Hash::make('Password@1', [
                'rounds' => 12,
            ]),
            'role' => 'admin',
            'currency' => 'FCFA',
        ]);
    }
}
