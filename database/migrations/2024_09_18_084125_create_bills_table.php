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
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->bigInteger('customer_id')->unsigned();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('address');
            $table->string('note')->nullable();
            $table->string('name_other')->nullable();
            $table->string('email_other')->nullable();
            $table->string('phone_other')->nullable();
            $table->string('address_other')->nullable();
            $table->string('note_other')->nullable();
            $table->string('payment_method');
            $table->decimal('total', 10, 2)->default(0);
            $table->string('transaction_id')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
        });

        if (Schema::hasTable('bills')) {
            Schema::table('bills', function (Blueprint $table) {
                if (Schema::hasColumn('bills', 'customer_id')) {
                    $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
