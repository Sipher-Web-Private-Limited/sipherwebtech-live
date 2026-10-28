<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use RuntimeException;

class PublicContentCache
{
    private const VERSION_KEY = 'public-content-cache:version';

    public function version(): string
    {
        return Cache::store('public_content')->rememberForever(
            self::VERSION_KEY,
            fn (): string => (string) Str::uuid(),
        );
    }

    public function clear(): string
    {
        $store = Cache::store('public_content');
        $this->version();

        if (! $store->flush()) {
            throw new RuntimeException('The isolated public content cache could not be cleared.');
        }

        $store->forever(self::VERSION_KEY, (string) Str::uuid());

        return now()->toIso8601String();
    }
}
