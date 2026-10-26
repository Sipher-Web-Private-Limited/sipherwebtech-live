<?php

use App\Http\Middleware\EnsureCmsAdmin;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
        $middleware->redirectGuestsTo('/admin/login/auth');
        $middleware->alias([
            'cms.admin' => EnsureCmsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
        $exceptions->render(function (ThrottleRequestsException $exception, Request $request) {
            if (! $request->is('api/v1/admin/login') && ! $request->is('api/v1/contact-enquiries') && ! $request->is('api/v1/newsletter-subscriptions')) {
                return null;
            }

            $headers = $exception->getHeaders();
            $retryAfter = max(1, (int) ($headers['Retry-After'] ?? 60));
            $message = $request->is('api/v1/contact-enquiries')
                ? "You've reached the submission limit. Please try again in {$retryAfter} seconds."
                : ($request->is('api/v1/newsletter-subscriptions')
                    ? "You've reached the subscription limit. Please try again in {$retryAfter} seconds."
                    : "Too many sign-in attempts. Try again in {$retryAfter} seconds.");

            return response()->json([
                'message' => $message,
                'retry_after' => $retryAfter,
            ], 429, $headers);
        });
    })->create();
