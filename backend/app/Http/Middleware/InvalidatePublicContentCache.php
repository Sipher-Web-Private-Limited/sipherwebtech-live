<?php

namespace App\Http\Middleware;

use App\Support\PublicContentCache;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InvalidatePublicContentCache
{
    public function __construct(private readonly PublicContentCache $publicContentCache) {}

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response->isSuccessful()) {
            $this->publicContentCache->clear();
        }

        return $response;
    }
}
