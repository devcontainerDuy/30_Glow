<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Product
 * 
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property float $price
 * @property float $discount
 * @property float|null $final_price
 * @property string $description
 * @property string $content
 * @property string $status
 * @property bool $is_featured
 * @property int $stock_quantity
 * @property int $brand_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Brand $brand
 * @property Collection|Cart[] $carts
 * @property Collection|Category[] $categories
 * @property Collection|Gallery[] $galleries
 * @property Collection|OrderItem[] $order_items
 *
 * @package App\Models
 */
class Product extends Model
{
	use SoftDeletes;
	protected $table = 'products';

	protected $casts = [
		'price' => 'float',
		'discount' => 'float',
		'final_price' => 'float',
		'is_featured' => 'bool',
		'stock_quantity' => 'int',
		'brand_id' => 'int'
	];

	protected $fillable = [
		'name',
		'slug',
		'price',
		'discount',
		'final_price',
		'description',
		'content',
		'status',
		'is_featured',
		'stock_quantity',
		'brand_id'
	];

	public function brand()
	{
		return $this->belongsTo(Brand::class);
	}

	public function carts()
	{
		return $this->hasMany(Cart::class);
	}

	public function categories()
	{
		return $this->belongsToMany(Category::class);
	}

	public function galleries()
	{
		return $this->hasMany(Gallery::class);
	}

	public function order_items()
	{
		return $this->hasMany(OrderItem::class);
	}
}
