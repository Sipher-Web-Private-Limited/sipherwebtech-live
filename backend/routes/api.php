<?php

use App\Http\Controllers\Api\V1\Admin\AdminCmsController;
use App\Http\Controllers\Api\V1\ContactEnquiryController;
use App\Http\Controllers\Api\V1\ContentLibraryController;
use App\Http\Controllers\Api\V1\NewsletterSubscriptionController;
use App\Http\Controllers\Api\V1\PublicContentController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:120,1')->group(function (): void {
    Route::get('/content', [PublicContentController::class, 'content']);
    Route::get('/content-library/{type}', [ContentLibraryController::class, 'index']);
    Route::get('/content-library/{type}/{slug}', [ContentLibraryController::class, 'show']);
    Route::get('/site-profile', [PublicContentController::class, 'siteProfile']);
    Route::get('/service-categories', [PublicContentController::class, 'serviceCategories']);
    Route::get('/services/{service:slug}', [PublicContentController::class, 'service']);
    Route::get('/team-members', [PublicContentController::class, 'teamMembers']);
    Route::get('/leadership', [PublicContentController::class, 'leadership']);
    Route::post('/contact-enquiries', [ContactEnquiryController::class, 'store'])->middleware('throttle:contact-enquiries');
    Route::post('/newsletter-subscriptions', [NewsletterSubscriptionController::class, 'store'])->middleware('throttle:10,1');

    Route::prefix('admin')->group(function (): void {
        Route::post('/login', [AdminCmsController::class, 'login'])->middleware('throttle:5,1,admin-login:');

        Route::middleware(['auth:sanctum', 'cms.admin'])->group(function (): void {
            Route::get('/me', [AdminCmsController::class, 'me']);
            Route::post('/logout', [AdminCmsController::class, 'logout']);
            Route::put('/account', [AdminCmsController::class, 'updateAccount']);

            Route::get('/profile', [AdminCmsController::class, 'profile']);
            Route::put('/profile', [AdminCmsController::class, 'updateProfile']);

            Route::get('/categories', [AdminCmsController::class, 'categories']);
            Route::post('/categories', [AdminCmsController::class, 'storeCategory']);
            Route::put('/categories/{category}', [AdminCmsController::class, 'updateCategory']);
            Route::delete('/categories/{category}', [AdminCmsController::class, 'deleteCategory']);

            Route::get('/services', [AdminCmsController::class, 'services']);
            Route::post('/services', [AdminCmsController::class, 'storeService']);
            Route::put('/services/{service}', [AdminCmsController::class, 'updateService']);
            Route::delete('/services/{service}', [AdminCmsController::class, 'deleteService']);

            Route::get('/people', [AdminCmsController::class, 'people']);
            Route::post('/people', [AdminCmsController::class, 'storePerson']);
            Route::put('/people/{person}', [AdminCmsController::class, 'updatePerson']);
            Route::delete('/people/{person}', [AdminCmsController::class, 'deletePerson']);

            Route::get('/contact-enquiries', [ContactEnquiryController::class, 'index']);
            Route::put('/contact-enquiries/{contactEnquiry}', [ContactEnquiryController::class, 'update']);
            Route::delete('/contact-enquiries/{contactEnquiry}', [ContactEnquiryController::class, 'destroy']);
            Route::get('/newsletter-subscribers', [NewsletterSubscriptionController::class, 'index']);
            Route::get('/content-library', [ContentLibraryController::class, 'adminIndex']);
            Route::post('/content-library', [ContentLibraryController::class, 'store']);
            Route::put('/content-library/{item}', [ContentLibraryController::class, 'update']);
            Route::delete('/content-library/{item}', [ContentLibraryController::class, 'destroy']);
        });
    });
});
