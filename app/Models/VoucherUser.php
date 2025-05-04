<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class VoucherUser
 * 
 * @property int $voucher_id
 * @property int $customer_id
 * @property int $times_used
 * 
 * @property Customer $customer
 * @property Voucher $voucher
 *
 * @package App\Models
 */
class VoucherUser extends Model
{
	protected $table = 'voucher_user';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'voucher_id' => 'int',
		'customer_id' => 'int',
		'times_used' => 'int'
	];

	protected $fillable = [
		'times_used'
	];

	public function customer()
	{
		return $this->belongsTo(Customer::class);
	}

	public function voucher()
	{
		return $this->belongsTo(Voucher::class);
	}
}
