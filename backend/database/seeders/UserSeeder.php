<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin CM',
                'email' => 'admin@local.cm',
                'phone' => '696106676',
                'role' => 'admin',
            ],
            [
                'name' => 'Abdel Aziz',
                'email' => 'abdel@gmail.com',
                'phone' => '697000000',
                'role' => 'user',
            ]
        ];

        foreach ($users as $u) {
            $existingUser = User::where('email', $u['email'])->first();

            if (!$existingUser) {
                User::create([
                    'name' => $u['name'],
                    'email' => $u['email'],
                    'phone' => $u['phone'],
                    'photo' => 'avatars/default.jpg',
                    'about' => $u['role'] === 'admin' ? 'Administrateur principal du système' : 'Utilisateur standard',
                    'profession' => $u['role'] === 'admin' ? 'Administrateur' : 'Développeur',
                    'password' => Hash::make('Password@1', ['rounds' => 12]),
                    'role' => $u['role'],
                    'currency' => 'FCFA',
                    'language' => 'fr',
                    'email_verified_at' => now(),
                    'verification_code' => null,
                ]);
            }
        }
    }
}
