<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Categories extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'categories';

    protected $primaryKey = "id";

    protected $fillable = [
        'name',
        'slug',
        'id_parent',
        'status',
        'created_at',
        'updated_at'
    ];

    protected $dates = ['deleted_at'];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Categories::class, 'id_parent', 'id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Categories::class, 'id_parent', 'id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Products::class, 'id_category', 'id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
