<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_profiles', function (Blueprint $table) {
            $table->string('brochure_path')->nullable()->after('loader_image_path');
            $table->string('brochure_name')->nullable()->after('brochure_path');
            $table->boolean('brochure_enabled')->default(true)->after('brochure_name');
        });

        DB::table('site_profiles')->update([
            'brochure_path' => '/Sipher_Web_Brochure.pdf',
            'brochure_name' => 'Sipher_Web_Brochure.pdf',
            'brochure_enabled' => true,
        ]);
    }

    public function down(): void
    {
        Schema::table('site_profiles', function (Blueprint $table) {
            $table->dropColumn(['brochure_path', 'brochure_name', 'brochure_enabled']);
        });
    }
};
