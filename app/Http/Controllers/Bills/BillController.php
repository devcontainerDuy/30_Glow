<?php

namespace App\Http\Controllers\Bills;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bills\BillRequest;
use App\Models\Bills;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BillController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->model = Bills::class;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BillRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->data = $request->validated();
            $this->instance = $this->model::insertGetId([]);
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Error: " . $e->getMessage());
            return response()->json(['check' => false, 'message' => 'Đặt hàng thất bại!'], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BillRequest $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
