<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Posts extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'posts';

    protected $primaryKey = 'id';

    protected $fillable = [
        'title',
        'title',
        'slug',
        'summary',
        'image',
        'id_collection',
        'content',
        'status',
        'highlighted',
        'created_at',
        'updated_at',
    ];

    protected $dates = ['deleted_at'];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(PostCollections::class, 'id_collection', 'id');
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
