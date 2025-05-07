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
 * Class Comment
 * 
 * @property int $id
 * @property string $author_type
 * @property int $author_id
 * @property int|null $parent_id
 * @property string $content
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Comment|null $comment
 * @property Collection|CommentReaction[] $comment_reactions
 * @property Collection|Comment[] $comments
 *
 * @package App\Models
 */
class Comment extends Model
{
	use SoftDeletes;
	protected $table = 'comments';

	protected $casts = [
		'author_id' => 'int',
		'parent_id' => 'int'
	];

	protected $fillable = [
		'author_type',
		'author_id',
		'parent_id',
		'content',
		'status'
	];

	public function comment()
	{
		return $this->belongsTo(Comment::class, 'parent_id');
	}

	public function comment_reactions()
	{
		return $this->hasMany(CommentReaction::class);
	}

	public function comments()
	{
		return $this->hasMany(Comment::class, 'parent_id');
	}
}
