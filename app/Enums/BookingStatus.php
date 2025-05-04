<?php

namespace App\Enums;

enum BookingStatus: int
{
    case PENDING = 0;       // Chờ xác nhận
    case CONFIRMED = 1;     // Đã xác nhận (có nhân viên)
    case IN_PROGRESS = 2;   // Đang thực hiện
    case COMPLETED = 3;     // Hoàn thành
    case CANCELLED = 4;     // Đã hủy
    case NO_SHOW = 5;       // Khách không đến

    public static function labels(): array
    {
        return [
            self::PENDING->value => 'Chờ xác nhận',
            self::CONFIRMED->value => 'Đã xác nhận (có nhân viên)',
            self::IN_PROGRESS->value => 'Đang thực hiện',
            self::COMPLETED->value => 'Hoàn thành',
            self::CANCELLED->value => 'Đã hủy',
            self::NO_SHOW->value => 'Khách không đến',
        ];
    }
    
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
