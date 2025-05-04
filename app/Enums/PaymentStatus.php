<?php

namespace App\Enums;

enum PaymentStatus: int
{
    case PENDING = 0; // Chờ xử lý
    case SUCCESS = 1; // Thành công
    case FAILED = 2; // Thất bại
    case REFUNDED = 3; // Đã hoàn tiền

    public static function values(): array
    {
        return array_map(fn($item) => $item->value, self::cases());
    }
}
