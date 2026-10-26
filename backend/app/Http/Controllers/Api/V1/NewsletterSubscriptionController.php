<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class NewsletterSubscriptionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email:rfc', 'max:255'],
        ]);

        if (! Schema::hasTable('newsletter_subscribers')) {
            return $this->storageNotReady();
        }

        try {
            $subscriber = NewsletterSubscriber::query()->firstOrCreate([
                'email' => mb_strtolower(trim($validated['email'])),
            ]);
        } catch (QueryException $exception) {
            Log::error('Newsletter subscription could not be stored.', [
                'exception' => $exception,
            ]);

            return response()->json([
                'message' => 'We could not save your subscription right now. Please try again later.',
            ], 503);
        }

        return response()->json([
            'message' => $subscriber->wasRecentlyCreated
                ? 'Thanks for subscribing to our newsletter.'
                : 'This email is already subscribed.',
            'data' => ['subscribed' => true],
        ], $subscriber->wasRecentlyCreated ? 201 : 200);
    }

    public function index(): JsonResponse
    {
        if (! Schema::hasTable('newsletter_subscribers')) {
            return $this->storageNotReady();
        }

        try {
            $subscribers = NewsletterSubscriber::query()->latest()->get();
        } catch (QueryException $exception) {
            Log::error('Newsletter subscribers could not be loaded for the admin inbox.', [
                'exception' => $exception,
            ]);

            return response()->json([
                'message' => 'The newsletter subscriber list is temporarily unavailable. Please try again later.',
            ], 503);
        }

        return response()->json([
            'data' => $subscribers,
        ]);
    }

    private function storageNotReady(): JsonResponse
    {
        return response()->json([
            'message' => 'Newsletter storage is not set up yet. Run `php artisan migrate` from the backend folder, then reload this page.',
            'code' => 'newsletter_subscribers_migration_required',
        ], 503);
    }
}
