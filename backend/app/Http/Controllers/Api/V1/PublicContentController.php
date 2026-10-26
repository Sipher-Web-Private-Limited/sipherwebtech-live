<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonResource;
use App\Http\Resources\ServiceCategoryResource;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\SiteProfileResource;
use App\Models\Person;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\SiteProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicContentController extends Controller
{
    public function content(): JsonResponse
    {
        $profile = SiteProfile::query()->firstOrFail();
        $categories = ServiceCategory::query()
            ->where('is_published', true)
            ->with(['services' => fn ($query) => $query->where('is_published', true)])
            ->orderBy('sort_order')
            ->get();
        $people = Person::query()
            ->where('is_published', true)
            ->orderBy('profile_type')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => [
                'profile' => (new SiteProfileResource($profile))->resolve(request()),
                'categories' => ServiceCategoryResource::collection($categories)->resolve(request()),
                'people' => PersonResource::collection($people)->resolve(request()),
            ],
        ]);
    }

    public function siteProfile(): SiteProfileResource
    {
        return new SiteProfileResource(SiteProfile::query()->firstOrFail());
    }

    public function serviceCategories(): AnonymousResourceCollection
    {
        $categories = ServiceCategory::query()
            ->where('is_published', true)
            ->with(['services' => fn ($query) => $query->where('is_published', true)])
            ->orderBy('sort_order')
            ->get();

        return ServiceCategoryResource::collection($categories);
    }

    public function service(Service $service): ServiceResource
    {
        abort_unless(
            $service->is_published && $service->category()->where('is_published', true)->exists(),
            404,
        );

        return new ServiceResource($service->load('category'));
    }

    public function teamMembers(): AnonymousResourceCollection
    {
        return PersonResource::collection(
            Person::query()
                ->where('profile_type', 'team')
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->get(),
        );
    }

    public function leadership(): AnonymousResourceCollection
    {
        return PersonResource::collection(
            Person::query()
                ->where('profile_type', 'leadership')
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->get(),
        );
    }
}
