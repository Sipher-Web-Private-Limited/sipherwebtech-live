<?php

namespace App\Http\Resources;

use App\Support\PublicMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $phone = trim(($this->phone_country_code ?? '').' '.($this->phone_number ?? ''));
        $internationalNumber = preg_replace('/\D+/', '', $phone) ?? '';
        $whatsappNumber = trim($this->whatsapp_number ?: $phone);
        $internationalWhatsappNumber = preg_replace('/\D+/', '', $whatsappNumber) ?? '';

        return [
            'name' => $this->name,
            'brandName' => $this->brand_name,
            'logoUrl' => PublicMediaUrl::resolve($this->logo_path),
            'faviconUrl' => PublicMediaUrl::resolve($this->favicon_path),
            'loaderImageUrl' => PublicMediaUrl::resolve($this->loader_image_path),
            'brochureUrl' => PublicMediaUrl::resolve($this->brochure_path),
            'brochureName' => $this->brochure_name,
            'brochureEnabled' => (bool) ($this->brochure_enabled ?? true),
            'tagline' => $this->tagline,
            'website' => $this->website,
            'email' => $this->email,
            'businessHours' => $this->business_hours,
            'phone' => [
                'display' => $phone,
                'telUrl' => 'tel:'.str_replace(' ', '', $phone),
                'whatsappUrl' => $internationalNumber === '' ? null : 'https://wa.me/'.$internationalNumber,
            ],
            'whatsapp' => [
                'display' => $whatsappNumber,
                'url' => $internationalWhatsappNumber === '' ? null : 'https://wa.me/'.$internationalWhatsappNumber,
            ],
            'address' => $this->address,
            'locationLabel' => $this->location_label,
            'maps' => [
                'locationUrl' => $this->map_location_url,
                'directionsUrl' => $this->map_directions_url,
                'coordinates' => [
                    'latitude' => $this->latitude,
                    'longitude' => $this->longitude,
                ],
            ],
            'socials' => $this->socials ?? [],
            'about' => $this->about_content ?? [],
        ];
    }
}
