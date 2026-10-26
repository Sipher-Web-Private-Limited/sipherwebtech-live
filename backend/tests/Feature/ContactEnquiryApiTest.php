<?php

namespace Tests\Feature;

use App\Models\ContactEnquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ContactEnquiryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_contact_enquiry_with_an_other_service_is_saved_without_a_country_code(): void
    {
        $this->postJson('/api/v1/contact-enquiries', [
            'name' => 'Test Visitor',
            'email' => 'visitor@example.test',
            'phone' => '9876543210',
            'service' => 'Other: Accessibility audit',
            'message' => 'We would like to discuss a new website project.',
        ])
            ->assertCreated()
            ->assertJsonPath('message', 'Your enquiry has been submitted.');

        $this->assertDatabaseHas('contact_enquiries', [
            'email' => 'visitor@example.test',
            'phone' => '9876543210',
            'service' => 'Other: Accessibility audit',
        ]);
    }

    public function test_contact_enquiry_forwards_to_external_website_when_configured(): void
    {
        Http::fake([
            'https://external-crm.test/api/leads' => Http::response(['success' => true], 200),
        ]);

        Config::set('services.external_leads.url', 'https://external-crm.test/api/leads');
        Config::set('services.external_leads.key', 'secret-key-123');

        $this->postJson('/api/v1/contact-enquiries', [
            'name' => 'Forward Test',
            'email' => 'forward@example.test',
            'phone' => '9876543210',
            'service' => 'Web Development',
            'message' => 'Please forward this enquiry to the external CRM system.',
        ])
            ->assertCreated()
            ->assertJsonPath('message', 'Your enquiry has been submitted.');

        // Verify locally saved in DB
        $this->assertDatabaseHas('contact_enquiries', [
            'email' => 'forward@example.test',
        ]);

        // Verify forwarded to external URL with Bearer token & correct payload
        Http::assertSent(function (\Illuminate\Http\Client\Request $request) {
            return $request->url() === 'https://external-crm.test/api/leads'
                && $request->hasHeader('Authorization', 'Bearer secret-key-123')
                && $request['name'] === 'Forward Test'
                && $request['email'] === 'forward@example.test'
                && $request['phone'] === '9876543210'
                && $request['service'] === 'Web Development'
                && $request['source'] === 'sipherwebtech';
        });
    }

    public function test_contact_enquiry_validates_email_and_alphanumeric_phone_on_the_backend(): void
    {
        $validData = [
            'name' => 'Test Visitor',
            'email' => 'visitor@example.test',
            'phone' => '9876543210',
            'message' => 'We would like to discuss a new website project.',
        ];

        foreach ([
            [['email' => 'not-an-email'], 'email'],
            [['phone' => '987654321-'], 'phone'],
            [['phone' => '+919876543210'], 'phone'],
            [['phone' => str_repeat('a', 33)], 'phone'],
        ] as [$invalidFields, $fields]) {
            $this->postJson('/api/v1/contact-enquiries', [...$validData, ...$invalidFields])
                ->assertUnprocessable()
                ->assertJsonValidationErrors($fields);
        }

        $this->postJson('/api/v1/contact-enquiries', [...$validData, 'phone' => 'Sipher2026'])
            ->assertCreated();

        $this->postJson('/api/v1/contact-enquiries', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'phone', 'message']);
        $this->assertDatabaseCount('contact_enquiries', 1);
    }

    public function test_contact_enquiries_are_only_visible_to_authenticated_admins(): void
    {
        ContactEnquiry::query()->create([
            'name' => 'Test Visitor',
            'email' => 'visitor@example.test',
            'phone' => '9876543210',
            'service' => null,
            'message' => 'We would like to discuss a new website project.',
        ]);

        $this->getJson('/api/v1/admin/contact-enquiries')->assertUnauthorized();

        $admin = User::factory()->create([
            'email' => 'admin@example.test',
            'password' => Hash::make('correct-password'),
            'is_admin' => true,
        ]);
        $this->actingAs($admin)
            ->getJson('/api/v1/admin/contact-enquiries')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.email', 'visitor@example.test');
    }

    public function test_admin_inbox_reports_a_missing_migration_without_exposing_a_server_error(): void
    {
        Schema::drop('contact_enquiries');

        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->getJson('/api/v1/admin/contact-enquiries')
            ->assertStatus(503)
            ->assertJsonPath('code', 'contact_enquiries_migration_required')
            ->assertJsonPath('message', 'The enquiry inbox has not been set up yet. Run `php artisan migrate` from the backend folder, then reload this page.')
            ->assertDontSee('SQLSTATE')
            ->assertDontSee('select * from');
    }

    public function test_contact_rate_limit_is_scoped_to_browser_session_not_shared_ip(): void
    {
        $limiter = RateLimiter::limiter('contact-enquiries');
        $this->assertNotNull($limiter);

        $firstId = str_repeat('a', 40);
        $secondId = str_repeat('b', 40);

        $firstRequest = Request::create('/api/v1/contact-enquiries', 'POST', [], [], [], [
            'REMOTE_ADDR' => '192.168.1.38',
        ]);
        $firstSession = clone app('session')->driver();
        $firstSession->setId($firstId);
        $firstRequest->setLaravelSession($firstSession);

        $secondRequest = Request::create('/api/v1/contact-enquiries', 'POST', [], [], [], [
            'REMOTE_ADDR' => '192.168.1.38',
        ]);
        $secondSession = clone app('session')->driver();
        $secondSession->setId($secondId);
        $secondRequest->setLaravelSession($secondSession);

        $this->assertSame($firstId, $limiter($firstRequest)->key);
        $this->assertSame($secondId, $limiter($secondRequest)->key);
        $this->assertSame(10, $limiter($firstRequest)->maxAttempts);
    }

    public function test_admin_can_update_an_enquiry(): void
    {
        $enquiry = ContactEnquiry::query()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '1234567890',
            'service' => 'Web Development',
            'message' => 'Initial inquiry message details.',
        ]);

        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->putJson("/api/v1/admin/contact-enquiries/{$enquiry->id}", [
                'name' => 'Johnathan Doe',
                'email' => 'johnathan@example.com',
                'phone' => '+91 9876543210',
                'service' => 'UI/UX Design',
                'message' => 'Updated inquiry message with extra project specifications.',
            ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Johnathan Doe')
            ->assertJsonPath('data.email', 'johnathan@example.com')
            ->assertJsonPath('data.service', 'UI/UX Design');

        $this->assertDatabaseHas('contact_enquiries', [
            'id' => $enquiry->id,
            'name' => 'Johnathan Doe',
            'email' => 'johnathan@example.com',
        ]);
    }

    public function test_admin_can_delete_an_enquiry(): void
    {
        $enquiry = ContactEnquiry::query()->create([
            'name' => 'Spam Bot',
            'email' => 'spam@example.com',
            'phone' => '0000000000',
            'service' => null,
            'message' => 'Buy cheap links here now please.',
        ]);

        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->deleteJson("/api/v1/admin/contact-enquiries/{$enquiry->id}")
            ->assertOk();

        $this->assertDatabaseMissing('contact_enquiries', [
            'id' => $enquiry->id,
        ]);
    }
}
