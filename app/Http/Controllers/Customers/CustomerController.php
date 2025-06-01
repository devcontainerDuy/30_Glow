<?php

namespace App\Http\Controllers\Customers;

use App\Http\Controllers\Controller;
use App\Repository\Customers\CustomerRepositoryInterface;
use App\Services\Customers\CustomerServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function __construct(CustomerServiceInterface $service, CustomerRepositoryInterface $repository)
    {
        $this->service = $service;
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('customers/index', [
            'title' => 'Danh sách khách hàng',
            'head' => [
                'title' => 'Khách hàng',
                'description' => 'Quản lý thông tin khách hàng',
            ],
            'data' => $this->service->read()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('customers/created', [
            'title' => 'Tạo mới khách hàng',
            'head' => [
                'title' => 'Tạo mới',
                'description' => 'Thêm mới khách hàng vào hệ thống',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $this->service->created($request->validated());
            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Customer created successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to create customer',
                'error' => $e->getMessage(),
            ], 500);
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
        return Inertia::render('customers/edited', [
            'title' => 'Chỉnh sửa khách hàng',
            'head' => [
                'title' => 'Chỉnh sửa',
                'description' => 'Cập nhật thông tin khách hàng',
            ],
            'data' => $this->service->find($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
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
