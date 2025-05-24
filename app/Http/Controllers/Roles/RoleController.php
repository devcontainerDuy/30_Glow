<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\RoleRequest;
use App\Repository\Roles\RoleRepositoryInterface;
use App\Services\Roles\RoleServiceInterface;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function __construct(RoleServiceInterface $service, RoleRepositoryInterface $repository)
    {
        $this->service = $service;
        $this->repository = $repository;

    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('roles/index', [
            'title' => 'Danh sách vai trò',
            'head' => [
                'title' => 'Vai trò',
                'description' => 'Quản lý các vai trò trong hệ thống',
            ],
            'data' => $this->service->read()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('roles/created', [
            'title' => 'Tạo mới vai trò',
            'head' => [
                'title' => 'Tạo mới',
                'description' => 'Thêm vai trò mới vào hệ thống',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        $this->service->created($request->validated());
        return redirect()->route('roles.create');
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
        return Inertia::render('roles/edited', [
            'title' => 'Chỉnh sửa vai trò',
            'head' => [
                'title' => 'Chỉnh sửa',
                'description' => 'Cập nhật thông tin vai trò trong hệ thống',
            ],
            'data' => $this->repository->find($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, string $id)
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
