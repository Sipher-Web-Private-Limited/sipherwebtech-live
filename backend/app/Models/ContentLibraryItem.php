<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentLibraryItem extends Model
{
    protected $fillable = [
        'type',
        'slug',
        'title',
        'summary',
        'category',
        'image_path',
        'content',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }
}
