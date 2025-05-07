<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Bill
 * 
 * @property int $id
 * @property int $order_id
 * @property string $invoice_number
 * @property Carbon $issue_date
 * @property string $type
 * @property float $subtotal
 * @property float $tax_amount
 * @property float $total
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Order $order
 * @property Collection|Payment[] $payments
 * @property Collection|ServiceTransaction[] $service_transactions
 *
 * @package App\Models
 */
class Bill extends Model
{
	protected $table = 'bills';

	protected $casts = [
		'order_id' => 'int',
		'issue_date' => 'datetime',
		'subtotal' => 'float',
		'tax_amount' => 'float',
		'total' => 'float'
	];

	protected $fillable = [
		'order_id',
		'invoice_number',
		'issue_date',
		'type',
		'subtotal',
		'tax_amount',
		'total',
		'status'
	];

	public function order()
	{
		return $this->belongsTo(Order::class);
	}

	public function payments()
	{
		return $this->hasMany(Payment::class);
	}

	public function service_transactions()
	{
		return $this->hasMany(ServiceTransaction::class);
	}
}
