<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class BookingStatusHistory
 * 
 * @property int $id
 * @property int $booking_id
 * @property string $status
 * @property int|null $changed_by
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Booking $booking
 * @property User|null $user
 *
 * @package App\Models
 */
class BookingStatusHistory extends Model
{
	protected $table = 'booking_status_histories';

	protected $casts = [
		'booking_id' => 'int',
		'changed_by' => 'int'
	];

	protected $fillable = [
		'booking_id',
		'status',
		'changed_by',
		'notes'
	];

	public function booking()
	{
		return $this->belongsTo(Booking::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class, 'changed_by');
	}
}
