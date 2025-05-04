<?php

use App\Enums\ProductStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('is_active');
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['parent_id', 'is_active']);
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('price', 12, 2)->unsigned(); // Sử dụng decimal cho giá
            $table->decimal('discount', 12, 2)->unsigned()->default(0);
            $table->decimal('final_price', 12, 2)->storedAs('price - discount'); // Giá cuối cùng tự động tính
            $table->text('description');
            $table->longText('content');
            $table->enum('status', ProductStatus::values())->default(ProductStatus::DRAFT->value);
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('stock_quantity')->default(0);
            $table->foreignId('brand_id')->constrained()->onDelete('restrict');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['brand_id', 'status', 'is_featured']);
        });

        Schema::create('category_product', function (Blueprint $table) {
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->primary(['category_id', 'product_id']); // Khóa chính composite
        });

        Schema::create('gallery', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('image_path');
            $table->unsignedSmallInteger('sort_order')->default(0); // Thứ tự hiển thị
            $table->string('alt_text')->nullable(); // Văn bản thay thế cho hình ảnh
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->index(['product_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery');
        Schema::dropIfExists('category_product');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('brands');
    }
};