<?php

namespace App\Enums;

enum ServiceBillStatus: int
{
    case DRAFT = 0;
    case PENDING = 1;
    case PAID = 2;
    case CANCELLED = 3;
    case REFUNDED = 4;

    public static function labels(): array
    {
        return [
            self::DRAFT->value => 'Nháp',
            self::PENDING->value => 'Chờ thanh toán',
            self::PAID->value => 'Đã thanh toán',
            self::CANCELLED->value => 'Đã hủy',
            self::REFUNDED->value => 'Đã hoàn tiền',
        ];
    }
    
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
