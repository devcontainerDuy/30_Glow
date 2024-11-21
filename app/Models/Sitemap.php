<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sitemap extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sitemaps';

    protected $primaryKey = 'id';

    protected $fillable = [
        'page',
        'static_page',
        'content',
        'url',
        'status',
        'created_at',
        'updated_at',
    ];

    protected $dates = ['deleted_at'];

    public function scopeStaticPage($query)
    {
        return $query->where('static_page', 1);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
