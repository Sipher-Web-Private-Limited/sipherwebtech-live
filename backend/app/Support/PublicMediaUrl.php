<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class PublicMediaUrl
{
    public static function resolve(?string $path): ?string
    {
        if ($path === null || trim($path) === '') {
            return null;
        }

        if (preg_match('/^https?:\/\//i', $path) === 1 || str_starts_with($path, '/')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
