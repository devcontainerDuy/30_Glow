<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Brands extends Model
{
    use HasFactory;

    protected $table = 'brands';

    protected $primaryKey = "id";

    protected $fillable = [
        'name',
        'slug',
        'status',
        'created_at',
        'updated_at'
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Products::class, 'id_brand', 'id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
