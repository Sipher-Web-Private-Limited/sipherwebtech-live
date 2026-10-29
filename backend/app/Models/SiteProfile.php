<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand_name',
        'logo_path',
        'favicon_path',
        'loader_image_path',
        'brochure_path',
        'brochure_name',
        'brochure_enabled',
        'external_leads_enabled',
        'external_leads_url',
        'external_leads_key',
        'tagline',
        'website',
        'email',
        'phone_country_code',
        'phone_number',
        'whatsapp_number',
        'business_hours',
        'address',
        'location_label',
        'map_location_url',
        'map_directions_url',
        'latitude',
        'longitude',
        'socials',
        'about_content',
        'approved_clients',
    ];

    protected function casts(): array
    {
        return [
            'brochure_enabled' => 'boolean',
            'external_leads_enabled' => 'boolean',
            'latitude' => 'float',
            'longitude' => 'float',
            'socials' => 'array',
            'about_content' => 'array',
            'approved_clients' => 'array',
        ];
    }
}
