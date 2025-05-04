<?php

use App\Enums\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Mã giảm giá (VD: SALE20)
            $table->string('name'); // Tên chương trình (VD: Giảm 20% Tết 2024)
            $table->text('description')->nullable();
            $table->enum('discount_type', ['percentage', 'fixed_amount']); // Loại giảm giá: percentage (%) hoặc fixed_amount (tiền mặt)
            $table->decimal('discount_value', 10, 2); // Giá trị giảm giá (VD: 20% hoặc 100000 đồng)
            $table->decimal('max_discount', 10, 2)->nullable(); // Giới hạn tối đa (nếu giảm theo %)
            $table->decimal('min_order_amount', 10, 2)->default(0); // Đơn tối thiểu
            $table->dateTime('start_date'); // Ngày bắt đầu
            $table->dateTime('end_date'); // Ngày kết thúc
            $table->integer('usage_limit')->nullable(); // Tổng số lần
            $table->integer('used_count')->default(0); // Đã dùng
            $table->enum('customer_type', ['all', 'specific'])->default('all');
            $table->tinyInteger('status')->default(1); // Trạng thái: 1 (hoạt động), 0 (không hoạt động)
            $table->timestamps();
        });

        // Bảng trung gian áp dụng cho user cụ thể (nếu customer_type = 'specific')
        Schema::create('voucher_user', function (Blueprint $table) {
            $table->foreignId('voucher_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->primary(['voucher_id', 'customer_id']); // Khóa chính composite
        });
    }

    public function down()
    {
        Schema::dropIfExists('voucher_user');
        Schema::dropIfExists('vouchers');
    }
};