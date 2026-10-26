<?php

namespace Tests\Feature;

use App\Models\NewsletterSubscriber;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsletterSubscriptionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_email_is_normalized_and_saved_once(): void
    {
        $this->postJson('/api/v1/newsletter-subscriptions', [
            'email' => 'Reader@Example.test',
        ])
            ->assertCreated()
            ->assertJsonPath('message', 'Thanks for subscribing to our newsletter.')
            ->assertJsonPath('data.subscribed', true);

        $this->postJson('/api/v1/newsletter-subscriptions', [
            'email' => 'reader@example.test',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'This email is already subscribed.');

        $this->assertDatabaseCount('newsletter_subscribers', 1);
        $this->assertDatabaseHas('newsletter_subscribers', ['email' => 'reader@example.test']);
    }

    public function test_subscription_requires_a_valid_email_address(): void
    {
        foreach (['', 'not-an-email', 'reader@', str_repeat('a', 250).'@example.test'] as $email) {
            $this->postJson('/api/v1/newsletter-subscriptions', ['email' => $email])
                ->assertUnprocessable()
                ->assertJsonValidationErrors(['email']);
        }

        $this->assertDatabaseCount('newsletter_subscribers', 0);
    }

    public function test_only_an_admin_can_view_newsletter_subscribers(): void
    {
        NewsletterSubscriber::query()->create(['email' => 'reader@example.test']);

        $this->getJson('/api/v1/admin/newsletter-subscribers')->assertUnauthorized();

        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin)
            ->getJson('/api/v1/admin/newsletter-subscribers')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.email', 'reader@example.test');
    }
}
