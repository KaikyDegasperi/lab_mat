<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        Activity::firstOrCreate(
            ['slug' => 'hanoi'],
            ['name' => 'Torre de Hanói', 'type' => 'hanoi'],
        );

        Activity::firstOrCreate(
            ['slug' => 'tangram'],
            ['name' => 'Tangram', 'type' => 'tangram'],
        );

        $teacher = User::firstOrCreate(
            ['email' => 'professor@labmat.test'],
            [
                'type' => 'teacher',
                'name' => 'Professor Demo',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );

        SchoolClass::firstOrCreate(
            ['code' => 'MAT2026'],
            ['teacher_id' => $teacher->id, 'name' => '8º Ano A'],
        );
    }
}
