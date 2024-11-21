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
        Schema::create('services_collections', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->tinyInteger('status')->default(1);
            $table->tinyInteger('highlighted')->default(1);
            $table->timestamps();
        });

        Schema::table('services', function (Blueprint $table) {
            if (Schema::hasColumn('services', 'id_collection')) {
                $table->foreign('id_collection')->references('id')->on('services_collections')->onDelete('restrict');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services_collections');
    }
};
