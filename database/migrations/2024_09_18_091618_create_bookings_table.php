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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('id_user')->unsigned()->nullable();
            $table->bigInteger('id_customer')->unsigned();
            // $table->bigInteger('id_service')->unsigned();
            $table->time('time');
            $table->string('note')->nullable();
            $table->tinyInteger('status')->default(0);
            $table->timestamps();
        });

        Schema::table('bookings', function (Blueprint $table) {
            if (Schema::hasColumn('bookings', 'id_user')) {
                $table->foreign('id_user')->references('id')->on('users')->onDelete('restrict');
            }
            if (Schema::hasColumn('bookings', 'id_customer')) {
                $table->foreign('id_customer')->references('id')->on('customers')->onDelete('restrict');
            }
            // if (Schema::hasColumn('bookings', 'id_service')) {
            //     $table->foreign('id_service')->references('id')->on('services')->onDelete('restrict');
            // }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
