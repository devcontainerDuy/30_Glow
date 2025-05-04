<?php

namespace App\Enums;

enum ServiceStatus: int
{
    case DRAFT = 0;
    case PUBLISHED = 1;
    case ARTICLE = 2;

    public static function values(): array
    {
        return array_map(fn($item) => $item->value, self::cases());
    }
}
