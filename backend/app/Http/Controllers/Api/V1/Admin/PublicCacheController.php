<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Support\PublicContentCache;
use Illuminate\Http\JsonResponse;

class PublicCacheController extends Controller
{
    public function clear(PublicContentCache $publicContentCache): JsonResponse
    {
        return response()->json([
            'message' => 'Public website content cache cleared.',
            'data' => [
                'cleared_at' => $publicContentCache->clear(),
            ],
        ]);
    }
}
