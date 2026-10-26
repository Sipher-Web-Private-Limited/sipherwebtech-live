<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_library_items', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 32);
            $table->string('slug');
            $table->string('title');
            $table->text('summary')->nullable();
            $table->string('category')->nullable();
            $table->string('image_path', 2048)->nullable();
            $table->json('content')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            $table->unique(['type', 'slug']);
            $table->index(['type', 'is_published', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_library_items');
    }
};
