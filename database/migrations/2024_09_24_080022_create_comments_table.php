<?php

use App\Enums\CommentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->morphs('author');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade');
            $table->text('content');
            $table->enum('status', CommentStatus::values())->default(CommentStatus::PENDING->value);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('comment_reactions', function (Blueprint $table) {
            $table->id();
            $table->morphs('reactor');
            $table->foreignId('comment_id')->constrained()->onDelete('cascade');
            $table->enum('reaction', ['like', 'dislike', 'heart']);
            $table->timestamps();

            $table->unique(['comment_id', 'reactor_type', 'reactor_id']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comment_reactions');
        Schema::dropIfExists('comment');
    }
};