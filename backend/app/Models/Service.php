<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_category_id',
        'title',
        'slug',
        'description',
        'intro',
        'icon',
        'hero_image',
        'capabilities',
        'deliverables',
        'benefits',
        'faqs',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'capabilities' => 'array',
            'deliverables' => 'array',
            'benefits' => 'array',
            'faqs' => 'array',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }
}
