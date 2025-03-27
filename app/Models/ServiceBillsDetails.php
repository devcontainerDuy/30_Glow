<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceBillsDetails extends Model
{
    use HasFactory;

    protected $table = 'service_bills_details';

    protected $primaryKey = 'id';

    protected $fillable = [
        'id_service_bill',
        'id_service',
        'unit_price',
        'created_at',
        'updated_at',
    ];

    public function serviceBill(): BelongsTo
    {
        return $this->belongsTo(ServiceBills::class, 'id_service_bill', 'id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Services::class, 'id_service', 'id');
    }
}