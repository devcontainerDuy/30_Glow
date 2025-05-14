<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class DatabaseLogProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        DB::listen(function ($query) {
            $sql = $query->sql;
            
            // Chỉ log queries thay đổi dữ liệu
            if (!$this->isModificationQuery($sql)) {
                return;
            }
            
            // Lấy tên bảng và model
            if (!$tableName = $this->extractTableName($sql)) {
                return;
            }
            
            // Log vào file tương ứng với model
            $this->logQuery($tableName, $sql, $query);
        });
    }
    
    /**
     * Kiểm tra xem query có phải là modify query không
     */
    private function isModificationQuery(string $sql): bool
    {
        return (bool) preg_match('/^(insert|update|delete)/i', $sql);
    }
    
    /**
     * Trích xuất tên bảng từ SQL
     */
    private function extractTableName(string $sql): ?string
    {
        $patterns = [
            '/insert into [`"]?(\w+)[`"]?/i',
            '/update [`"]?(\w+)[`"]?/i',
            '/delete from [`"]?(\w+)[`"]?/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $sql, $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }
    
    /**
     * Log query vào file tương ứng
     */
    private function logQuery(string $tableName, string $sql, $query): void
    {
        // Xác định tên model
        $modelName = $this->getModelName($tableName);
        $channel = strtolower($modelName);
        
        // Cấu hình channel
        $this->configureLogChannel($channel);
        
        // Tạo context
        $context = [
            'bindings' => $query->bindings,
            'time' => $query->time . 'ms',
            'user' => Auth::check() ? Auth::id() : 'guest',
            'ip' => request()->ip() ?: 'console',
        ];
        
        // Xác định loại query
        $type = Str::before(strtoupper(trim($sql)), ' ');
        
        // Log
        Log::channel($channel)->info("[$type] $sql", $context);
    }
    
    /**
     * Chuyển tên bảng thành tên model
     */
    private function getModelName(string $tableName): string
    {
        $map = [
            'users' => 'User',
            'products' => 'Product',
            'categories' => 'Category',
            'orders' => 'Order',
        ];
        
        return $map[$tableName] ?? Str::studly(Str::singular($tableName));
    }
    
    /**
     * Cấu hình channel log
     */
    private function configureLogChannel(string $channel): void
    {
        config(["logging.channels.$channel" => [
            'driver' => 'single',
            'path' => storage_path("logs/$channel.log"),
            'level' => 'info',
        ]]);
    }
}