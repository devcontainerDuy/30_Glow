<?php

namespace App\Enums;

enum OrderStatus: int
{
    case DRAFT = 0; // Đơn nháp
    case PENDING = 1; // Chờ xác nhận
    case CONFIRMED = 2; // Đã xác nhận
    case PROCESSING = 3; // Đang xử lý
    case SHIPPED = 4; // Đang giao hàng
    case COMPLETED = 5; // Hoàn thành
    case CANCELLED = 6; // Đã hủy

    public static function values(): array
    {
        return array_map(fn($item) => $item->value, self::cases());
    }
}
