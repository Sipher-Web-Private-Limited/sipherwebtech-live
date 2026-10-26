<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('site_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand_name');
            $table->string('tagline')->nullable();
            $table->string('website')->nullable();
            $table->string('email');
            $table->string('phone_country_code', 8)->nullable();
            $table->string('phone_number', 32)->nullable();
            $table->string('business_hours')->nullable();
            $table->text('address')->nullable();
            $table->string('location_label')->nullable();
            $table->string('map_location_url')->nullable();
            $table->string('map_directions_url')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->json('socials')->nullable();
            $table->json('about_content')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_profiles');
    }
};
