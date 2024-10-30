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
        Schema::create('gallery', function (Blueprint $table) {
            $table->id();
            $table->string('image');
            $table->bigInteger('id_parent')->nullable()->unsigned()->index();
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
        });

        Schema::table('gallery', function (Blueprint $table) {
            if (Schema::hasColumn('gallery', 'id_parent')) {
                $table->foreign('id_parent')->references('id')->on('products')->onDelete('restrict');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery');
    }
};
