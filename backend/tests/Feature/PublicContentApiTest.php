<?php

namespace Tests\Feature;

use App\Models\Person;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\SiteProfile;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicContentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_site_profile_returns_company_and_about_content(): void
    {
        SiteProfile::query()->create([
            'name' => 'Example Company',
            'brand_name' => 'Example',
            'email' => 'hello@example.test',
            'phone_country_code' => '+91',
            'phone_number' => '1234567890',
            'whatsapp_number' => '+91 9876543210',
            'about_content' => ['headline' => 'A useful headline'],
        ]);

        $this->getJson('/api/v1/site-profile')
            ->assertOk()
            ->assertJsonPath('data.name', 'Example Company')
            ->assertJsonPath('data.phone.whatsappUrl', 'https://wa.me/911234567890')
            ->assertJsonPath('data.whatsapp.display', '+91 9876543210')
            ->assertJsonPath('data.whatsapp.url', 'https://wa.me/919876543210')
            ->assertJsonPath('data.about.headline', 'A useful headline');
    }

    public function test_categories_include_only_published_services_and_categories(): void
    {
        $category = ServiceCategory::query()->create([
            'name' => 'Technology',
            'slug' => 'technology',
            'is_published' => true,
        ]);
        Service::query()->create([
            'service_category_id' => $category->id,
            'title' => 'Published service',
            'slug' => 'published-service',
            'is_published' => true,
        ]);
        Service::query()->create([
            'service_category_id' => $category->id,
            'title' => 'Draft service',
            'slug' => 'draft-service',
            'is_published' => false,
        ]);
        ServiceCategory::query()->create([
            'name' => 'Hidden',
            'slug' => 'hidden',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/service-categories')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonCount(1, 'data.0.services')
            ->assertJsonPath('data.0.services.0.slug', 'published-service');
    }

    public function test_unpublished_service_is_not_publicly_accessible(): void
    {
        $category = ServiceCategory::query()->create([
            'name' => 'Technology',
            'slug' => 'technology',
            'is_published' => true,
        ]);
        Service::query()->create([
            'service_category_id' => $category->id,
            'title' => 'Draft service',
            'slug' => 'draft-service',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/services/draft-service')->assertNotFound();
    }

    public function test_published_service_is_hidden_when_its_category_is_unpublished(): void
    {
        $category = ServiceCategory::query()->create([
            'name' => 'Hidden',
            'slug' => 'hidden',
            'is_published' => false,
        ]);
        Service::query()->create([
            'service_category_id' => $category->id,
            'title' => 'Published service',
            'slug' => 'published-service',
            'is_published' => true,
        ]);

        $this->getJson('/api/v1/services/published-service')->assertNotFound();
    }

    public function test_people_endpoints_separate_team_members_from_leadership(): void
    {
        Person::query()->create([
            'profile_type' => 'team',
            'slug' => 'designer',
            'name' => 'A Designer',
            'role' => 'Designer',
            'is_published' => true,
        ]);
        Person::query()->create([
            'profile_type' => 'leadership',
            'slug' => 'director',
            'name' => 'A Director',
            'role' => 'Director',
            'is_published' => true,
        ]);

        $this->getJson('/api/v1/team-members')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'designer');

        $this->getJson('/api/v1/leadership')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'director');
    }

    public function test_combined_public_content_includes_published_people_categories_and_profile(): void
    {
        SiteProfile::query()->create([
            'name' => 'Example Company',
            'brand_name' => 'Example',
            'email' => 'hello@example.test',
        ]);
        Person::query()->create([
            'profile_type' => 'leadership',
            'slug' => 'director',
            'name' => 'A Director',
            'role' => 'Director',
            'bio' => 'A public biography.',
            'is_published' => true,
        ]);
        Person::query()->create([
            'profile_type' => 'team',
            'slug' => 'draft-person',
            'name' => 'Draft Person',
            'role' => 'Designer',
            'is_published' => false,
        ]);
        $category = ServiceCategory::query()->create([
            'name' => 'Technology',
            'slug' => 'technology',
            'is_published' => true,
        ]);
        Service::query()->create([
            'service_category_id' => $category->id,
            'title' => 'Web Development',
            'slug' => 'web-development',
            'is_published' => true,
        ]);

        $this->getJson('/api/v1/content')
            ->assertOk()
            ->assertJsonPath('data.profile.brandName', 'Example')
            ->assertJsonPath('data.categories.0.services.0.slug', 'web-development')
            ->assertJsonPath('data.people.0.slug', 'director')
            ->assertJsonPath('data.people.0.bio', 'A public biography.')
            ->assertJsonCount(1, 'data.people');
    }

    public function test_admin_can_upload_and_remove_company_brand_images(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin);

        $profileData = [
            'name' => 'Example Company',
            'brand_name' => 'Example',
            'email' => 'hello@example.test',
            'socials' => '[]',
            'about_content' => '{}',
        ];

        $uploadResponse = $this->withHeader('Accept', 'application/json')->post('/api/v1/admin/profile', [
            ...$profileData,
            '_method' => 'PUT',
            'logo_file' => UploadedFile::fake()->image('company-logo.png'),
            'favicon_file' => UploadedFile::fake()->image('company-favicon.png'),
            'loader_image_file' => UploadedFile::fake()->image('loading-image.png'),
        ]);
        $uploadResponse->assertOk();

        $logoPath = $uploadResponse->json('data.logo_path');
        $faviconPath = $uploadResponse->json('data.favicon_path');
        $loaderImagePath = $uploadResponse->json('data.loader_image_path');
        foreach ([$logoPath, $faviconPath, $loaderImagePath] as $path) {
            $this->assertIsString($path);
            Storage::disk('public')->assertExists($path);
        }
        $this->getJson('/api/v1/content')
            ->assertOk()
            ->assertJsonPath('data.profile.logoUrl', Storage::disk('public')->url($logoPath))
            ->assertJsonPath('data.profile.faviconUrl', Storage::disk('public')->url($faviconPath))
            ->assertJsonPath('data.profile.loaderImageUrl', Storage::disk('public')->url($loaderImagePath));

        $this->withHeader('Accept', 'application/json')->post('/api/v1/admin/profile', [
            ...$profileData,
            '_method' => 'PUT',
            'remove_logo' => '1',
            'remove_favicon' => '1',
            'remove_loader_image' => '1',
        ])->assertOk()
            ->assertJsonPath('data.logo_path', null)
            ->assertJsonPath('data.favicon_path', null)
            ->assertJsonPath('data.loader_image_path', null);
    }

    public function test_admin_can_upload_disable_and_remove_brochure(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin);

        $profileData = [
            'name' => 'Sipher Web Pvt. Ltd.',
            'brand_name' => 'Sipher Web',
            'email' => 'contact@example.test',
            'socials' => '[]',
            'about_content' => '{}',
        ];

        $brochureFile = UploadedFile::fake()->create('company-profile.pdf', 1024, 'application/pdf');
        $uploadResponse = $this->withHeader('Accept', 'application/json')->post('/api/v1/admin/profile', [
            ...$profileData,
            '_method' => 'PUT',
            'brochure_file' => $brochureFile,
            'brochure_enabled' => '1',
        ]);
        $uploadResponse->assertOk();
        $brochurePath = $uploadResponse->json('data.brochure_path');
        $this->assertIsString($brochurePath);
        $this->assertSame('company-profile.pdf', $uploadResponse->json('data.brochure_name'));
        $this->assertTrue($uploadResponse->json('data.brochure_enabled'));
        Storage::disk('public')->assertExists($brochurePath);

        $this->getJson('/api/v1/site-profile')
            ->assertOk()
            ->assertJsonPath('data.brochureUrl', Storage::disk('public')->url($brochurePath))
            ->assertJsonPath('data.brochureName', 'company-profile.pdf')
            ->assertJsonPath('data.brochureEnabled', true);

        $disableResponse = $this->putJson('/api/v1/admin/profile', [
            ...$profileData,
            'brochure_enabled' => false,
        ]);
        $disableResponse->assertOk();
        $this->assertFalse($disableResponse->json('data.brochure_enabled'));

        $this->getJson('/api/v1/site-profile')
            ->assertOk()
            ->assertJsonPath('data.brochureEnabled', false);

        $removeResponse = $this->withHeader('Accept', 'application/json')->post('/api/v1/admin/profile', [
            ...$profileData,
            '_method' => 'PUT',
            'remove_brochure' => '1',
        ]);
        $removeResponse->assertOk()
            ->assertJsonPath('data.brochure_path', null)
            ->assertJsonPath('data.brochure_name', null);

        $this->getJson('/api/v1/site-profile')
            ->assertOk()
            ->assertJsonPath('data.brochureUrl', null);
    }

    public function test_admin_can_update_external_leads_forwarding_settings(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin);

        $response = $this->putJson('/api/v1/admin/profile', [
            'name' => 'Sipher Web Technologies',
            'brand_name' => 'Sipher Web',
            'email' => 'hello@example.test',
            'external_leads_enabled' => true,
            'external_leads_url' => 'https://crm.external.test/api/leads',
            'external_leads_key' => 'crm-secret-token',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.external_leads_enabled', true)
            ->assertJsonPath('data.external_leads_url', 'https://crm.external.test/api/leads')
            ->assertJsonPath('data.external_leads_key', 'crm-secret-token');

        $this->assertDatabaseHas('site_profiles', [
            'external_leads_enabled' => true,
            'external_leads_url' => 'https://crm.external.test/api/leads',
            'external_leads_key' => 'crm-secret-token',
        ]);
    }

    public function test_admin_api_requires_authentication_and_signs_admin_in_and_out(): void
    {
        $this->getJson('/api/v1/admin/me')->assertUnauthorized();

        $admin = User::factory()->create([
            'email' => 'admin@example.test',
            'password' => Hash::make('correct-password'),
            'is_admin' => true,
        ]);

        $this->withHeader('Origin', 'http://localhost:8443')
            ->postJson('/api/v1/admin/login', [
                'email' => 'admin@example.test',
                'password' => 'correct-password',
            ])
            ->assertOk()
            ->assertJsonPath('data.user.email', 'admin@example.test');

        $this->getJson('/api/v1/admin/me')->assertOk()->assertJsonPath('data.user.id', $admin->id);
        $this->postJson('/api/v1/admin/logout')->assertOk();
        $this->getJson('/api/v1/admin/me')->assertUnauthorized();
    }

    public function test_regular_users_cannot_sign_in_to_admin_api(): void
    {
        User::factory()->create([
            'email' => 'user@example.test',
            'password' => Hash::make('correct-password'),
            'is_admin' => false,
        ]);

        $this->postJson('/api/v1/admin/login', [
            'email' => 'user@example.test',
            'password' => 'correct-password',
        ])->assertForbidden();
        $this->assertGuest();
    }

    public function test_login_rate_limit_shows_the_actual_retry_time(): void
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/v1/admin/login', [
                'email' => 'admin@example.test',
                'password' => 'wrong-password',
            ])->assertUnprocessable();
        }

        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@example.test',
            'password' => 'wrong-password',
        ]);

        $response->assertTooManyRequests()->assertJsonStructure(['message', 'retry_after']);
        $this->assertGreaterThan(0, $response->json('retry_after'));
        $this->assertStringContainsString('Try again in', $response->json('message'));
    }

    public function test_admin_can_update_account_name_email_and_password(): void
    {
        $admin = User::factory()->create([
            'name' => 'Old Admin',
            'email' => 'old-admin@example.test',
            'password' => Hash::make('current-password'),
            'is_admin' => true,
        ]);
        $this->actingAs($admin);

        $this->putJson('/api/v1/admin/account', [
            'name' => 'New Admin',
            'email' => 'new-admin@example.test',
            'current_password' => 'current-password',
            'new_password' => 'new-password',
            'new_password_confirmation' => 'new-password',
        ])
            ->assertOk()
            ->assertJsonPath('data.user.name', 'New Admin')
            ->assertJsonPath('data.user.email', 'new-admin@example.test')
            ->assertJsonMissingPath('data.user.password');

        $admin->refresh();
        $this->assertTrue(Hash::check('new-password', $admin->password));
        $this->assertFalse(Hash::check('current-password', $admin->password));
    }

    public function test_admin_account_password_change_requires_the_current_password(): void
    {
        $admin = User::factory()->create([
            'password' => Hash::make('current-password'),
            'is_admin' => true,
        ]);
        $this->actingAs($admin);

        $this->putJson('/api/v1/admin/account', [
            'name' => $admin->name,
            'email' => $admin->email,
            'current_password' => 'incorrect-password',
            'new_password' => 'new-password',
            'new_password_confirmation' => 'new-password',
        ])->assertUnprocessable()->assertJsonValidationErrors(['current_password']);

        $this->assertTrue(Hash::check('current-password', $admin->refresh()->password));
    }

    public function test_admin_can_sign_in_and_manage_cms_records_through_the_api(): void
    {
        User::factory()->create([
            'email' => 'admin@example.test',
            'password' => Hash::make('correct-password'),
            'is_admin' => true,
        ]);

        $this->withHeader('Origin', 'http://localhost:8443')->postJson('/api/v1/admin/login', [
            'email' => 'admin@example.test',
            'password' => 'correct-password',
        ])->assertOk();
        $this->assertAuthenticated();

        $this->postJson('/api/v1/admin/categories', [
            'name' => 'Design',
            'slug' => 'design',
            'sort_order' => 0,
            'is_published' => true,
        ])->assertCreated()->assertJsonPath('data.name', 'Design');

        $category = ServiceCategory::query()->where('slug', 'design')->firstOrFail();
        $this->postJson('/api/v1/admin/services', [
            'service_category_id' => $category->id,
            'title' => 'Product design',
            'slug' => 'product-design',
            'sort_order' => 0,
            'is_published' => true,
            'capabilities' => ['Research', 'Prototyping'],
            'faqs' => [['question' => 'What?', 'answer' => 'This.']],
        ])->assertCreated()->assertJsonPath('data.capabilities.0', 'Research');

        $this->assertDatabaseHas('services', [
            'slug' => 'product-design',
            'capabilities' => '["Research","Prototyping"]',
            'is_published' => true,
        ]);

        $this->putJson('/api/v1/admin/profile', [
            'name' => 'Sipher Web',
            'brand_name' => 'Sipher',
            'email' => 'hello@example.test',
            'phone_country_code' => '+91',
            'phone_number' => '1234567890',
            'whatsapp_number' => '+91 9876543210',
            'address' => 'Updated business address',
            'socials' => [['label' => 'LinkedIn', 'icon' => 'LinkedIn', 'href' => 'https://example.test']],
            'about_content' => ['headline' => 'Hello'],
        ])->assertOk()->assertJsonPath('data.brand_name', 'Sipher');

        $this->getJson('/api/v1/site-profile')
            ->assertOk()
            ->assertJsonPath('data.name', 'Sipher Web')
            ->assertJsonPath('data.email', 'hello@example.test')
            ->assertJsonPath('data.phone.display', '+91 1234567890')
            ->assertJsonPath('data.whatsapp.url', 'https://wa.me/919876543210')
            ->assertJsonPath('data.address', 'Updated business address');

        $this->assertDatabaseHas('site_profiles', [
            'brand_name' => 'Sipher',
            'about_content' => '{"headline":"Hello"}',
        ]);
    }

    public function test_authenticated_admin_api_supports_people_crud_and_rejects_invalid_faq_json(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin);

        $this->post('/api/v1/admin/people', [
            'profile_type' => 'leadership',
            'slug' => 'jane-doe',
            'name' => 'Jane Doe',
            'role' => 'Founder',
            'sort_order' => 0,
            'is_published' => true,
            'photo_file' => UploadedFile::fake()->image('jane.png'),
        ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.profile_type', 'leadership');

        $person = Person::query()->where('slug', 'jane-doe')->firstOrFail();
        Storage::disk('public')->assertExists($person->photo);
        $this->getJson('/api/v1/leadership')
            ->assertOk()
            ->assertJsonPath('data.0.photo', Storage::disk('public')->url($person->photo));

        $originalPhoto = $person->photo;
        $this->post("/api/v1/admin/people/{$person->id}", [
            '_method' => 'PUT',
            'profile_type' => 'leadership',
            'slug' => 'jane-doe',
            'name' => 'Jane Updated',
            'role' => 'Managing Director',
            'photo' => $originalPhoto,
            'photo_file' => UploadedFile::fake()->image('jane-updated.png'),
            'details' => 'Updated profile details.',
            'message_title' => 'A new message',
            'message' => 'Updated leadership message.',
            'bio' => 'Updated leadership biography.',
            'sort_order' => 0,
            'is_published' => true,
        ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Jane Updated')
            ->assertJsonPath('data.role', 'Managing Director');

        $person->refresh();
        $this->assertNotSame($originalPhoto, $person->photo);
        Storage::disk('public')->assertExists($person->photo);
        $this->getJson('/api/v1/leadership')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Jane Updated')
            ->assertJsonPath('data.0.messageTitle', 'A new message')
            ->assertJsonPath('data.0.message', 'Updated leadership message.')
            ->assertJsonPath('data.0.bio', 'Updated leadership biography.')
            ->assertJsonPath('data.0.photo', Storage::disk('public')->url($person->photo));

        $categoryResponse = $this->post('/api/v1/admin/categories', [
            'name' => 'Design',
            'slug' => 'design',
            'sort_order' => 0,
            'is_published' => true,
            'image_file' => UploadedFile::fake()->image('design.png'),
        ], ['Accept' => 'application/json'])->assertCreated();
        $category = ServiceCategory::query()->where('slug', 'design')->firstOrFail();
        Storage::disk('public')->assertExists($category->image_path);
        $this->assertSame($category->image_path, $categoryResponse->json('data.image_path'));
        $this->getJson('/api/v1/service-categories')
            ->assertOk()
            ->assertJsonPath('data.0.imagePath', Storage::disk('public')->url($category->image_path));

        $serviceResponse = $this->post('/api/v1/admin/services', [
            'service_category_id' => $category->id,
            'title' => 'Product design',
            'slug' => 'product-design',
            'sort_order' => 0,
            'is_published' => true,
            'hero_image_file' => UploadedFile::fake()->image('product-design.png'),
        ], ['Accept' => 'application/json'])->assertCreated();
        $service = Service::query()->where('slug', 'product-design')->firstOrFail();
        Storage::disk('public')->assertExists($service->hero_image);
        $this->assertSame($service->hero_image, $serviceResponse->json('data.hero_image'));
        $this->getJson('/api/v1/services/product-design')
            ->assertOk()
            ->assertJsonPath('data.heroImage', Storage::disk('public')->url($service->hero_image));

        $this->putJson("/api/v1/admin/people/{$person->id}", [
            'profile_type' => 'team',
            'slug' => 'jane-doe',
            'name' => 'Jane Doe',
            'role' => 'Creative Director',
            'sort_order' => 0,
            'is_published' => false,
        ])->assertOk()->assertJsonPath('data.role', 'Creative Director');

        $category = ServiceCategory::query()->create([
            'name' => 'Technology',
            'slug' => 'technology',
            'is_published' => true,
        ]);
        $this->postJson('/api/v1/admin/services', [
            'service_category_id' => $category->id,
            'title' => 'Web Design',
            'slug' => 'web-design',
            'sort_order' => 0,
            'faqs' => 'not-json',
        ])->assertUnprocessable();

        $this->deleteJson("/api/v1/admin/people/{$person->id}")->assertOk();
        $this->assertModelMissing($person);
    }

    public function test_content_seeder_adds_current_public_content_without_an_admin_account(): void
    {
        $this->seed(ContentSeeder::class);

        $this->assertDatabaseCount('site_profiles', 1);
        $this->assertDatabaseCount('service_categories', 3);
        $this->assertDatabaseCount('services', 14);
        $this->assertDatabaseCount('people', 2);
        $this->assertDatabaseCount('users', 0);

        $this->getJson('/api/v1/services/web-development')
            ->assertOk()
            ->assertJsonPath('data.capabilities.0', 'Corporate websites')
            ->assertJsonPath('data.deliverables.0', 'Experience architecture')
            ->assertJsonPath('data.heroImage', '/new-images/services/sec-technology.webp');

        $this->getJson('/api/v1/content')
            ->assertOk()
            ->assertJsonPath('data.profile.logoUrl', '/new-images/logo/sw_logo.webp')
            ->assertJsonPath('data.profile.faviconUrl', '/favicon.png')
            ->assertJsonPath('data.profile.loaderImageUrl', '/new-images/logo/sw_logo.webp')
            ->assertJsonPath('data.profile.about.visionImage', '/new-images/home/technology.webp')
            ->assertJsonPath('data.profile.about.processStep1Title', 'Discover')
            ->assertJsonPath('data.categories.0.imagePath', '/new-images/services/sec-technology.webp');

        $profile = SiteProfile::query()->firstOrFail();
        $profile->about_content = [...$profile->about_content, 'headline' => 'Admin-edited headline'];
        $profile->save();
        $this->seed(ContentSeeder::class);
        $this->assertSame('Admin-edited headline', $profile->fresh()->about_content['headline']);
    }

    public function test_database_seeder_creates_configured_admin_with_a_hashed_password(): void
    {
        config([
            'cms.admin.name' => 'Seeded Admin',
            'cms.admin.email' => 'admin@example.test',
            'cms.admin.password' => 'simple',
        ]);

        $this->seed();

        $admin = User::query()->where('email', 'admin@example.test')->firstOrFail();

        $this->assertSame('Seeded Admin', $admin->name);
        $this->assertTrue($admin->is_admin);
        $this->assertNotSame('simple', $admin->getRawOriginal('password'));
        $this->assertTrue(Hash::check('simple', $admin->getRawOriginal('password')));
    }

    public function test_admin_seeder_fails_when_credentials_are_not_configured(): void
    {
        config([
            'cms.admin.name' => null,
            'cms.admin.email' => null,
            'cms.admin.password' => null,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Set CMS_ADMIN_NAME, CMS_ADMIN_EMAIL, and a non-empty CMS_ADMIN_PASSWORD');

        $this->seed(AdminUserSeeder::class);
    }
}
