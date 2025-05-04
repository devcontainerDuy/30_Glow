<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Customers extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * Guard for the model
     *
     * @var string
     */
    protected $guarded = ['customer'];

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'customers';

    protected $primaryKey = "id";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'uid',
        'name',
        'address',
        'phone',
        'email',
        'email_verified_at',
        'password',
        'status',
        'created_at',
        'updated_at',
        'social_id',
        'social_type'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $dates = ['deleted_at'];

    public function bookings(): HasMany
    {
        return $this->hasMany(Bookings::class, 'id_customer', 'id');
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Carts::class, 'id_customer', 'id');
    }

    public function bills(): HasMany
    {
        return $this->hasMany(Bills::class, 'customer_id', 'id');
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