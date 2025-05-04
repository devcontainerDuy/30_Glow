<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected function __construct( array $attributes = []) 
    {
        parent::__construct($attributes);
        $this->setTable(config('gso.tables.districts'));
        $this->fillable([
            config('gso.columns.name'),
            config('gso.columns.gso_id'),
            config('gso.columns.province_id'),
        ]);
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }

    public function ward()
    {
        return $this->hasMany(Ward::class, 'ward_id', 'id');
    }
}
