<?php

namespace Database\Seeders;

use App\Models\ContentLibraryItem;
use Illuminate\Database\Seeder;
use RuntimeException;

class ContentLibrarySeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/content-library.json');
        $contents = file_get_contents($path);
        if ($contents === false) {
            throw new RuntimeException('Could not read the content library seed data.');
        }

        $items = json_decode($contents, true, 512, JSON_THROW_ON_ERROR);
        $orders = [];
        foreach ($items as $item) {
            $type = $item['type'];
            $order = $orders[$type] ?? 0;
            ContentLibraryItem::query()->updateOrCreate(
                ['type' => $type, 'slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'summary' => $item['summary'] ?? null,
                    'category' => $item['category'] ?? null,
                    'image_path' => $item['image_path'] ?? null,
                    'content' => $item['content'] ?? [],
                    'sort_order' => $order,
                    'is_published' => true,
                ],
            );
            $orders[$type] = $order + 1;
        }
    }
}
