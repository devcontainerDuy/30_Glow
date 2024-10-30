<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Carts extends Model
{
    use HasFactory;

    protected $table = 'carts';

    protected $primaryKey = "id";

    protected $illable = [
        'id_customer',
        'id_product',
        'quantity',
        'created_at',
        'updated_at'
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customers::class, 'id_customer', 'id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'id_product', 'id');
    }
}