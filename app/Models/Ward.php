<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ward extends Model
{
    protected function __construct( array $attributes = []) 
    {
        parent::__construct($attributes);
        $this->setTable(config('gso.tables.wards'));
        $this->fillable([
            config('gso.columns.name'),
            config('gso.columns.gso_id'),
            config('gso.columns.district_id'),
        ]);
    }

    public function district()
    {
        return $this->belongsTo(District::class, 'district_id', 'id');
    }
}
