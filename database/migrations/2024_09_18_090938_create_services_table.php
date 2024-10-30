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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->bigInteger('price')->unsigned();
            $table->bigInteger('compare_price')->unsigned();
            $table->bigInteger('discount')->nullable()->default(0)->unsigned();
            $table->string('summary');
            $table->bigInteger('id_collection')->unsigned();
            $table->string('image');
            $table->longText('content');
            $table->tinyInteger('status')->default(0);
            $table->tinyInteger('highlighted')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
