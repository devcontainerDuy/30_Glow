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
        Schema::create('bills_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('id_bill')->unsigned();
            $table->bigInteger('id_product')->unsigned();
            $table->integer('quantity')->default(1);
            $table->decimal("unit_price", 10, 2)->default(0);
            $table->timestamps();
        });

        Schema::table('bills_details', function (Blueprint $table) {
            if (Schema::hasColumn('bills_details', 'id_bill')) {
                $table->foreign('id_bill')->references('id')->on('bills')->onDelete('restrict');
            }
            if (Schema::hasColumn('bills_details', 'id_product')) {
                $table->foreign('id_product')->references('id')->on('products')->onDelete('restrict');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bills_details', function (Blueprint $table) {
            $table->dropForeign(['id_bill']);
            $table->dropForeign(['id_product']);
        });

        Schema::dropIfExists('bills_details');
    }
};
