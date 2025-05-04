<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public $tableName;
    public $columnsName;

    /**
     * Create a new migration instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->tableName = config('gso.tables');
        $this->columnsName = config('gso.columns');
    }

    /**
     * Run the migrations.
     * @return void
     * @throws \Exception
     */
    public function up(): void
    {
        if (empty($this->tableName)) {
            throw new \Exception('Error: config/gso.php not loaded. Run [php artisan config:clear] and try again.');
        }

        if (empty($this->columnsName)) {
            throw new \Exception('Error: config/gso.php not loaded. Run [php artisan config:clear] and try again.');
        }

        Schema::create($this->tableName["provinces"], function (Blueprint $table) {
            $table->engine('InnoDB');
            $table->bigIncrements('id'); // province id
            $table->string($this->columnsName["name"]);       // For MyISAM use string('name', 225); // (or 166 for InnoDB with Redundant/Compact row format)
            $table->string($this->columnsName["gso_id"]); // For MyISAM use string('guard_name', 25);
            $table->timestamps();
        });

        Schema::create($this->tableName["districts"], function (Blueprint $table) {
            $table->engine('InnoDB');
            $table->bigIncrements('id'); // district id
            $table->string($this->columnsName["name"]);       // For MyISAM use string('name', 225); // (or 166 for InnoDB with Redundant/Compact row format)
            $table->string($this->columnsName["gso_id"]); // For MyISAM use string('guard_name', 25);
            $table->unsignedBigInteger($this->columnsName["province_id"]);
            $table->timestamps();
        });

        Schema::create($this->tableName["wards"], function (Blueprint $table) {
            $table->engine('InnoDB');
            $table->bigIncrements('id'); // ward id
            $table->string($this->columnsName["name"]);       // For MyISAM use string('name', 225); // (or 166 for InnoDB with Redundant/Compact row format)
            $table->string($this->columnsName["gso_id"]); // For MyISAM use string('guard_name', 25);
            $table->unsignedBigInteger($this->columnsName["district_id"]);
            $table->timestamps();
        });

        Schema::table($this->tableName["districts"], function (Blueprint $table) {
            $table->foreign($this->columnsName["province_id"])
                ->references('id')
                ->on($this->tableName["provinces"])
                ->onDelete('cascade');
        });

        Schema::table($this->tableName["wards"], function (Blueprint $table) {
            $table->foreign($this->columnsName["district_id"])
                ->references('id')
                ->on($this->tableName["districts"])
                ->onDelete('cascade');
        });

        Schema::table($this->tableName["districts"], function (Blueprint $table) {
            $table->index([$this->columnsName["province_id"]], 'districts_province_id_index');
        });

        Schema::table($this->tableName["wards"], function (Blueprint $table) {
            $table->index([$this->columnsName["district_id"]], 'wards_district_id_index');
        });

        Schema::table($this->tableName["provinces"], function (Blueprint $table) {
            $table->index([$this->columnsName["gso_id"]], 'provinces_gso_id_index');
        });
    }

    /**
     * Reverse the migrations.
     * @return void
     * @throws \Exception
     */
    public function down(): void
    {
        if (empty($this->tableName)) {
            throw new \Exception('Error: config/gso.php not loaded. Run [php artisan config:clear] and try again.');
        }

        if (empty($this->columnsName)) {
            throw new \Exception('Error: config/gso.php not loaded. Run [php artisan config:clear] and try again.');
        }

        Schema::table($this->tableName["wards"], function (Blueprint $table) {
            $table->dropForeign([$this->columnsName["district_id"]]);
            $table->dropIndex('wards_district_id_index');
        });

        Schema::table($this->tableName["districts"], function (Blueprint $table) {
            $table->dropForeign([$this->columnsName["province_id"]]);
            $table->dropIndex('districts_province_id_index');
        });

        Schema::table($this->tableName["provinces"], function (Blueprint $table) {
            $table->dropIndex('provinces_gso_id_index');
        });

        Schema::dropIfExists($this->tableName["wards"]);
        Schema::dropIfExists($this->tableName["districts"]);
        Schema::dropIfExists($this->tableName["provinces"]);
    }
};
