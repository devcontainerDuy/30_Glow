<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillsDetail extends Model
{
    use HasFactory;
    protected $table = 'bills_details';

    protected $primaryKey = "id";

    protected $fillable = [
        'id_bill',
        'id_product',
        'quantity',
        'created_at',
        'updated_at',
        'unit_price'
    ];

    public function bill(): BelongsTo
    {
        return $this->belongsTo(Bills::class, 'id_bill', 'id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'id_product', 'id');
    }
}