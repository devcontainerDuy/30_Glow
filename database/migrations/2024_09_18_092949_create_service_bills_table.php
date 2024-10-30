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
            $table->bigInteger('id_customer')->unsigned();
            $table->tinyInteger('status')->default(0);
            $table->timestamps();
        });

        Schema::table('service_bills', function (Blueprint $table) {
            if (Schema::hasColumn('service_bills', 'id_customer')) {
                $table->foreign('id_customer')->references('id')->on('customers')->onDelete('restrict');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_bills');
    }
};
