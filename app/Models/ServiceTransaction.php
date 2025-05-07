<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ServiceTransaction
 * 
 * @property int $id
 * @property int $booking_id
 * @property int|null $bill_id
 * @property int $service_id
 * @property int $quantity
 * @property float $estimated_price
 * @property float|null $final_price
 * @property float|null $total_price
 * @property string $stage
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Bill|null $bill
 * @property Booking $booking
 * @property Service $service
 *
 * @package App\Models
 */
class ServiceTransaction extends Model
{
	protected $table = 'service_transactions';

	protected $casts = [
		'booking_id' => 'int',
		'bill_id' => 'int',
		'service_id' => 'int',
		'quantity' => 'int',
		'estimated_price' => 'float',
		'final_price' => 'float',
		'total_price' => 'float'
	];

	protected $fillable = [
		'booking_id',
		'bill_id',
		'service_id',
		'quantity',
		'estimated_price',
		'final_price',
		'total_price',
		'stage'
	];

	public function bill()
	{
		return $this->belongsTo(Bill::class);
	}

	public function booking()
	{
		return $this->belongsTo(Booking::class);
	}

	public function service()
	{
		return $this->belongsTo(Service::class);
	}
}
