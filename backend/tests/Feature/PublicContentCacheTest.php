<?php

namespace Tests\Feature;

use App\Models\User;
use App\Support\PublicContentCache;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class PublicContentCacheTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['cache.stores.public_content.driver' => 'array']);
        $this->app->make(PublicContentCache::class)->clear();
    }

    public function test_public_content_is_cached_for_no_more_than_24_hours(): void
    {
        $this->getJson('/api/v1/team-members')
            ->assertOk()
            ->assertHeader('X-Public-Cache', 'MISS');

        $this->getJson('/api/v1/team-members')
            ->assertOk()
            ->assertHeader('X-Public-Cache', 'HIT');

        try {
            Carbon::setTestNow(now()->addHours(24)->addSecond());

            $this->getJson('/api/v1/team-members')
                ->assertOk()
                ->assertHeader('X-Public-Cache', 'MISS');
        } finally {
            Carbon::setTestNow();
        }
    }

    public function test_failed_public_responses_are_not_cached(): void
    {
        $this->getJson('/api/v1/site-profile')
            ->assertNotFound()
            ->assertHeader('X-Public-Cache', 'MISS');

        $this->getJson('/api/v1/site-profile')
            ->assertNotFound()
            ->assertHeader('X-Public-Cache', 'MISS');
    }

    public function test_successful_admin_content_edits_invalidate_public_content_cache(): void
    {
        $this->getJson('/api/v1/team-members')
            ->assertOk()
            ->assertHeader('X-Public-Cache', 'MISS');

        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin)
            ->putJson('/api/v1/admin/profile', [
                'name' => 'Updated company',
                'brand_name' => 'Updated brand',
                'email' => 'hello@example.test',
            ])
            ->assertOk();

        $this->getJson('/api/v1/team-members')
            ->assertOk()
            ->assertHeader('X-Public-Cache', 'MISS');
    }

    public function test_manual_cache_clear_requires_an_admin_and_invalidates_cached_content(): void
    {
        $this->postJson('/api/v1/admin/cache/clear')->assertUnauthorized();

        $this->getJson('/api/v1/team-members')
            ->assertOk()
            ->assertHeader('X-Public-Cache', 'MISS');
        $this->getJson('/api/v1/team-members')
            ->assertOk()
            ->assertHeader('X-Public-Cache', 'HIT');

        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin)
            ->postJson('/api/v1/admin/cache/clear')
            ->assertOk()
            ->assertJsonPath('message', 'Public website content cache cleared.');

        $this->getJson('/api/v1/team-members')
            ->assertOk()
            ->assertHeader('X-Public-Cache', 'MISS');
    }
}
