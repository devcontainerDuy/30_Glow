<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class ServicesCollection
 * 
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property bool $is_active
 * @property bool $is_highlighted
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Collection|Service[] $services
 *
 * @package App\Models
 */
class ServicesCollection extends Model
{
	use SoftDeletes;
	protected $table = 'services_collections';

	protected $casts = [
		'is_active' => 'bool',
		'is_highlighted' => 'bool'
	];

	protected $fillable = [
		'name',
		'slug',
		'is_active',
		'is_highlighted'
	];

	public function services()
	{
		return $this->hasMany(Service::class, 'collection_id');
	}
}
