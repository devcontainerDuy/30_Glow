<?php

namespace App\Enums;

enum BillsStatus: int
{
    case DRAFT = 0; // Bản nháp
    case ISSUED = 1; // Đã phát hành
    case CANCELLED = 2; // Đã hủy

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
