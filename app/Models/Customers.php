<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Customers extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'customers';

    protected $primaryKey = "id";

    protected $fillable = [
        'uid',
        'name',
        'address',
        'phone',
        'email',
        'password',
        'status',
        'remember_token',
        'created_at',
        'updated_at'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(Bookings::class, 'id_customer', 'id');
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Carts::class, 'id_customer', 'id');
    }

    public function serviceBills(): HasMany
    {
        return $this->hasMany(ServiceBills::class, 'id_customer', 'id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
