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
        Schema::create('booking_has_services', function (Blueprint $table) {
            $table->unsignedBigInteger('id_booking');
            $table->unsignedBigInteger('id_service');
        });

        if (Schema::hasTable('booking_has_services')) {
            Schema::table('booking_has_services', function (Blueprint $table) {
                $table->foreign('id_booking')->references('id')->on('bookings')->onDelete('cascade');
                $table->foreign('id_service')->references('id')->on('services')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_has_services');
    }
};
