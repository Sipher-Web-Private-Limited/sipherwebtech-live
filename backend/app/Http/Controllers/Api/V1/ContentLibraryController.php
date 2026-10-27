<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ContentLibraryItem;
use App\Support\PublicMediaUrl;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ContentLibraryController extends Controller
{
    private const TYPES = ['blog', 'portfolio', 'product', 'career'];

    public function index(string $type): JsonResponse
    {
        abort_unless(in_array($type, self::TYPES, true), 404);

        $items = ContentLibraryItem::query()
            ->where('type', $type)
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get()
            ->map(fn (ContentLibraryItem $item): array => $this->publicItem($item));

        return response()->json(['data' => $items]);
    }

    public function show(string $type, string $slug): JsonResponse
    {
        abort_unless(in_array($type, self::TYPES, true), 404);

        $item = ContentLibraryItem::query()
            ->where('type', $type)
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return response()->json(['data' => $this->publicItem($item)]);
    }

    public function adminIndex(): JsonResponse
    {
        return response()->json([
            'data' => ContentLibraryItem::query()
                ->orderBy('type')
                ->orderBy('sort_order')
                ->orderByDesc('id')
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $item = ContentLibraryItem::query()->create($this->validatedData($request));

        return response()->json(['data' => $item], 201);
    }

    public function update(Request $request, ContentLibraryItem $item): JsonResponse
    {
        $item->update($this->validatedData($request, $item));

        return response()->json(['data' => $item->fresh()]);
    }

    public function destroy(ContentLibraryItem $item): JsonResponse
    {
        $item->delete();

        return response()->json(['message' => 'Content item deleted.']);
    }

    private function validatedData(Request $request, ?ContentLibraryItem $item = null): array
    {
        $data = $request->validate([
            'type' => ['required', 'string', 'in:blog,portfolio,product,career'],
            'slug' => ['required', 'alpha_dash', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:5000'],
            'category' => ['nullable', 'string', 'max:255'],
            'image_path' => ['nullable', 'string', 'max:2048'],
            'image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        $duplicate = ContentLibraryItem::query()
            ->where('type', $data['type'])
            ->where('slug', $data['slug'])
            ->when($item, fn ($query) => $query->where('id', '!=', $item->getKey()))
            ->exists();
        if ($duplicate) {
            throw ValidationException::withMessages(['slug' => 'This URL slug is already used for this content type.']);
        }

        $content = $request->input('content', []);
        $jsonPayload = $request->isJson() ? json_decode($request->getContent()) : null;
        $isJsonObject = is_object($jsonPayload)
            && property_exists($jsonPayload, 'content')
            && is_object($jsonPayload->content);
        if (is_string($content)) {
            $decoded = json_decode($content);
            if (! is_object($decoded)) {
                throw ValidationException::withMessages(['content' => 'Content must be a JSON object.']);
            }
            $content = (array) $decoded;
            $isJsonObject = true;
        }
        if (! is_array($content) || (array_is_list($content) && ! ($isJsonObject && $content === []))) {
            throw ValidationException::withMessages(['content' => 'Content must be a JSON object.']);
        }
        $data['content'] = $content;
        $data['is_published'] = $request->boolean('is_published');

        if ($request->hasFile('image_file')) {
            $data['image_path'] = $request->file('image_file')->storePublicly('cms/content-library', 'public');
        }
        unset($data['image_file']);

        return $data;
    }

    /**
     * @return array<string, mixed>
     */
    private function publicItem(ContentLibraryItem $item): array
    {
        return [
            'id' => $item->id,
            'type' => $item->type,
            'slug' => $item->slug,
            'title' => $item->title,
            'excerpt' => $item->summary ?? '',
            'category' => $item->category ?? '',
            'image' => PublicMediaUrl::resolve($item->image_path),
            'sortOrder' => $item->sort_order,
            ...($item->content ?? []),
        ];
    }
}
