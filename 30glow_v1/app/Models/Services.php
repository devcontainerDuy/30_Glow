<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Services extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'services';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'slug',
        'price',
        'compare_price',
        'discount',
        'summary',
        'id_collection',
        'image',
        'content',
        'status',
        'highlighted',
        'created_at',
        'updated_at',
    ];

    protected $dates = ['deleted_at'];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(ServicesCollections::class, 'id_collection', 'id');
    }

    public function bookings(): BelongsToMany
    {
        return $this->belongsToMany(Bookings::class, 'booking_has_services', 'id_service', 'id_booking');
    }

    public function serviceDetailsBills(): BelongsTo
    {
        return $this->belongsTo(ServiceBillsDetails::class, 'id', 'id_service');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeHighlighted($query)
    {
        return $query->where('highlighted', 1);
    }
}