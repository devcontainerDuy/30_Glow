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
        Schema::create('comment', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('id_product')->unsigned()->nullable();
            $table->bigInteger('id_customer')->unsigned()->nullable();
            $table->bigInteger('id_user')->unsigned()->nullable();
            $table->bigInteger('id_service')->unsigned()->nullable();
            $table->text('comment');
            $table->tinyInteger('status')->nullable()->default(0); // 0 = off, 1 = active
            // $table->bigInteger('likes')->nullable()->default(0);
            // $table->bigInteger('dislikes')->nullable()->default(0);
            // $table->bigInteger('heart')->nullable()->default(0);
            $table->bigInteger('id_parent')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('comment', function (Blueprint $table) {
            if (Schema::hasTable('comment')) {
                $table->foreign('id_product')->references('id')->on('products');
                $table->foreign('id_customer')->references('id')->on('customers');
                $table->foreign('id_user')->references('id')->on('users');
                $table->foreign('id_service')->references('id')->on('services');
                $table->foreign('id_parent')->references('id')->on('comment')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comment');
    }
};