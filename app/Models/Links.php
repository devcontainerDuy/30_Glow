<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Links extends Model
{
    use HasFactory;

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

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
