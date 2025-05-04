<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected function __construct( array $attributes = []) 
    {
        parent::__construct($attributes);
        $this->setTable(config('gso.tables.provinces'));
        $this->fillable([
            config('gso.columns.name'),
            config('gso.columns.gso_id'),
        ]);
    }

    public function district()
    {
        return $this->hasMany(District::class, 'district_id', 'id');
    }
}
