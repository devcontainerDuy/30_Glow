<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Voucher
 * 
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property string $discount_type
 * @property float $discount_value
 * @property float|null $max_discount
 * @property float $min_order_amount
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property int|null $usage_limit
 * @property int $used_count
 * @property int $per_user_limit
 * @property string $customer_type
 * @property int $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Order[] $orders
 * @property Collection|ServiceBill[] $service_bills
 * @property Collection|VoucherUser[] $voucher_users
 *
 * @package App\Models
 */
class Voucher extends Model
{
	protected $table = 'vouchers';

	protected $casts = [
		'discount_value' => 'float',
		'max_discount' => 'float',
		'min_order_amount' => 'float',
		'start_date' => 'datetime',
		'end_date' => 'datetime',
		'usage_limit' => 'int',
		'used_count' => 'int',
		'per_user_limit' => 'int',
		'status' => 'int'
	];

	protected $fillable = [
		'code',
		'name',
		'description',
		'discount_type',
		'discount_value',
		'max_discount',
		'min_order_amount',
		'start_date',
		'end_date',
		'usage_limit',
		'used_count',
		'per_user_limit',
		'customer_type',
		'status'
	];

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
