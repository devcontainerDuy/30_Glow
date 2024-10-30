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
        Schema::create('service_bills_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('id_service_bill')->unsigned();
            $table->bigInteger('id_service')->unsigned();
            $table->bigInteger('id_booking')->unsigned();
            $table->timestamps();
        });

        Schema::table('service_bills_details', function (Blueprint $table) {
            if (Schema::hasColumn('service_bills_details', 'id_service_bill')) {
                $table->foreign('id_service_bill')->references('id')->on('service_bills')->onDelete('restrict');
            }
            if (Schema::hasColumn('service_bills_details', 'id_service')) {
                $table->foreign('id_service')->references('id')->on('services')->onDelete('restrict');
            }
            if (Schema::hasColumn('service_bills_details', 'id_booking')) {
                $table->foreign('id_booking')->references('id')->on('bookings')->onDelete('restrict');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_bills_details');
    }
};