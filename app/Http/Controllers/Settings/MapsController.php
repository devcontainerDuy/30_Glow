<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\Province;
use App\Models\Ward;

class MapsController extends Controller
{
    public function __construct()
    {
        $this->model = Province::class;
    }

    public function getProvince()
    {
        return response()->json([
            'status' => true,
            'data' => $this->model::all(),
        ], 200);
    }

    public function getDistrict($id)
    {
        return response()->json([
            'status' => true,
            'data' => District::where('province_id', $id)->get(),
        ], 200);
    }

    public function getWard($id)
    {
        return response()->json([
            'status' => true,
            'data' => Ward::where('district_id', $id)->get(),
        ], 200);
    }
}
