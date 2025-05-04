<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Slide
 * 
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property int $is_active
 * @property string|null $url
 * @property string|null $image_path
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 *
 * @package App\Models
 */
class Slide extends Model
{
	use SoftDeletes;
	protected $table = 'slides';

	protected $casts = [
		'is_active' => 'int'
	];

	protected $fillable = [
		'name',
		'slug',
		'is_active',
		'url',
		'image_path'
	];
}
