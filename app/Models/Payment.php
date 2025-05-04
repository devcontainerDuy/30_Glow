<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Payment
 * 
 * @property int $id
 * @property int $bill_id
 * @property float $amount
 * @property string $method
 * @property string $status
 * @property string|null $transaction_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Bill $bill
 *
 * @package App\Models
 */
class Payment extends Model
{
	protected $table = 'payments';

	protected $casts = [
		'bill_id' => 'int',
		'amount' => 'float'
	];

	protected $fillable = [
		'bill_id',
		'amount',
		'method',
		'status',
		'transaction_id'
	];

	public function bill()
	{
		return $this->belongsTo(Bill::class);
	}
}
