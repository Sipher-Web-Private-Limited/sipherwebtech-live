<?php

namespace App\Http\Middleware;

use App\Support\PublicContentCache;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CachePublicContent
{
    public function __construct(private readonly PublicContentCache $publicContentCache) {}

    public function handle(Request $request, Closure $next): Response
    {
        $version = $this->publicContentCache->version();
        $key = 'public-content-cache:'.$version.':'.hash('sha256', $request->fullUrl());
        $store = Cache::store('public_content');
        $cached = $store->get($key);

        if (is_array($cached) && isset($cached['body'], $cached['content_type'])) {
            return response($cached['body'], 200, [
                'Content-Type' => $cached['content_type'],
                'Cache-Control' => 'no-store, private',
                'X-Public-Cache' => 'HIT',
            ]);
        }

        $response = $next($request);
        $body = $response->getContent();

        if ($response->getStatusCode() === Response::HTTP_OK
            && is_string($body)
            && $this->publicContentCache->version() === $version) {
            $contentType = $response->headers->get('Content-Type');

            if ($contentType !== null) {
                $store->put($key, [
                    'body' => $body,
                    'content_type' => $contentType,
                ], now()->addHours(24));
            }
        }

        $response->headers->set('Cache-Control', 'no-store, private');
        $response->headers->set('X-Public-Cache', 'MISS');

        return $response;
    }
}
