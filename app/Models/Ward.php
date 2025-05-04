<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Ward
 * 
 * @property int $id
 * @property string $name
 * @property string $gso_id
 * @property int $district_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property District $district
 *
 * @package App\Models
 */
class Ward extends Model
{
	protected $table = 'wards';

	protected $casts = [
		'district_id' => 'int'
	];

	protected $fillable = [
		'name',
		'gso_id',
		'district_id'
	];

	public function district()
	{
		return $this->belongsTo(District::class);
	}
}
