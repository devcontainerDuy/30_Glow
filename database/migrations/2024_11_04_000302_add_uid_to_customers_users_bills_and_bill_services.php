<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->uuid('uid')->unique()->after('id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->uuid('uid')->unique()->after('id');
        });

        Schema::table('bills', function (Blueprint $table) {
            $table->uuid('uid')->unique()->after('id');
        });

        Schema::table('service_bills', function (Blueprint $table) {
            $table->uuid('uid')->unique()->after('id');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('uid');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('uid');
        });

        Schema::table('bills', function (Blueprint $table) {
            $table->dropColumn('uid');
        });

        Schema::table('service_bills', function (Blueprint $table) {
            $table->dropColumn('uid');
        });
    }
};
