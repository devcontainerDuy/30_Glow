<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Contact
 * 
 * @property int $id
 * @property string $author_type
 * @property int $author_id
 * @property string $subject
 * @property string $message
 * @property string $email
 * @property string|null $phone
 * @property string|null $note
 * @property int $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 *
 * @package App\Models
 */
class Contact extends Model
{
	use SoftDeletes;
	protected $table = 'contacts';

	protected $casts = [
		'author_id' => 'int',
		'status' => 'int'
	];

	protected $fillable = [
		'author_type',
		'author_id',
		'subject',
		'message',
		'email',
		'phone',
		'note',
		'status'
	];
}
