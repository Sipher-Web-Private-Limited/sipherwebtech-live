<?php

namespace App\Support;

use Illuminate\Validation\ValidationException;

class CmsFormData
{
    public static function lines(?string $value): array
    {
        return array_values(array_filter(
            array_map('trim', preg_split('/\R/', $value ?? '') ?: []),
            static fn (string $line): bool => $line !== '',
        ));
    }

    public static function json(?string $value, string $field): array
    {
        if (blank($value)) {
            return [];
        }

        try {
            $decoded = json_decode($value, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw ValidationException::withMessages([
                $field => 'Enter valid JSON.',
            ]);
        }

        if (! is_array($decoded)) {
            throw ValidationException::withMessages([
                $field => 'The JSON value must be an object or array.',
            ]);
        }

        return $decoded;
    }

    public static function objectOfStrings(?string $value, string $field): array
    {
        $decoded = self::json($value, $field);

        if (($decoded !== [] && array_is_list($decoded)) || array_filter($decoded, static fn ($item): bool => ! is_string($item)) !== []) {
            throw ValidationException::withMessages([
                $field => 'Enter a JSON object with text values.',
            ]);
        }

        return $decoded;
    }

    public static function listOfObjects(?string $value, string $field, array $requiredKeys): array
    {
        $decoded = self::json($value, $field);

        if (! array_is_list($decoded)) {
            throw ValidationException::withMessages([
                $field => 'Enter a JSON array.',
            ]);
        }

        foreach ($decoded as $item) {
            foreach ($requiredKeys as $key) {
                if (! is_array($item) || ! isset($item[$key]) || ! is_string($item[$key])) {
                    throw ValidationException::withMessages([
                        $field => 'Each item must include text values for: '.implode(', ', $requiredKeys).'.',
                    ]);
                }
            }
        }

        return $decoded;
    }
}
