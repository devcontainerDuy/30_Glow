<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comments extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'comment';

    protected $primaryKey = "id";

    protected $fillable = [
        'id_product',
        'id_customer',
        'id_user',
        'id_service',
        'comment',
        'status',
        'id_parent',
        'created_at',
        'updated_at'
    ];

    protected $dates = ['deleted_at'];

    public function parent()
    {
        return $this->belongsTo(Comments::class, 'id_parent');
    }

    public function product()
    {
        return $this->belongsTo(Products::class, 'id_product', 'id');
    }

    public function service()
    {
        return $this->belongsTo(Services::class, 'id_service');
    }

    public function customer()
    {
        return $this->belongsTo(Customers::class, 'id_customer');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}