<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class District
 * 
 * @property int $id
 * @property string $name
 * @property string $gso_id
 * @property int $province_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Province $province
 * @property Collection|Ward[] $wards
 *
 * @package App\Models
 */
class District extends Model
{
	protected $table = 'districts';

	protected $casts = [
		'province_id' => 'int'
	];

	protected $fillable = [
		'name',
		'gso_id',
		'province_id'
	];

	public function province()
	{
		return $this->belongsTo(Province::class);
	}

	public function wards()
	{
		return $this->hasMany(Ward::class);
	}
}
