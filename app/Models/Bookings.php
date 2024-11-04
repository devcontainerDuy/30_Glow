<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Bookings extends Model
{
    use HasFactory;

    protected $table = 'bookings';

    protected $primaryKey = "id";

    protected $fillable = [
        'id_user',
        'id_customer',
        'time',
        'note',
        'status',
        'created_at',
        'updated_at'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customers::class, 'id_customer', 'id');
    }

    public function service(): BelongsToMany
    {
        return $this->belongsToMany(Services::class, 'booking_has_services', 'id_booking', 'id_service');
    }

    public function serviceDetailsBills(): BelongsTo
    {
        return $this->belongsTo(ServiceBillsDetails::class, 'id', 'id_booking');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
