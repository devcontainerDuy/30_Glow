<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\RoleRequest;
use App\Models\Permissions;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->model = Role::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Tài khoản', 'url' => '/admin/users'],
            ['name' => 'Danh sách vai trò', 'url' => '/admin/roles'],
        ];
        $this->data = $this->model::with('permissions')->get();
        // dd($this->data[0]->permissions[0]->id);
        $this->instance = Permissions::with('roles')->select('id', 'name')->get();
        return Inertia::render('Roles/Index', [
            'roles' => $this->data,
            'permissions' => $this->instance,
            'crumbs' => $this->crumbs
        ]);
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
    public function store(RoleRequest $request)
    {
        $this->data = $request->validated();
        $this->instance = $this->model::create([
            'name' => $this->data['name'],
            'guard_name' => $this->data['guard_name'],
        ]);

        if ($this->instance) {
            $this->data = $this->model::with('permissions')->get();
            return response()->json(['check' => true, 'message' => 'Thêm vai trò thành công!', 'data' => $this->data], 201);
        }
        return response()->json(['check' => false, 'message' => 'Thêm vai trò thất bại!'], 400);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $this->instance = $this->model::findOrFail($id);
        if ($this->instance) {
            $this->instance->load('permissions');
        }
        return response()->json(['check' => true, 'data' => $this->instance], 200);
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
    public function update(RoleRequest $request, string $id)
    {
        $this->data = $request->validated();
        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::with('permissions')->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }

    public function role_permission(Request $request, string $id)
    {
        $this->data = $request->only(['permissions']);
        $this->instance = $this->model::findOrFail($id);
        $this->instance->syncPermissions($this->data['permissions']);
        $this->data = $this->model::with('permissions')->get();
        return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->instance = $this->model::findOrFail($id);
        $this->instance = $this->instance->delete();
        if ($this->instance) {
            $this->data = $this->model::with('permissions')->get();
            return response()->json(['check' => true, 'message' => 'Xóa thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Xóa thất bại!'], 400);
    }
}
