<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bills extends Model
{
    use HasFactory;

    protected $table = "bills";

    protected $primaryKey = "id";

    protected $fillable = [
        'uid',
        'name',
        'email',
        'phone',
        'address',
        'note',
        'transaction_id',
        'status',
        'created_at',
        'updated_at',
    ];

    public function bill_detail(): HasMany
    {
        return $this->hasMany(BillsDetail::class, 'id_bill', 'id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
