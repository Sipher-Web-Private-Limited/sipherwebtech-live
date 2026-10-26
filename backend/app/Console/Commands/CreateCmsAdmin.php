<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateCmsAdmin extends Command
{
    protected $signature = 'cms:make-admin';

    protected $description = 'Create or promote a user who can access the CMS dashboard';

    public function handle(): int
    {
        $name = trim((string) $this->ask('Administrator name'));
        $email = strtolower(trim((string) $this->ask('Administrator email')));
        $password = (string) $this->secret('Password');
        $confirmation = (string) $this->secret('Confirm password');

        if ($name === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $this->error('A name and valid email address are required.');

            return self::FAILURE;
        }

        if ($password === '' || ! hash_equals($password, $confirmation)) {
            $this->error('Passwords must match and cannot be empty.');

            return self::FAILURE;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'email_verified_at' => now(),
                'password' => Hash::make($password),
                'is_admin' => true,
            ],
        );

        $this->info("Administrator access is enabled for {$email}.");

        return self::SUCCESS;
    }
}
