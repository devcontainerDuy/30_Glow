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
 * Class Classification
 * 
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Collection|Post[] $posts
 *
 * @package App\Models
 */
class Classification extends Model
{
	use SoftDeletes;
	protected $table = 'classifications';

	protected $fillable = [
		'name',
		'slug',
		'status'
	];

	public function posts()
	{
		return $this->hasMany(Post::class);
	}
}
