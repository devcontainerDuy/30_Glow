<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Order
 * 
 * @property int $id
 * @property string $code
 * @property int $customer_id
 * @property string $status
 * @property string $shipping_address
 * @property float $shipping_fee
 * @property float $subtotal
 * @property float $tax_amount
 * @property float $total
 * @property string|null $notes
 * @property int|null $voucher_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Customer $customer
 * @property Voucher|null $voucher
 * @property Collection|Bill[] $bills
 * @property Collection|OrderItem[] $order_items
 *
 * @package App\Models
 */
class Order extends Model
{
	protected $table = 'orders';

	protected $casts = [
		'customer_id' => 'int',
		'shipping_fee' => 'float',
		'subtotal' => 'float',
		'tax_amount' => 'float',
		'total' => 'float',
		'voucher_id' => 'int'
	];

	protected $fillable = [
		'code',
		'customer_id',
		'status',
		'shipping_address',
		'shipping_fee',
		'subtotal',
		'tax_amount',
		'total',
		'notes',
		'voucher_id'
	];

	public function customer()
	{
		return $this->belongsTo(Customer::class);
	}

	public function voucher()
	{
		return $this->belongsTo(Voucher::class);
	}

	public function bills()
	{
		return $this->hasMany(Bill::class);
	}

	public function order_items()
	{
		return $this->hasMany(OrderItem::class);
	}
}
