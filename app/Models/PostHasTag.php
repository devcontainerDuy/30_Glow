<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class PostHasTag
 * 
 * @property int $post_id
 * @property int $tag_id
 * 
 * @property Post $post
 * @property Tag $tag
 *
 * @package App\Models
 */
class PostHasTag extends Model
{
	protected $table = 'post_has_tag';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'post_id' => 'int',
		'tag_id' => 'int'
	];

	public function post()
	{
		return $this->belongsTo(Post::class);
	}

	public function tag()
	{
		return $this->belongsTo(Tag::class);
	}
}
