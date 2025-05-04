<?php

namespace App\Enums;

enum VoucherType: int
{
    case ALL = 0;
    case SPECIFIC = 1;

    public static function values(): array {
        return array_column(self::cases(), 'value');
     }
}
