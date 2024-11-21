<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostCollections extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'post_collections';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'slug',
        'status',
        'created_at',
        'updated_at',
    ];

    protected $dates = ['deleted_at'];

    public function posts()
    {
        return $this->hasMany(Posts::class, 'id_collection', 'id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
