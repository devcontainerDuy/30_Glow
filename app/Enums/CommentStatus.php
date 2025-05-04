<?php

namespace App\Enums;

enum CommentStatus: int
{
    case PENDING = 0; // Chờ duyệt
    case APPROVED = 1; // Đã duyệt
    case REJECTED = 2; // Bị từ chối
    case SPAM = 3; // Spam

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Chờ duyệt',
            self::APPROVED => 'Đã duyệt',
            self::REJECTED => 'Bị từ chối',
            self::SPAM => 'Spam',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
