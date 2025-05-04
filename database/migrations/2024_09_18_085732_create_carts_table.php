<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('customer_id')->unsigned();
            $table->bigInteger('product_id')->unsigned();
            $table->integer('quantity')->default(0);
            $table->timestamps();
        });

        Schema::table('carts', function (Blueprint $table) {
            if (Schema::hasColumn('carts', 'customer_id')) {
                $table->foreign('customer_id')
                    ->references('id')
                    ->on('customers')
                    ->onDelete('restrict');
            } else
                throw new \Exception('Column customer_id does not exist in carts table');

            if (Schema::hasColumn('carts', 'product_id')) {
                $table->foreign('product_id')
                    ->references('id')
                    ->on('products')
                    ->onDelete('restrict');
            } else
                throw new \Exception('Column product_id does not exist in carts table');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
            $table->dropForeign(['product_id']);
        });

        Schema::dropIfExists('carts');
    }
};
