<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_profiles', function (Blueprint $table) {
            $table->boolean('external_leads_enabled')->default(false)->after('brochure_enabled');
            $table->string('external_leads_url')->nullable()->after('external_leads_enabled');
            $table->string('external_leads_key')->nullable()->after('external_leads_url');
        });
    }

    public function down(): void
    {
        Schema::table('site_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'external_leads_enabled',
                'external_leads_url',
                'external_leads_key',
            ]);
        });
    }
};
