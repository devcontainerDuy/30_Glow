<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Gallery
 * 
 * @property int $id
 * @property int $product_id
 * @property string $image_path
 * @property int $sort_order
 * @property string|null $alt_text
 * @property bool $is_default
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Product $product
 *
 * @package App\Models
 */
class Gallery extends Model
{
	protected $table = 'gallery';

	protected $casts = [
		'product_id' => 'int',
		'sort_order' => 'int',
		'is_default' => 'bool'
	];

	protected $fillable = [
		'product_id',
		'image_path',
		'sort_order',
		'alt_text',
		'is_default'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
