<?php

namespace App\Http\Controllers\Permissions;

use App\Http\Controllers\Controller;
use App\Http\Requests\Permissons\PermissonRequest;
use App\Repository\Permissions\PermissionRepositoryInterface;
use App\Services\Permissions\PermissionServiceInterface;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function __construct(PermissionServiceInterface $service,PermissionRepositoryInterface $repository)
    {
        parent::__construct($service, $repository);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('permissions/index', [
            'title' => 'Danh sách quyền',
            'head' => [
                'title' => 'Quyền hạn',
                'description' => 'Quản lý các quyền hạn trong hệ thống',
            ],
            'data' => $this->service->read()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('permissions/created', [
            'title' => 'Tạo mới quyền hạn',
            'head' => [
                'title' => 'Tạo mới',
                'description' => 'Thêm mới quyền hạn trong hệ thống',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PermissonRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->service->created($request->validated());
            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Thêm mới quyền hạn thành công'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Thêm mới quyền hạn thất bại: ' . $e->getMessage()
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
        return Inertia::render('permissions/edited', [
            'title' => 'Chỉnh sửa quyền hạn',
            'head' => [
                'title' => 'Chỉnh sửa',
                'description' => 'Cập nhật thông tin quyền hạn',
            ],
            'permission' => $this->repository->find($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PermissonRequest $request, string $id)
    {
        DB::beginTransaction();
        try {
            $this->service->updated($id, $request->validated());
            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật quyền hạn thành công'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Cập nhật quyền hạn thất bại: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->service->deleted($id);
        return redirect()->route('permissions.index');
    }
}
