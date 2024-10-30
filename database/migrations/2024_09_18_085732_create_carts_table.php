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
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('id_customer')->unsigned();
            $table->bigInteger('id_product')->unsigned();
            $table->integer('quantity');
            $table->timestamps();
        });

        Schema::table('carts', function (Blueprint $table) {
            if (Schema::hasColumn('carts', 'id_customer')) {
                $table->foreign('id_customer')->references('id')->on('customers')->onDelete('restrict');
            }
            if (Schema::hasColumn('carts', 'id_product')) {
                $table->foreign('id_product')->references('id')->on('products')->onDelete('restrict');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
