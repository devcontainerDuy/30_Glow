<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Booking
 * 
 * @property int $id
 * @property int $customer_id
 * @property int|null $user_id
 * @property int|null $assigned_user_id
 * @property int $service_id
 * @property Carbon $booking_time
 * @property Carbon|null $estimated_end_time
 * @property Carbon|null $actual_start_time
 * @property Carbon|null $actual_end_time
 * @property string $status
 * @property string|null $note
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property User|null $user
 * @property Customer $customer
 * @property Service $service
 * @property Collection|BookingStatusHistory[] $booking_status_histories
 * @property Collection|ServiceBill[] $service_bills
 * @property Collection|ServiceTransaction[] $service_transactions
 *
 * @package App\Models
 */
class Booking extends Model
{
	protected $table = 'bookings';

	protected $casts = [
		'customer_id' => 'int',
		'user_id' => 'int',
		'assigned_user_id' => 'int',
		'service_id' => 'int',
		'booking_time' => 'datetime',
		'estimated_end_time' => 'datetime',
		'actual_start_time' => 'datetime',
		'actual_end_time' => 'datetime'
	];

	protected $fillable = [
		'customer_id',
		'user_id',
		'assigned_user_id',
		'service_id',
		'booking_time',
		'estimated_end_time',
		'actual_start_time',
		'actual_end_time',
		'status',
		'note'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function customer()
	{
		return $this->belongsTo(Customer::class);
	}

	public function service()
	{
		return $this->belongsTo(Service::class);
	}

	public function booking_status_histories()
	{
		return $this->hasMany(BookingStatusHistory::class);
	}

	public function service_bills()
	{
		return $this->hasMany(ServiceBill::class);
	}

	public function service_transactions()
	{
		return $this->hasMany(ServiceTransaction::class);
	}
}
