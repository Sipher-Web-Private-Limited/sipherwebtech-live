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
        Schema::create('people', function (Blueprint $table) {
            $table->id();
            $table->string('profile_type')->default('team');
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('role');
            $table->string('photo')->nullable();
            $table->text('details')->nullable();
            $table->string('message_title')->nullable();
            $table->text('message')->nullable();
            $table->longText('bio')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('people');
    }
};
