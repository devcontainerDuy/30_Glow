<?php

namespace App\Enums;

/**
 * Enum trạng thái sản phẩm với đầy đủ tính năng
 * 
 * @method static self DRAFT()
 * @method static self SCHEDULED()
 * @method static self PUBLISHED()
 * @method static self ARCHIVED()
 * @method static self OUT_OF_STOCK()
 */
enum ProductStatus: int
{
    case DRAFT = 0;         // Bản nháp - Chỉnh sửa nội dung
    case SCHEDULED = 1;     // Đặt lịch - Sẽ xuất bản theo ngày hẹn
    case PUBLISHED = 2;     // Đang bán - Hiển thị công khai
    case ARCHIVED = 3;      // Lưu trữ - Ngừng bán nhưng giữ lại thông tin
    case OUT_OF_STOCK = 4;  // Hết hàng - Vẫn hiển thị nhưng không thể đặt mua

    /**
     * Lấy danh sách giá trị enum
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Lấy nhãn hiển thị tương ứng với từng trạng thái
     */
    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Bản nháp',
            self::SCHEDULED => 'Đặt lịch',
            self::PUBLISHED => 'Đang bán',
            self::ARCHIVED => 'Lưu trữ',
            self::OUT_OF_STOCK => 'Hết hàng',
        };
    }

    /**
     * Kiểm tra trạng thái có cho phép hiển thị công khai không
     */
    public function isPublic(): bool
    {
        return in_array($this, [self::PUBLISHED, self::OUT_OF_STOCK]);
    }

    /**
     * Kiểm tra trạng thái có cho phép đặt hàng không
     */
    public function canBeOrdered(): bool
    {
        return $this === self::PUBLISHED;
    }

    /**
     * Lấy danh sách trạng thái có thể chuyển đổi từ trạng thái hiện tại
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::DRAFT => [self::SCHEDULED, self::PUBLISHED],
            self::SCHEDULED => [self::PUBLISHED, self::DRAFT],
            self::PUBLISHED => [self::OUT_OF_STOCK, self::ARCHIVED],
            self::OUT_OF_STOCK => [self::PUBLISHED, self::ARCHIVED],
            self::ARCHIVED => [self::PUBLISHED, self::DRAFT],
            default => [],
        };
    }
}