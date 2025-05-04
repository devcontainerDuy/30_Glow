<?php

use App\Enums\BillsStatus;
use App\Enums\BillsType;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('code')->unique(); // Dùng UUID để bảo mật vd: 123e4567-e89b-12d3-a456-426614174000
            $table->foreignId('customer_id')
                ->constrained('customers')
                ->onDelete('restrict');
            $table->enum('status', OrderStatus::values())->default(OrderStatus::DRAFT->value);
            $table->text('shipping_address'); // Địa chỉ vận chuyển
            $table->decimal('shipping_fee', 10, 2)->default(0); // Phí vận chuyển
            $table->decimal('subtotal', 10, 2)->default(0); // Tổng tiền trước thuế
            $table->decimal('tax_amount', 10, 2)->default(0); // Thuế suất
            $table->decimal('total', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('voucher_id')
                ->nullable()
                ->constrained('vouchers')
                ->onDelete('set null'); // Khi xóa voucher, order vẫn giữ nguyên
            $table->timestamps();

            // Index cho hiệu năng
            $table->index(['customer_id', 'status']);
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('restrict');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2); // Giá tại thời điểm đặt hàng
            $table->decimal('total_price', 10, 2)->storedAs('quantity * unit_price'); // Tự động tính
            $table->timestamps();
        });

        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('restrict');
            $table->string('invoice_number')->unique(); // Số hóa đơn pháp lý vd: INV-001, INV-002
            $table->date('issue_date')->useCurrent(); // Ngày phát hành hóa đơn
            $table->enum('type', BillsType::values())->default(BillsType::FINAL->value); // Loại hóa đơn
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->enum('status', BillsStatus::values())->default(BillsStatus::DRAFT->value);
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bill_id')->constrained()->onDelete('restrict');
            $table->decimal('amount', 10, 2);
            $table->enum('method', PaymentMethod::values()); // Updated to use getValues()
            $table->enum('status', PaymentStatus::values())->default(PaymentStatus::PENDING->value);
            $table->string('transaction_id')->nullable(); // Mã giao dịch ngân hàng
            $table->timestamps();

            // Index
            $table->index(['bill_id', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('bills');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};