<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\Province;
use App\Models\Ward;
use Illuminate\Http\JsonResponse;

class MapsController extends Controller
{
    public function __construct()
    {
        $this->model = Province::class;
    }

    public function getProvince(): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => $this->model::all(),
        ], 200);
    }

    public function getDistrict(int $id): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => District::where('province_id', $id)->get(),
        ], 200);
    }

    public function getWard(int $id): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => Ward::where('district_id', $id)->get(),
        ], 200);
    }
}
