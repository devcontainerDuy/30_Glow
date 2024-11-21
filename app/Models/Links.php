<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Links extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'links';

    protected $primaryKey = 'id';

    protected $fillable = [
        'id_link',
        'id_parent',
        'type_1',
        'type_2',
        'status',
        'created_at',
        'updated_at',
    ];

    protected $dates = ['deleted_at'];

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
