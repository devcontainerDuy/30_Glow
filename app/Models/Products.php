<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Products extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'slug',
        'price',
        'discount',
        'content',
        'status',
        "highlighted",
        'id_category',
        'id_brand',
        'in_stock',
        'created_at',
        'updated_at',
    ];

    protected $hidden = ['created_at', 'updated_at'];
    // protected $appends = ['category_data', 'brand_data', 'gallery_data'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class, 'id_category', 'id');
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brands::class, 'id_brand', 'id');
    }

    public function bill_detail(): HasMany
    {
        return $this->hasMany(BillsDetail::class, 'id_product', 'id');
    }

    public function cart(): HasMany
    {
        return $this->hasMany(Carts::class, 'id_product', 'id');
    }

    public function gallery(): HasMany
    {
        return $this->hasMany(Gallery::class, 'id_parent', 'id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeHighlighted($query)
    {
        return $query->where('highlighted', 1);
    }

    public function scopeRelatedProducts()
    {
        return $this->hasMany(self::class, 'id_category', 'id_category')->where('id', '!=', $this->id)->active()->limit(5);
    }

    public function getCategoryDataAttribute()
    {
        if ($this->category) {
            return [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
                'status' => $this->category->status,
            ];
        }
        return null;
    }

    public function getBrandDataAttribute()
    {
        if ($this->brand) {
            return [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
                'slug' => $this->brand->slug,
                'status' => $this->brand->status,
            ];
        }
        return null;
    }

    public function getGalleryDataAttribute()
    {
        return $this->gallery->map(function ($item) {
            return [
                'id' => $item->id,
                'image' => $item->image,
                'id_parent' => $item->id_parent,
                'status' => $item->status,
            ];
        });
    }
}
