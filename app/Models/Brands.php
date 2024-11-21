<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brands extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'brands';

    protected $primaryKey = "id";

    protected $fillable = [
        'name',
        'slug',
        'status',
        'created_at',
        'updated_at'
    ];

    protected $dates = ['deleted_at'];

    public function products(): HasMany
    {
        return $this->hasMany(Products::class, 'id_brand', 'id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
