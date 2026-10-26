<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $credentials = config('cms.admin');
        $validator = Validator::make($credentials, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            throw new InvalidArgumentException(
                'Set CMS_ADMIN_NAME, CMS_ADMIN_EMAIL, and a non-empty CMS_ADMIN_PASSWORD in the backend environment before seeding.',
            );
        }

        User::query()->updateOrCreate(
            ['email' => strtolower(trim($credentials['email']))],
            [
                'name' => trim($credentials['name']),
                'email_verified_at' => now(),
                'password' => Hash::make($credentials['password']),
                'is_admin' => true,
            ],
        );
    }
}
