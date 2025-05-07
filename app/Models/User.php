<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

/**
 * Class User
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
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property User|null $user
 * @property Collection|BookingStatusHistory[] $booking_status_histories
 * @property Collection|Booking[] $bookings
 * @property Collection|Customer[] $customers
 * @property Collection|Post[] $posts
 * @property Collection|User[] $users
 *
 * @package App\Models
 */
class User extends Authenticatable
{
	use HasFactory, Notifiable, SoftDeletes, HasRoles;
	protected $table = 'users';

	protected $casts = [
		'email_verified_at' => 'datetime',
		'password' => 'hashed',
		'status' => 'int',
		'banned_at' => 'datetime',
		'banned_by' => 'int'
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
		'remember_token'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'banned_by');
	}

	public function booking_status_histories()
	{
		return $this->hasMany(BookingStatusHistory::class, 'changed_by');
	}

	public function bookings()
	{
		return $this->hasMany(Booking::class);
	}

	public function customers()
	{
		return $this->hasMany(Customer::class, 'banned_by');
	}

	public function posts()
	{
		return $this->hasMany(Post::class);
	}

	public function users()
	{
		return $this->hasMany(User::class, 'banned_by');
	}
}
