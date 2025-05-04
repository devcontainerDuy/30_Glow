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
            $table->tinyInteger('payment_status')->default(0)->after('payment_method')->comment('0 - Chưa thanh toán, 1 - Đã thanh toán, 2 - Thất bại, 3 - Đã hoàn trả (nếu có)');
            $table->smallInteger('status')->default(0)->comment(' 0 - Đang chờ xử lý, 1 - Đã xác nhận, 2 - Đã giao đơn vị vận chuyển, 3 - Đang giao hàng, 4 - Đã giao hàng, 5 - Khách hàng từ chối nhận hàng, 6 - Đã hoàn trả')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bills', function (Blueprint $table) {
            $table->dropColumn('payment_status');
            $table->dropColumn('status');
        });
    }
};
