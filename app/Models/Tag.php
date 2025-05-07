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
 * Class Tag
 * 
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Collection|Post[] $posts
 *
 * @package App\Models
 */
class Tag extends Model
{
	use SoftDeletes;
	protected $table = 'tags';

	protected $casts = [
		'is_active' => 'bool'
	];

	protected $fillable = [
		'name',
		'slug',
		'is_active'
	];

	public function posts()
	{
		return $this->belongsToMany(Post::class, 'post_has_tag');
	}
}
