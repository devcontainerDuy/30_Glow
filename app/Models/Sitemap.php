<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Sitemap
 * 
 * @property int $id
 * @property string $url
 * @property Carbon|null $lastmod
 * @property string|null $changefreq
 * @property float|null $priority
 * @property int $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 *
 * @package App\Models
 */
class Sitemap extends Model
{
	use SoftDeletes;
	protected $table = 'sitemaps';

	protected $casts = [
		'lastmod' => 'datetime',
		'priority' => 'float',
		'status' => 'int'
	];

	protected $fillable = [
		'url',
		'lastmod',
		'changefreq',
		'priority',
		'status'
	];
}
