<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contacts extends Model
{
    use HasFactory;
    protected $table = 'contacts';

    protected $primaryKey = "id";

    protected $illable = [
        'name',
        'email',
        'phone',
        'message',
        'note',
        'status',
        'created_at',
        'updated_at'
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
