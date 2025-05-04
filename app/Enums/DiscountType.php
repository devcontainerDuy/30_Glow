<?php

namespace App\Enums;

enum DiscountType: int
{
    case PERCENTAGE = 0;
    case FIXED_AMOUNT = 1;
    
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return [
            self::PERCENTAGE->value => 'Percentage',
            self::FIXED_AMOUNT->value => 'Fixed Amount',
        ];
    }
}
