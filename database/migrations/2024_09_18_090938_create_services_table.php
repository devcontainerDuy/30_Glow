<?php

use App\Enums\ServiceStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('services_collections', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_highlighted')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'is_highlighted']);
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('price', 10, 2)->unsigned()->default(0);
            $table->decimal('discount', 10, 2)->unsigned()->default(0);
            $table->decimal('final_price', 10, 2)->storedAs('price - discount');
            $table->text('summary');
            $table->foreignId('collection_id')->constrained('services_collections')->onDelete('restrict');
            $table->string('image_path')->nullable();
            $table->longText('content');
            $table->enum('status', ServiceStatus::values())->default(ServiceStatus::DRAFT);
            $table->boolean('is_highlighted')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['collection_id', 'status']);
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('customer_id')->constrained()->onDelete('restrict');
            $table->dateTime('booking_time');
            $table->text('note')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->timestamps();

            $table->index(['booking_time', 'status']);
        });

        Schema::create('service_bills', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('customer_id')->constrained()->onDelete('restrict');
            $table->foreignId('booking_id')->constrained()->unique()->onDelete('restrict');
            $table->foreignId('voucher_id')
                ->nullable()
                ->constrained('vouchers')
                ->onDelete('set null');
            $table->decimal('subtotal', 10, 2); // Tổng tiền trước thuế
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->storedAs('subtotal + tax_amount'); // Tự động tính
            $table->enum('status', ['draft', 'pending', 'paid', 'cancelled', 'refunded'])->default('draft');
            $table->timestamps();

            $table->index(['customer_id', 'status']);
        });

        Schema::create('service_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('bill_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('service_id')->constrained()->onDelete('restrict');
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('estimated_price', 10, 2);
            $table->decimal('final_price', 10, 2)->nullable();
            $table->decimal('total_price', 10, 2)->storedAs('COALESCE(final_price, estimated_price) * quantity'); // Tính toán tự động
            $table->enum('stage', ['booking', 'billed']);
            $table->timestamps();

            $table->index(['booking_id', 'bill_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_transactions');
        Schema::dropIfExists('service_bills');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('services');
        Schema::dropIfExists('services_collections');
    }
};
