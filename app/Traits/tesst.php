<?php
require_once __DIR__ . '/../../vendor/autoload.php';
use App\Traits\GeneratesUniqueId;
$test = new class { use GeneratesUniqueId; };
echo $test->generateCode();