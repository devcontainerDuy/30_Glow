<?php

namespace App\Enums;

enum BillsType: int
{
    case DEPOSIT = 0;
    case FINAL = 1;
    case ADJUSTMENT = 2;

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
