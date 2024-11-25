<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bills extends Model
{
    use HasFactory;

    protected $table = "bills";

    protected $primaryKey = "id";

    protected $fillable = [
        'uid',
        'customer_id',
        'name',
        'email',
        'phone',
        'address',
        'note',
        'name_order',
        'email_order',
        'phone_order',
        'address_order',
        'note_order',
        'payment_method',
        'total',
        'transaction_id',
        'status',
        'created_at',
        'updated_at',
    ];

    public function billDetail(): HasMany
    {
        return $this->hasMany(BillsDetail::class, 'id_bill', 'id');
    }
    public function customer()
    {
        return $this->belongsTo(Customers::class, 'customer_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
    public function scopeMonthlyRevenue(Builder $query)
    {
        return $query->selectRaw('MONTH(created_at) as month, SUM(total) as revenue')
            ->groupBy('month')
            ->orderBy('month', 'asc');
    }
}