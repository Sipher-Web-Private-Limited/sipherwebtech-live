<?php

namespace App\Http\Resources;

use App\Support\PublicMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'title' => $this->name,
            'slug' => $this->slug,
            'number' => $this->number,
            'statement' => $this->statement,
            'description' => $this->description,
            'icon' => $this->icon,
            'imagePath' => PublicMediaUrl::resolve($this->image_path),
            'services' => $this->whenLoaded(
                'services',
                fn () => ServiceResource::collection($this->services),
            ),
        ];
    }
}
