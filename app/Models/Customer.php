<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

/**
 * Class Customer
 * 
 * @property int $id
 * @property string $uid
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string|null $phone
 * @property string|null $address
 * @property int $status
 * @property Carbon|null $banned_at
 * @property string|null $ban_reason
 * @property int|null $banned_by
 * @property string $password
 * @property string|null $social_id
 * @property string|null $social_type
 * @property string|null $ip_address
 * @property int $last_activity
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property User|null $user
 * @property Collection|Booking[] $bookings
 * @property Collection|Cart[] $carts
 * @property Collection|Order[] $orders
 * @property Collection|ServiceBill[] $service_bills
 * @property Collection|VoucherUser[] $voucher_users
 *
 * @package App\Models
 */
class Customer extends Model
{
	use SoftDeletes, HasApiTokens;
	protected $table = 'customers';

	protected $casts = [
		'email_verified_at' => 'datetime',
		'status' => 'int',
		'banned_at' => 'datetime',
		'banned_by' => 'int',
		'last_activity' => 'int'
	];

	protected $hidden = [
		'password',
		'remember_token'
	];

	protected $fillable = [
		'uid',
		'name',
		'email',
		'email_verified_at',
		'phone',
		'address',
		'status',
		'banned_at',
		'ban_reason',
		'banned_by',
		'password',
		'social_id',
		'social_type',
		'ip_address',
		'last_activity',
		'remember_token'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'banned_by');
	}

	public function bookings()
	{
		return $this->hasMany(Booking::class);
	}

	public function carts()
	{
		return $this->hasMany(Cart::class);
	}

	public function orders()
	{
		return $this->hasMany(Order::class);
	}

	public function service_bills()
	{
		return $this->hasMany(ServiceBill::class);
	}

	public function voucher_users()
	{
		return $this->hasMany(VoucherUser::class);
	}
}
