<?php

namespace Database\Seeders;

use App\Models\Person;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\SiteProfile;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $defaultAboutContent = [
            'headline' => 'Empowering Your Digital Future',
            'intro' => 'At Sipher Web, we empower businesses to turn ideas into meaningful digital experiences through technology, creativity and connected thinking.',
            'vision' => 'Our vision is to be a catalyst for digital transformation, helping businesses adapt, grow and thrive through thoughtful technology and exceptional digital experiences.',
            'mission' => 'We look beyond the immediate task to understand the people, goals and opportunities behind every challenge.',
            'visionImage' => '/images/home/technology.png',
            'creativeImage' => '/images/services/sec-creative.png',
            'homeArchitectureImage' => '/images/home/technology.png',
            'homeCreativeImage' => '/images/home/What_we_do_3.png',
            'homeGrowthImage' => '/images/home/What_we_do_1.png',
            'homeTechnologyImage' => '/images/home/What_we_do_2.png',
            'teamHeroImage' => '/images/team/team-hero.png',
            'contactHeroImage' => '/images/contact/contact-hero.png',
            'contactOfficeImage' => '/images/contact/contact-form.png',
            'contactBuildingImage' => '/images/contact/contact-office.png',
            'contactCard1Image' => '/images/contact/card1.png',
            'contactCard2Image' => '/images/contact/card2.png',
            'contactCard3Image' => '/images/contact/card3.png',
            'contactCard4Image' => '/images/contact/card4.png',
            'servicesHeroImage' => '/images/services/service-hero.png',
            'servicesCtaImage' => '/images/services/cta-section.png',
            'processStep1Number' => '01',
            'processStep1Title' => 'Discover',
            'processStep1Copy' => 'Understand your goals, users and current reality.',
            'processStep2Number' => '02',
            'processStep2Title' => 'Strategize',
            'processStep2Copy' => 'Define priorities, direction and the right approach.',
            'processStep3Number' => '03',
            'processStep3Title' => 'Design',
            'processStep3Copy' => 'Create journeys, systems and visual experiences.',
            'processStep4Number' => '04',
            'processStep4Title' => 'Build',
            'processStep4Copy' => 'Develop with the appropriate technology stack.',
            'processStep5Number' => '05',
            'processStep5Title' => 'Test',
            'processStep5Copy' => 'Validate function, performance, responsiveness and security.',
            'processStep6Number' => '06',
            'processStep6Title' => 'Launch',
            'processStep6Copy' => 'Deploy the final product and make it ready for users.',
            'processStep7Number' => '07',
            'processStep7Title' => 'Grow',
            'processStep7Copy' => 'Maintain, optimize and improve the solution over time.',
        ];

        $profile = SiteProfile::query()->firstOrCreate(
            [],
            [
                'name' => 'Sipher Web Pvt. Ltd.',
                'brand_name' => 'Sipher Web',
                'tagline' => 'Committed to Excellence',
                'website' => 'https://www.sipherwebtech.com',
                'email' => 'director@sipherwebtech.com',
                'phone_country_code' => '+91',
                'phone_number' => '8318230713',
                'business_hours' => 'Mon - Fri, 9AM - 6PM',
                'address' => 'C-1/364, Near Muglai Hutz, Tedhi Pulia, Sector G, Uttar Pradesh, 226022',
                'location_label' => 'Lucknow, India',
                'map_location_url' => 'https://maps.app.goo.gl/yyLV3AHJABcUZ6BJ7',
                'map_directions_url' => 'https://maps.app.goo.gl/ZtCU8u1FNPbCCMxp6so',
                'latitude' => 26.9094535,
                'longitude' => 80.9580952,
                'logo_path' => '/images/logo/sw_logo.png',
                'favicon_path' => '/favicon.png',
                'loader_image_path' => '/images/logo/sw_logo.png',
                'brochure_path' => '/Sipher_Web_Brochure.pdf',
                'brochure_name' => 'Sipher_Web_Brochure.pdf',
                'brochure_enabled' => true,
                'socials' => [
                    ['label' => 'WhatsApp', 'icon' => 'WhatsApp', 'href' => 'https://wa.me/918318230713'],
                    ['label' => 'LinkedIn', 'icon' => 'LinkedIn', 'href' => 'https://www.linkedin.com/company/sipher-web-private-limited/posts/'],
                    ['label' => 'Facebook', 'icon' => 'Facebook', 'href' => 'https://www.facebook.com/profile.php?id=61558093163571'],
                    ['label' => 'Instagram', 'icon' => 'Instagram', 'href' => 'https://www.instagram.com/sipherwebit/'],
                ],
                'about_content' => $defaultAboutContent,
            ],
        );
        $profile->logo_path ??= '/images/logo/sw_logo.png';
        $profile->favicon_path ??= '/favicon.png';
        $profile->loader_image_path ??= '/images/logo/sw_logo.png';
        $profile->about_content = array_replace($defaultAboutContent, $profile->about_content ?? []);
        $profile->save();

        $categories = [
            [
                'name' => 'Technology',
                'slug' => 'technology',
                'number' => '01',
                'statement' => 'Engineering ideas into reality.',
                'description' => 'Websites, software, applications and connected business platforms designed around real operational needs.',
                'icon' => 'Braces',
                'image_path' => '/images/services/sec-technology.png',
                'services' => [
                    ['Web Development', 'web-development', 'LayoutTemplate', 'Fast, accessible digital experiences.'],
                    ['Software Development', 'software-development', 'Code2', 'Purpose-built business software.'],
                    ['Mobile Apps', 'mobile-app-development', 'Smartphone', 'Useful products for every screen.'],
                    ['E-Commerce', 'ecommerce', 'ShoppingBag', 'Connected online commerce systems.'],
                    ['ERP & CRM', 'erp-crm', 'ServerCog', 'Systems that organize operations.'],
                    ['SaaS Platforms', 'saas', 'AppWindow', 'Scalable software products.'],
                    ['API Integration', 'api-integration', 'Workflow', 'Reliable connections between tools.'],
                    ['AI & Automation', 'ai-automation', 'Bot', 'Smarter, less manual workflows.'],
                ],
            ],
            [
                'name' => 'Digital Growth',
                'slug' => 'digital-growth',
                'number' => '02',
                'statement' => 'Strategies that create real impact.',
                'description' => 'Search, media, content and analytics working together to help organizations improve their digital presence.',
                'icon' => 'BarChart3',
                'image_path' => '/images/services/sec-digitalgrowth.png',
                'services' => [
                    ['Digital Marketing', 'digital-marketing', 'Megaphone', 'Integrated growth strategy.'],
                    ['SEO', 'seo', 'Search', 'Sustainable search visibility.'],
                    ['Social Media', 'social-media', 'Sparkles', 'Relevant, consistent communication.'],
                ],
            ],
            [
                'name' => 'Creative',
                'slug' => 'creative',
                'number' => '03',
                'statement' => 'Ideas that bring brands to life.',
                'description' => 'Brand, interface and visual systems that make complex ideas clear, memorable and useful.',
                'icon' => 'Palette',
                'image_path' => '/images/services/sec-creative.png',
                'services' => [
                    ['UI/UX Design', 'ui-ux', 'PenTool', 'Human-centered product experiences.'],
                    ['Branding', 'branding', 'Sparkles', 'Distinctive brand systems.'],
                    ['Graphic Design', 'graphic-design', 'Palette', 'Communication with clarity.'],
                ],
            ],
        ];

        $intros = [
            'web-development' => 'High-performance websites and web applications built to communicate clearly, work reliably and grow with your organization.',
            'software-development' => 'Custom software shaped around the way your teams, customers and business processes actually work.',
            'mobile-app-development' => 'Mobile products that bring useful services and connected experiences to the screens people use every day.',
            'ecommerce' => 'Commerce experiences designed to make product discovery, purchase and business operations feel effortless.',
            'erp-crm' => 'Connected business systems that improve visibility across customers, people, inventory and finance.',
            'saas' => 'Scalable software products designed around clear workflows, dependable infrastructure and long-term evolution.',
            'api-integration' => 'Secure connections that help software, services and data move together without unnecessary manual work.',
            'ai-automation' => 'Practical AI and automation systems that simplify information access, content workflows and routine processes.',
            'digital-marketing' => 'Connected digital strategy across search, advertising, content and analytics.',
            'seo' => 'Search strategy that improves the structure, relevance and discoverability of your digital presence.',
            'social-media' => 'A consistent social presence shaped by relevant content, useful creative and clear campaign direction.',
            'ui-ux' => 'Digital interfaces that bring business goals, user needs and strong visual craft into one coherent experience.',
            'branding' => 'Distinctive visual systems that help organizations communicate with greater clarity and consistency.',
            'graphic-design' => 'Purposeful visual communication for campaigns, platforms and everyday brand touchpoints.',
        ];

        $capabilities = [
            'web-development' => ['Corporate websites', 'Business websites', 'Landing pages', 'Portfolio websites', 'Website redesign', 'Web applications'],
            'software-development' => ['Custom software', 'CMS', 'LMS', 'HRMS', 'Payroll', 'Inventory', 'Finance and billing'],
            'mobile-app-development' => ['Mobile applications', 'Connected APIs', 'Product interfaces', 'Payment integration', 'Performance optimization'],
            'ecommerce' => ['E-Commerce', 'Shopify', 'WooCommerce', 'Payment integration', 'Shipping integration'],
            'erp-crm' => ['ERP', 'CRM', 'HRMS', 'Payroll', 'Inventory', 'Finance and billing'],
            'saas' => ['SaaS products', 'Subscription workflows', 'Role-based systems', 'API integration', 'Cloud deployment'],
            'api-integration' => ['API development', 'Third-party integration', 'Payment integration', 'Shipping integration', 'Data workflows'],
            'ai-automation' => ['AI chatbots', 'AI assistants', 'AI API integration', 'Intelligent search', 'Document processing', 'AI content workflows', 'Data analysis'],
            'digital-marketing' => ['Google Ads', 'Meta Ads', 'Content marketing', 'Lead generation', 'Analytics', 'Social media marketing'],
            'seo' => ['Search strategy', 'Technical SEO', 'Content planning', 'Analytics'],
            'social-media' => ['Social media marketing', 'Content marketing', 'Marketing creatives', 'Meta Ads', 'Analytics'],
            'ui-ux' => ['User journeys', 'Wireframes', 'Interface design', 'Design systems', 'Responsive experiences'],
            'branding' => ['Brand direction', 'Visual identity', 'Communication systems', 'Marketing creatives'],
            'graphic-design' => ['Graphic design', 'Marketing creatives', 'Video editing', 'Motion graphics'],
        ];
        $deliverables = [
            'web-development' => ['Experience architecture', 'Responsive interface', 'Content-ready build', 'Performance and launch support'],
            'software-development' => ['Discovery and requirements', 'System design', 'Development and testing', 'Deployment support'],
            'mobile-app-development' => ['Product strategy', 'Interface design', 'App development', 'Testing and launch'],
            'ecommerce' => ['Store architecture', 'Responsive storefront', 'Commerce integrations', 'Launch support'],
            'erp-crm' => ['Process discovery', 'System architecture', 'Implementation', 'Training and support'],
            'saas' => ['Product definition', 'UX and system design', 'Platform development', 'Deployment'],
            'api-integration' => ['Integration plan', 'API implementation', 'Testing', 'Documentation'],
            'ai-automation' => ['Opportunity mapping', 'Workflow design', 'AI integration', 'Monitoring and improvement'],
            'digital-marketing' => ['Growth strategy', 'Campaign system', 'Creative direction', 'Performance reporting'],
            'seo' => ['SEO review', 'Priority roadmap', 'Implementation guidance', 'Reporting'],
            'social-media' => ['Channel strategy', 'Content system', 'Creative production', 'Campaign reporting'],
            'ui-ux' => ['Experience strategy', 'Flows and wireframes', 'Visual interface', 'Developer-ready design'],
            'branding' => ['Brand foundation', 'Identity system', 'Core applications', 'Usage guidance'],
            'graphic-design' => ['Creative direction', 'Visual production', 'Adaptable asset system', 'Delivery-ready files'],
        ];

        foreach ($categories as $categoryIndex => $categoryData) {
            $services = $categoryData['services'];
            unset($categoryData['services']);

            $category = ServiceCategory::query()->firstOrCreate(
                ['slug' => $categoryData['slug']],
                [...$categoryData, 'sort_order' => $categoryIndex, 'is_published' => true],
            );
            if (blank($category->image_path)) {
                $category->image_path = $categoryData['image_path'];
                $category->save();
            }

            foreach ($services as $serviceIndex => [$title, $slug, $icon, $description]) {
                $service = Service::query()->firstOrCreate(
                    ['slug' => $slug],
                    [
                        'service_category_id' => $category->id,
                        'title' => $title,
                        'description' => $description,
                        'intro' => $intros[$slug],
                        'icon' => $icon,
                        'capabilities' => $capabilities[$slug],
                        'deliverables' => $deliverables[$slug],
                        'sort_order' => $serviceIndex,
                        'is_published' => true,
                    ],
                );
                if (blank($service->hero_image) && filled($category->image_path)) {
                    $service->hero_image = $category->image_path;
                    $service->save();
                }
            }
        }

        foreach ([
            [
                'slug' => 'director',
                'name' => 'Sadiya Anjum',
                'role' => 'Director',
                'message_title' => 'Leading with Purpose and Vision',
                'message' => 'Great leadership starts with a clear purpose: bringing people together, encouraging thoughtful ideas, and helping every project make a meaningful difference.',
                'bio' => 'At Sipher Web, leadership means setting a clear direction, bringing people together, and helping every project move forward with purpose. Our leadership team works across strategy, technology, and creative delivery to build digital experiences that help businesses grow.',
            ],
            [
                'slug' => 'ceo',
                'name' => 'Dr. Irfan Khan',
                'role' => 'Chief Executive Officer',
                'message_title' => 'Building a Better Digital Future',
                'message' => 'Technology is most powerful when it helps people and businesses move forward. We aim to pair clear thinking with creative work to build solutions that make a lasting impact.',
                'bio' => 'At Sipher Web, leadership means setting a clear direction, bringing people together, and helping every project move forward with purpose. Our leadership team works across strategy, technology, and creative delivery to build digital experiences that help businesses grow.',
            ],
        ] as $index => $leader) {
            Person::query()->firstOrCreate(
                ['slug' => $leader['slug']],
                [...$leader, 'profile_type' => 'leadership', 'sort_order' => $index, 'is_published' => true],
            );
        }
    }
}
