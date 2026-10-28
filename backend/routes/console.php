<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Support\PublicContentCache;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('cms:clear-public-cache', function (PublicContentCache $publicContentCache): void {
    $clearedAt = $publicContentCache->clear();
    $this->info("Public content cache cleared at {$clearedAt}.");
})->purpose('Invalidate cached public website content');

Schedule::command('cms:clear-public-cache')->dailyAt('02:00');
