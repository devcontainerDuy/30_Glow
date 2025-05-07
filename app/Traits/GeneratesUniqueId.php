<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait GeneratesUniqueId
{
    /**
     * Summary of generateToken
     * @param mixed $length
     * @return string
     */
    private static function generateToken($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $token = '';
        for ($i = 0; $i < $length; $i++) {
            $token .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $token;
    }

    /**
     * Summary of hex_encode using email address
     * @param mixed $email_address
     * @return string
     */
    public function hex_encode($email_address)
    {
        $encoded = bin2hex("$email_address");
        $encoded = chunk_split($encoded, 2, '%');
        $encoded = '%' . substr($encoded, 0, strlen($encoded) - 1);
        return $encoded;

    }

    /**
     * Summary of generateUUIDv4 
     * @param mixed $length
     * @return string
     */
    public function generateUUIDv4(bool $security = false)
    {
        if ($security) {
            return (string) Str::uuid() . '-' . time() . '-' . self::generateToken(5);
        }
        return (string) Str::uuid();
    }

    /**
     * Summary of generateCode
     * @param mixed $length
     * @return string
     */
    public function generateCode($prefix = 'MDP')
    {
        $time = date('dmY', time());
        $token = strtoupper(self::generateToken(5));
        return (string) $prefix . $time . $token;
    }
}