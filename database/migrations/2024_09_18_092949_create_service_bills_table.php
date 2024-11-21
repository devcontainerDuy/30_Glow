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
        Schema::create('service_bills', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique()->after('id');
            $table->bigInteger('id_customer')->unsigned();
            $table->bigInteger('id_booking')->unsigned()->unique();
            $table->decimal('total', 10, 2);
            $table->tinyInteger('status')->default(0);
            $table->timestamps();
        });

        Schema::table('service_bills', function (Blueprint $table) {
            if (Schema::hasColumn('service_bills', 'id_customer')) {
                $table->foreign('id_customer')->references('id')->on('customers')->onDelete('restrict');
            }
            if (Schema::hasColumn('service_bills', 'id_booking')) {
                $table->foreign('id_booking')->references('id')->on('bookings')->onDelete('restrict');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_bills', function (Blueprint $table) {
            $table->dropForeign(['id_customer']);
            $table->dropForeign(['id_booking']);
        });

        Schema::dropIfExists('service_bills');
    }
};
