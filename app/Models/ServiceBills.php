<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceBills extends Model
{
    use HasFactory;

    protected $table = "service_bills";

    protected $primaryKey = "id";

    protected $fillable = [
        'uid',
        "id_customer",
        "id_booking",
        "total",
        "status",
        "created_at",
        "updated_at"
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customers::class, 'id_customer', 'id');
    }
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Bookings::class, 'id_booking', 'id');
    }

    public function serviceBillDetails(): HasMany
    {
        return $this->hasMany(ServiceBillsDetails::class, 'id_service_bill', 'id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
    public function scopeMonthlyRevenue(Builder $query)
    {
        return $query->selectRaw('MONTH(created_at) as month, SUM(total) as revenue')
            ->where('status', 1)
            ->groupBy('month')
            ->orderBy('month', 'asc');
    }
}
