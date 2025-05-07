<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Province
 * 
 * @property int $id
 * @property string $name
 * @property string $gso_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|District[] $districts
 *
 * @package App\Models
 */
class Province extends Model
{
	protected $table = 'provinces';

	protected $fillable = [
		'name',
		'gso_id'
	];

	public function districts()
	{
		return $this->hasMany(District::class);
	}
}
