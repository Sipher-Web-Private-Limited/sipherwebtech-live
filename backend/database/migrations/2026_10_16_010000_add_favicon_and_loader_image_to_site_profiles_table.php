<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_profiles', function (Blueprint $table) {
            $table->string('favicon_path')->nullable()->after('logo_path');
            $table->string('loader_image_path')->nullable()->after('favicon_path');
        });
    }

    public function down(): void
    {
        Schema::table('site_profiles', function (Blueprint $table) {
            $table->dropColumn(['favicon_path', 'loader_image_path']);
        });
    }
};
