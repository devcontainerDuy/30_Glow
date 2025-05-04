<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ServiceBill
 * 
 * @property int $id
 * @property string $uid
 * @property int $customer_id
 * @property int $booking_id
 * @property int|null $voucher_id
 * @property float $subtotal
 * @property float $tax_amount
 * @property float|null $total
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Booking $booking
 * @property Customer $customer
 * @property Voucher|null $voucher
 *
 * @package App\Models
 */
class ServiceBill extends Model
{
	protected $table = 'service_bills';

	protected $casts = [
		'customer_id' => 'int',
		'booking_id' => 'int',
		'voucher_id' => 'int',
		'subtotal' => 'float',
		'tax_amount' => 'float',
		'total' => 'float'
	];

	protected $fillable = [
		'uid',
		'customer_id',
		'booking_id',
		'voucher_id',
		'subtotal',
		'tax_amount',
		'total',
		'status'
	];

	public function booking()
	{
		return $this->belongsTo(Booking::class);
	}

	public function customer()
	{
		return $this->belongsTo(Customer::class);
	}

	public function voucher()
	{
		return $this->belongsTo(Voucher::class);
	}
}
