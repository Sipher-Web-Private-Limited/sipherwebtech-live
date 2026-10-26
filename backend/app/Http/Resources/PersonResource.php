<?php

namespace App\Http\Resources;

use App\Support\PublicMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'profileType' => $this->profile_type,
            'slug' => $this->slug,
            'name' => $this->name,
            'role' => $this->role,
            'photo' => PublicMediaUrl::resolve($this->photo),
            'details' => $this->details,
            'messageTitle' => $this->message_title,
            'message' => $this->message,
            'bio' => $this->bio,
        ];
    }
}
