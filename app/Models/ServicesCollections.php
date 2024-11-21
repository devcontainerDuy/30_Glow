<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServicesCollections extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'services_collections';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'slug',
        'status',
        'highlighted',
        'created_at',
        'updated_at',
    ];

    protected $dates = ['deleted_at'];

    public function services(): HasMany
    {
        return $this->hasMany(Services::class, 'id_collection', 'id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeHighlighted($query)
    {
        return $query->where('highlighted', 1);
    }
}
