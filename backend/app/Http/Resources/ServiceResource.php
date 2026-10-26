<?php

namespace App\Http\Resources;

use App\Support\PublicMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'intro' => $this->intro,
            'icon' => $this->icon,
            'heroImage' => PublicMediaUrl::resolve($this->hero_image),
            'category' => $this->whenLoaded('category', fn () => [
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'capabilities' => $this->capabilities ?? [],
            'deliverables' => $this->deliverables ?? [],
            'benefits' => $this->benefits ?? [],
            'faqs' => $this->faqs ?? [],
        ];
    }
}
