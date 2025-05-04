<?php

namespace App\Enums;

enum UserStatus: int
{
    case INACTIVE = 0;    // Tạm khóa
    case ACTIVE = 1;      // Đang hoạt động
    case PENDING = 2;     // Chờ xác minh OTP
    case BANNED = 3;      // Bị cấm vĩnh viễn
    case UNVERIFIED = 4;  // Chưa xác minh email, số điện thoại

    public static function values(): array
    {
        return array_map(fn($item) => $item->value, self::cases());
    }

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Hoạt động',
            self::INACTIVE => 'Tạm khóa',
            self::PENDING => 'Chờ duyệt',
            self::BANNED => 'Đã bị cấm',
            self::UNVERIFIED => 'Chưa xác minh email, số điện thoại'
        };
    }
}
