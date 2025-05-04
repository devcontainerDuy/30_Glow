<?php

return [

    /*
    |--------------------------------------------------------------------------
    | VNPAY Configuration
    |--------------------------------------------------------------------------
    |
    | The following configuration options allow you to customize the VNPAY
    | integration. You can obtain the necessary credentials by registering
    | for a VNPAY account at: https://sandbox.vnpayment.vn/apis/registration.html
    |
    | Supported: "sandbox", "production"
    | vnp_TmnCode: Your VNPAY merchant code.
    | vnp_HashSecret: Your VNPAY hash secret.
    | vnp_Url: The VNPAY payment gateway URL.
    |
    */

    'vnp_TmnCode' => env('VNP_TMN_CODE'),
    'vnp_HashSecret' => env('VNP_HASH_SECRET'),
    'vnp_Url' => env('VNP_URL'),
    'vnp_Returnurl' => env('VNP_RETURN_URL'),
    'vnp_apiUrl' => env('VNP_API_URL'),
    'apiUrl' => env('API_URL'),
];
