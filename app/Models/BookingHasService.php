<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingHasService extends Model
{
    use HasFactory;

    protected $table = 'booking_has_services';
    protected $fillable = [
        'id_booking',
        'id_service',
    ];

    public $timestamps = false;

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Bookings::class, 'id_booking');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Services::class, 'id_service');
    }
}
