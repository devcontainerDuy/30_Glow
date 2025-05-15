<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contacts extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'contacts';

    protected $primaryKey = "id";

    protected $fillable  = [
        'name',
        'email',
        'phone',
        'message',
        'note',
        'status',
        'created_at',
        'updated_at'
    ];

    protected $dates = ['deleted_at'];

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
