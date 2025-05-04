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
        Schema::create('sitemaps', function (Blueprint $table) {
            $table->id();
            $table->string('url');                     // URL đầy đủ: https://domain.com/page
            $table->timestamp('lastmod')->nullable(); // Ngày cập nhật gần nhất
            $table->string('changefreq')->nullable(); // daily, weekly, monthly, yearly...
            $table->decimal('priority', 2, 1)->nullable(); // 0.1 - 1.0
            $table->tinyInteger('status')->default(1); // 1 = active, 0 = inactive
            $table->timestamps();
            $table->softDeletes();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sitemaps');
    }
};
