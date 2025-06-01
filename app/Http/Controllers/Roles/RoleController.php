<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\RoleRequest;
use App\Repository\Permissions\PermissionRepositoryInterface;
use App\Repository\Roles\RoleRepositoryInterface;
use App\Services\Roles\RoleServiceInterface;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RoleController extends Controller
{
    protected PermissionRepositoryInterface $permissionRepository;
    public function __construct(RoleServiceInterface $service, RoleRepositoryInterface $repository, PermissionRepositoryInterface $permissionRepository)
    {
        parent::__construct($service, $repository);
        $this->permissionRepository = $permissionRepository;
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
        DB::beginTransaction();
        try {
            $this->service->created($request->validated());
            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Tạo mới vai trò thành công',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Tạo mới vai trò thất bại',
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
        return Inertia::render('roles/edited', [
            'title' => 'Chỉnh sửa vai trò',
            'head' => [
                'title' => 'Chỉnh sửa',
                'description' => 'Cập nhật thông tin vai trò trong hệ thống',
            ],
            'role' => $this->repository->with('permissions')->find($id),
            'permission' => $this->permissionRepository->getAll(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, string $id)
    {
        DB::beginTransaction();
        try {
            $this->service->updated($id, $request->validated());
            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật vai trò thành công',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Cập nhật vai trò thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->service->deleted($id);
        return redirect()->route('roles.index');
    }
}
