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
 * Class Service
 * 
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property float $price
 * @property float $discount
 * @property float|null $final_price
 * @property string $summary
 * @property int $collection_id
 * @property string|null $image_path
 * @property string $content
 * @property string $status
 * @property bool $is_highlighted
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property ServicesCollection $services_collection
 * @property Collection|Booking[] $bookings
 * @property Collection|ServiceTransaction[] $service_transactions
 *
 * @package App\Models
 */
class Service extends Model
{
	use SoftDeletes;
	protected $table = 'services';

	protected $casts = [
		'price' => 'float',
		'discount' => 'float',
		'final_price' => 'float',
		'collection_id' => 'int',
		'is_highlighted' => 'bool'
	];

	protected $fillable = [
		'name',
		'slug',
		'price',
		'discount',
		'final_price',
		'summary',
		'collection_id',
		'image_path',
		'content',
		'status',
		'is_highlighted'
	];

	public function services_collection()
	{
		return $this->belongsTo(ServicesCollection::class, 'collection_id');
	}

	public function bookings()
	{
		return $this->hasMany(Booking::class);
	}

	public function service_transactions()
	{
		return $this->hasMany(ServiceTransaction::class);
	}
}
