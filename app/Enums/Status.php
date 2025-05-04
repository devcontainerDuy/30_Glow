<?php

namespace App\Enums;

enum Status: int
{
    case DRAFT = 0;
    case ARTICLE = 1;
    case PUBLISHED = 2;
    case ARCHIVED = 3;

    public static function values(): array
    {
        return array_map(fn($item) => $item->value, self::cases());
    }
}
