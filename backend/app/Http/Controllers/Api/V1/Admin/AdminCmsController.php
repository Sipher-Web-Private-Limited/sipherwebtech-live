<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Person;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\SiteProfile;
use App\Models\User;
use App\Support\CmsFormData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AdminCmsController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ]);
        $user = User::query()->where('email', strtolower(trim($credentials['email'])))->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'The supplied credentials are incorrect.'], 422);
        }

        if (! $user->is_admin) {
            return response()->json(['message' => 'This account does not have administrator access.'], 403);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return response()->json(['data' => ['user' => $user]]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => ['user' => $request->user()]]);
    }

    public function updateAccount(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'current_password' => ['required_with:new_password', 'current_password:web'],
            'new_password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $user->name = $data['name'];
        $user->email = strtolower(trim($data['email']));
        if (! empty($data['new_password'])) {
            $user->password = $data['new_password'];
        }
        $user->save();

        return response()->json(['data' => ['user' => $user->refresh()]]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        Auth::forgetGuards();

        return response()->json(['message' => 'Signed out.']);
    }

    public function profile(): JsonResponse
    {
        $profile = SiteProfile::query()->firstOrCreate([], [
            'name' => '',
            'brand_name' => '',
            'email' => '',
        ]);

        return response()->json(['data' => $profile]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'brand_name' => ['required', 'string', 'max:255'],
            'logo_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'remove_logo' => ['sometimes', 'boolean'],
            'favicon_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'remove_favicon' => ['sometimes', 'boolean'],
            'loader_image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'remove_loader_image' => ['sometimes', 'boolean'],
            'brochure_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:51200'],
            'remove_brochure' => ['sometimes', 'boolean'],
            'brochure_enabled' => ['sometimes', 'boolean'],
            'external_leads_enabled' => ['sometimes', 'boolean'],
            'external_leads_url' => ['nullable', 'url', 'max:255'],
            'external_leads_key' => ['nullable', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone_country_code' => ['nullable', 'string', 'max:8'],
            'phone_number' => ['nullable', 'string', 'max:32'],
            'whatsapp_number' => ['nullable', 'string', 'max:32'],
            'business_hours' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'location_label' => ['nullable', 'string', 'max:255'],
            'map_location_url' => ['nullable', 'url', 'max:255'],
            'map_directions_url' => ['nullable', 'url', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);
        $data['socials'] = CmsFormData::listOfObjects(
            $this->jsonString($request, 'socials'),
            'socials',
            ['label', 'icon', 'href'],
        );
        if ($request->has('about_content')) {
            $data['about_content'] = CmsFormData::objectOfStrings(
                $this->jsonString($request, 'about_content'),
                'about_content',
            );
        }

        if ($request->has('approved_clients')) {
            $rawClients = $request->input('approved_clients');
            if (is_string($rawClients)) {
                $trimmed = trim($rawClients);
                if (str_starts_with($trimmed, '[') && str_ends_with($trimmed, ']')) {
                    $decoded = json_decode($trimmed, true);
                    $data['approved_clients'] = is_array($decoded) ? array_values(array_filter(array_map('trim', array_map('strval', $decoded)))) : [];
                } else {
                    $data['approved_clients'] = CmsFormData::lines($rawClients);
                }
            } elseif (is_array($rawClients)) {
                $data['approved_clients'] = array_values(array_filter(array_map('trim', array_map('strval', $rawClients))));
            }
        }

        foreach ([
            'logo' => 'logo_path',
            'favicon' => 'favicon_path',
            'loader_image' => 'loader_image_path',
        ] as $asset => $pathField) {
            $fileField = $asset.'_file';
            $removeField = 'remove_'.$asset;

            if ($request->hasFile($fileField)) {
                $data[$pathField] = $request->file($fileField)->storePublicly('cms/brand', 'public');
            } elseif ($request->boolean($removeField)) {
                $data[$pathField] = null;
            }

            unset($data[$fileField], $data[$removeField]);
        }

        if ($request->hasFile('brochure_file')) {
            $brochureFile = $request->file('brochure_file');
            $data['brochure_path'] = $brochureFile->storePublicly('cms/brochure', 'public');
            $data['brochure_name'] = $brochureFile->getClientOriginalName();
        } elseif ($request->boolean('remove_brochure')) {
            $data['brochure_path'] = null;
            $data['brochure_name'] = null;
        }

        if ($request->has('brochure_enabled')) {
            $data['brochure_enabled'] = $request->boolean('brochure_enabled');
        }
        unset($data['brochure_file'], $data['remove_brochure']);

        if ($request->has('external_leads_enabled')) {
            $data['external_leads_enabled'] = $request->boolean('external_leads_enabled');
        }

        $profile = SiteProfile::query()->first() ?? new SiteProfile;
        $profile->fill($data);
        $profile->save();

        return response()->json(['data' => $profile->refresh()]);
    }

    public function categories(): JsonResponse
    {
        return response()->json([
            'data' => ServiceCategory::query()->withCount('services')->orderBy('sort_order')->get(),
        ]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $data = $this->validatedCategory($request);
        $this->storeUpload($request, $data, 'image_file', 'image_path', 'cms/categories');
        $category = ServiceCategory::query()->create($data);

        return response()->json(['data' => $category], 201);
    }

    public function updateCategory(Request $request, ServiceCategory $category): JsonResponse
    {
        $data = $this->validatedCategory($request, $category);
        $this->storeUpload($request, $data, 'image_file', 'image_path', 'cms/categories');
        $category->update($data);

        return response()->json(['data' => $category->fresh()]);
    }

    public function deleteCategory(ServiceCategory $category): JsonResponse
    {
        $category->delete();

        return response()->json(['message' => 'Category and its services deleted.']);
    }

    public function services(): JsonResponse
    {
        return response()->json([
            'data' => Service::query()->with('category')->orderBy('sort_order')->get(),
        ]);
    }

    public function storeService(Request $request): JsonResponse
    {
        $data = $this->validatedService($request);
        $this->storeUpload($request, $data, 'hero_image_file', 'hero_image', 'cms/services');
        $service = Service::query()->create($data);

        return response()->json(['data' => $service->load('category')], 201);
    }

    public function updateService(Request $request, Service $service): JsonResponse
    {
        $data = $this->validatedService($request, $service);
        $this->storeUpload($request, $data, 'hero_image_file', 'hero_image', 'cms/services');
        $service->update($data);

        return response()->json(['data' => $service->fresh('category')]);
    }

    public function deleteService(Service $service): JsonResponse
    {
        $service->delete();

        return response()->json(['message' => 'Service deleted.']);
    }

    public function people(): JsonResponse
    {
        return response()->json([
            'data' => Person::query()->orderBy('profile_type')->orderBy('sort_order')->get(),
        ]);
    }

    public function storePerson(Request $request): JsonResponse
    {
        $data = $this->validatedPerson($request);
        $this->storeUpload($request, $data, 'photo_file', 'photo', 'cms/people');
        $person = Person::query()->create($data);

        return response()->json(['data' => $person], 201);
    }

    public function updatePerson(Request $request, Person $person): JsonResponse
    {
        $data = $this->validatedPerson($request, $person);
        $this->storeUpload($request, $data, 'photo_file', 'photo', 'cms/people');
        $person->update($data);

        return response()->json(['data' => $person->fresh()]);
    }

    public function deletePerson(Person $person): JsonResponse
    {
        $person->delete();

        return response()->json(['message' => 'Profile deleted.']);
    }

    private function validatedCategory(Request $request, ?ServiceCategory $category = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'alpha_dash', 'max:255', Rule::unique('service_categories')->ignore($category)],
            'number' => ['nullable', 'string', 'max:8'],
            'statement' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'image_path' => ['nullable', 'string', 'max:2048'],
            'image_file' => ['nullable', 'image', 'max:5120'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
        ]) + ['is_published' => $request->boolean('is_published')];
    }

    private function validatedService(Request $request, ?Service $service = null): array
    {
        $data = $request->validate([
            'service_category_id' => ['required', 'exists:service_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'alpha_dash', 'max:255', Rule::unique('services')->ignore($service)],
            'description' => ['nullable', 'string'],
            'intro' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'hero_image' => ['nullable', 'string', 'max:2048'],
            'hero_image_file' => ['nullable', 'image', 'max:5120'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
        ]);
        $data['capabilities'] = $this->listInput($request, 'capabilities');
        $data['deliverables'] = $this->listInput($request, 'deliverables');
        $data['benefits'] = $this->listInput($request, 'benefits');
        $data['faqs'] = CmsFormData::listOfObjects(
            $this->jsonString($request, 'faqs'),
            'faqs',
            ['question', 'answer'],
        );

        return $data + ['is_published' => $request->boolean('is_published')];
    }

    private function validatedPerson(Request $request, ?Person $person = null): array
    {
        return $request->validate([
            'profile_type' => ['required', Rule::in(['team', 'leadership'])],
            'slug' => ['required', 'alpha_dash', 'max:255', Rule::unique('people')->ignore($person)],
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'string', 'max:2048'],
            'photo_file' => ['nullable', 'image', 'max:5120'],
            'details' => ['nullable', 'string'],
            'message_title' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string'],
            'bio' => ['nullable', 'string'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
        ]) + ['is_published' => $request->boolean('is_published')];
    }

    private function listInput(Request $request, string $field): array
    {
        $value = $request->input($field, []);
        if (is_string($value)) {
            $value = CmsFormData::json($value, $field);
        }

        if (! is_array($value) || ! array_is_list($value)) {
            throw ValidationException::withMessages([$field => 'Enter a JSON array of text values.']);
        }

        $validated = Validator::make(
            [$field => $value],
            [$field => ['array'], $field.'.*' => ['string', 'max:2000']],
        )->validate();

        return $validated[$field];
    }

    private function jsonString(Request $request, string $field): ?string
    {
        $value = $request->input($field);

        return is_array($value) ? json_encode($value, JSON_THROW_ON_ERROR) : $value;
    }

    private function storeUpload(Request $request, array &$data, string $fileField, string $pathField, string $directory): void
    {
        if ($request->hasFile($fileField)) {
            $data[$pathField] = $request->file($fileField)->storePublicly($directory, 'public');
        }
        unset($data[$fileField]);
    }
}
