<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class CategoryProduct
 * 
 * @property int $category_id
 * @property int $product_id
 * 
 * @property Category $category
 * @property Product $product
 *
 * @package App\Models
 */
class CategoryProduct extends Model
{
	protected $table = 'category_product';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'category_id' => 'int',
		'product_id' => 'int'
	];

	public function category()
	{
		return $this->belongsTo(Category::class);
	}

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
