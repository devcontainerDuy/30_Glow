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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->string('summary');
            $table->longText('image');
            $table->bigInteger('id_collection')->unsigned();
            $table->longText('content');
            $table->tinyInteger('status')->default(1);
            $table->tinyInteger('highlighted')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('posts', function (Blueprint $table) {
            if (Schema::hasColumn('posts', 'id_collection')) {
                $table->foreign('id_collection')->references('id')->on('post_collections')->onDelete('restrict');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
