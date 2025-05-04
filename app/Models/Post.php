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
 * Class Post
 * 
 * @property int $id
 * @property int|null $user_id
 * @property int $classification_id
 * @property string $title
 * @property string $slug
 * @property string $author
 * @property string $summary
 * @property string|null $image_path
 * @property string $content
 * @property string $status
 * @property bool $is_featured
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Classification $classification
 * @property User|null $user
 * @property Collection|Tag[] $tags
 *
 * @package App\Models
 */
class Post extends Model
{
	use SoftDeletes;
	protected $table = 'posts';

	protected $casts = [
		'user_id' => 'int',
		'classification_id' => 'int',
		'is_featured' => 'bool',
		'published_at' => 'datetime'
	];

	protected $fillable = [
		'user_id',
		'classification_id',
		'title',
		'slug',
		'author',
		'summary',
		'image_path',
		'content',
		'status',
		'is_featured',
		'published_at'
	];

	public function classification()
	{
		return $this->belongsTo(Classification::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function tags()
	{
		return $this->belongsToMany(Tag::class, 'post_has_tag');
	}
}
