<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ContactEnquiry;
use App\Models\SiteProfile;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class ContactEnquiryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:rfc', 'max:255'],
            'phone' => ['required', 'string', 'max:32', 'regex:/^[A-Za-z0-9]+$/'],
            'service' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:15', 'max:5000'],
        ]);

        if (! Schema::hasTable('contact_enquiries')) {
            return $this->storageNotReady();
        }

        try {
            $enquiry = ContactEnquiry::query()->create($data);
        } catch (QueryException $exception) {
            Log::error('Contact enquiry could not be stored.', [
                'exception' => $exception,
            ]);

            return response()->json([
                'message' => 'We could not save your enquiry right now. Please try again later or contact us by phone or email.',
            ], 503);
        }

        $this->forwardLeadToExternalWebsite($enquiry);

        return response()->json([
            'message' => 'Your enquiry has been submitted.',
            'data' => ['id' => $enquiry->id],
        ], 201);
    }

    public function index(): JsonResponse
    {
        if (! Schema::hasTable('contact_enquiries')) {
            return $this->storageNotReady();
        }

        try {
            $enquiries = ContactEnquiry::query()->latest()->get();
        } catch (QueryException $exception) {
            Log::error('Contact enquiries could not be loaded for the admin inbox.', [
                'exception' => $exception,
            ]);

            return response()->json([
                'message' => 'The enquiry inbox is temporarily unavailable. Please try again later.',
            ], 503);
        }

        return response()->json([
            'data' => $enquiries,
        ]);
    }

    public function update(Request $request, ContactEnquiry $contactEnquiry): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:rfc', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'service' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $contactEnquiry->update($data);

        return response()->json([
            'message' => 'Contact enquiry updated successfully.',
            'data' => $contactEnquiry->fresh(),
        ]);
    }

    public function destroy(ContactEnquiry $contactEnquiry): JsonResponse
    {
        $contactEnquiry->delete();

        return response()->json([
            'message' => 'Contact enquiry deleted successfully.',
        ]);
    }

    private function storageNotReady(): JsonResponse
    {
        return response()->json([
            'message' => 'The enquiry inbox has not been set up yet. Run `php artisan migrate` from the backend folder, then reload this page.',
            'code' => 'contact_enquiries_migration_required',
        ], 503);
    }

    private function forwardLeadToExternalWebsite(ContactEnquiry $enquiry): void
    {
        $profile = Schema::hasTable('site_profiles') ? SiteProfile::query()->first() : null;

        $adminEnabled = (bool) ($profile?->external_leads_enabled ?? false);
        $url = ($adminEnabled && ! empty($profile?->external_leads_url))
            ? $profile->external_leads_url
            : config('services.external_leads.url');

        $key = ($adminEnabled && ! empty($profile?->external_leads_key))
            ? $profile->external_leads_key
            : config('services.external_leads.key');

        if (empty($url)) {
            return;
        }

        try {
            $client = Http::timeout(5)->acceptJson();

            if (! empty($key)) {
                $client = $client->withToken($key);
            }

            $response = $client->post($url, [
                'name' => $enquiry->name,
                'email' => $enquiry->email,
                'phone' => $enquiry->phone,
                'service' => $enquiry->service,
                'message' => $enquiry->message,
                'source' => 'sipherwebtech',
                'created_at' => $enquiry->created_at?->toIso8601String() ?? now()->toIso8601String(),
            ]);

            if (! $response->successful()) {
                Log::warning('External website lead forwarding returned non-success HTTP status.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'enquiry_id' => $enquiry->id,
                ]);
            }
        } catch (\Throwable $exception) {
            Log::error('External website lead forwarding encountered an exception.', [
                'exception' => $exception->getMessage(),
                'enquiry_id' => $enquiry->id,
            ]);
        }
    }
}
