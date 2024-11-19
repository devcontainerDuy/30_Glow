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
                $table->foreign('id_booking')->references('id')->on('bookings')->onDelete('restrict');
                $table->foreign('id_service')->references('id')->on('services')->onDelete('restrict');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_has_services', function (Blueprint $table) {
            $table->dropForeign(['id_booking']);
            $table->dropForeign(['id_service']);
        });

        Schema::dropIfExists('booking_has_services');
    }
};