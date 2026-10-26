<?php

namespace Tests\Feature;

use App\Models\ContentLibraryItem;
use App\Models\User;
use Database\Seeders\ContentLibrarySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ContentLibraryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_legacy_content_seed_creates_unpublished_editable_records_idempotently(): void
    {
        $this->seed(ContentLibrarySeeder::class);

        $this->assertDatabaseCount('content_library_items', 24);
        $this->assertDatabaseHas('content_library_items', [
            'type' => 'blog',
            'slug' => 'top-10-web-development-trends-2025',
            'is_published' => false,
        ]);
        $this->assertDatabaseHas('content_library_items', [
            'type' => 'portfolio',
            'slug' => 'corporate-website-technova',
            'is_published' => false,
        ]);
        $this->assertDatabaseHas('content_library_items', [
            'type' => 'product',
            'slug' => 'healthcare-platforms',
            'is_published' => false,
        ]);

        $this->seed(ContentLibrarySeeder::class);
        $this->assertDatabaseCount('content_library_items', 24);
    }

    public function test_public_content_library_only_exposes_published_items(): void
    {
        ContentLibraryItem::query()->create([
            'type' => 'blog',
            'slug' => 'published-article',
            'title' => 'Published article',
            'summary' => 'A public summary.',
            'category' => 'Technology',
            'content' => ['date' => '2026-10-17', 'sections' => []],
            'is_published' => true,
        ]);
        ContentLibraryItem::query()->create([
            'type' => 'blog',
            'slug' => 'draft-article',
            'title' => 'Draft article',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/content-library/blog')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'published-article')
            ->assertJsonPath('data.0.date', '2026-10-17');

        $this->getJson('/api/v1/content-library/blog/draft-article')->assertNotFound();
    }

    public function test_authenticated_admin_can_create_update_and_delete_library_content(): void
    {
        Storage::fake('public');
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $created = $this->post('/api/v1/admin/content-library', [
            'type' => 'blog',
            'slug' => 'cms-article',
            'title' => 'CMS article',
            'summary' => 'An editable article.',
            'category' => 'Technology',
            'content' => '{"date":"2026-10-17","readTime":4,"sections":[]}',
            'sort_order' => 0,
            'is_published' => '1',
            'image_file' => UploadedFile::fake()->image('article.png'),
        ])->assertCreated();

        $id = $created->json('data.id');
        $imagePath = $created->json('data.image_path');
        Storage::disk('public')->assertExists($imagePath);

        $this->getJson('/api/v1/content-library/blog/cms-article')
            ->assertOk()
            ->assertJsonPath('data.title', 'CMS article')
            ->assertJsonPath('data.date', '2026-10-17')
            ->assertJsonPath('data.image', Storage::disk('public')->url($imagePath));

        $this->putJson("/api/v1/admin/content-library/{$id}", [
            'type' => 'portfolio',
            'slug' => 'cms-article',
            'title' => 'Updated content',
            'summary' => 'Updated summary.',
            'category' => 'Web Development',
            'content' => ['tag' => 'Website'],
            'sort_order' => 1,
            'is_published' => true,
        ])->assertOk()
            ->assertJsonPath('data.type', 'portfolio')
            ->assertJsonPath('data.title', 'Updated content');

        $this->deleteJson("/api/v1/admin/content-library/{$id}")->assertOk();
        $this->assertDatabaseMissing('content_library_items', ['id' => $id]);
    }

    public function test_content_library_requires_admin_and_valid_content_objects(): void
    {
        $payload = [
            'type' => 'blog',
            'slug' => 'invalid-content',
            'title' => 'Invalid content',
            'content' => '[]',
            'sort_order' => 0,
        ];

        $this->postJson('/api/v1/admin/content-library', $payload)->assertUnauthorized();
        $this->actingAs(User::factory()->create(['is_admin' => true]))
            ->postJson('/api/v1/admin/content-library', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors('content');

        $this->post('/api/v1/admin/content-library', [
            'type' => 'product',
            'slug' => 'empty-json-object',
            'title' => 'Valid empty content',
            'content' => '{}',
            'sort_order' => 0,
        ])->assertCreated()
            ->assertJsonPath('data.content', []);

        $this->postJson('/api/v1/admin/content-library', [
            'type' => 'product',
            'slug' => 'empty-json-body',
            'title' => 'Valid empty JSON object',
            'content' => (object) [],
            'sort_order' => 1,
        ])->assertCreated()
            ->assertJsonPath('data.title', 'Valid empty JSON object');
    }
}
