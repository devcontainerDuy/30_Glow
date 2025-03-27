<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait GeneratesUniqueId
{
    public function uniqidReal($lenth = 10)
    {
        return Str::random($lenth);
    }

    public function generateTokenGetPassword()
    {
        return (string) Str::uuid() . '-' . time();
    }

    public function createCodePayment()
    {
        return 'PM' . $this->uniqidReal(5) . time();
    }

    public function createCodeUser()
    {
        return 'US' . $this->uniqidReal(5) . time();
    }

    public function createCodeCustomer()
    {
        return 'CT' . $this->uniqidReal(5) . time();
    }

    public function createCodeOrder()
    {
        return 'HDSP' . $this->uniqidReal(5) . time();
    }

    public function createCodeOrderService()
    {
        return 'HDSV' . $this->uniqidReal(5) . time();
    }
}
