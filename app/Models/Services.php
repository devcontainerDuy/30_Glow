<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Services extends Model
{
    use HasFactory;

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

    public function collection(): BelongsTo
    {
        return $this->belongsTo(ServicesCollections::class, 'id_collection', 'id');
    }

    public function bookings(): BelongsTo
    {
        return $this->belongsTo(Bookings::class, 'id_service', 'id');
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
