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
        Schema::table('bills', function (Blueprint $table) {
            $table->bigInteger('customer_id')->unsigned()->after('uid');
            $table->string('name_other')->nullable()->after('note');
            $table->string('email_other')->nullable()->after('name_other');
            $table->string('phone_other')->nullable()->after('email_other');
            $table->string('address_other')->nullable()->after('phone_other');
            $table->string('note_other')->nullable()->after('address_other');
            $table->string('payment_method')->nullable()->after('note_other');
            $table->bigInteger('total')->default(0)->after('transaction_id');
        });

        if (Schema::hasTable('bills')) {
            Schema::table('bills', function (Blueprint $table) {
                if (Schema::hasColumn('bills', 'customer_id')) {
                    $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
                }
            });
        }

        Schema::table('bills_details', function (Blueprint $table) {
            $table->bigInteger("unit_price");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bills', function (Blueprint $table) {
            $table->dropColumn('user_id');
            $table->dropColumn('name_other');
            $table->dropColumn('email_other');
            $table->dropColumn('phone_other');
            $table->dropColumn('address_other');
            $table->dropColumn('note_other');
            $table->dropColumn('transaction_id');
            $table->dropColumn('total');
        });
    }
};
