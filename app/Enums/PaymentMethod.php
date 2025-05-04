<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case CASH = 'cash';
    case BANK_TRANSFER = 'bank_transfer';
    case CREDIT_CARD = 'credit_card';
    case MOMO = 'momo';
    case VN_PAY = 'vnpay';
    case ZALOPAY = 'zalopay';
    case PAYPAL = 'paypal';
    case STRIPE = 'stripe';

    public static function values(): array
    {
        return array_map(fn($item) => $item->value, self::cases());
    }
}
