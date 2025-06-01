<?php

namespace App\Http\Controllers\Users;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use App\Http\Requests\Users\UserRequest;
use App\Http\Resources\Users\UserResource;
use App\Services\Users\UserServiceInterface;
use App\Repository\Roles\RoleRepositoryInterface;
use App\Repository\Users\UserRepositoryInterface;

class UserController extends Controller
{
    private $rolesRepository;
    public function __construct(UserServiceInterface $service, UserRepositoryInterface $repository, RoleRepositoryInterface $rolesRepository)
    {
        $this->service = $service;
        $this->repository = $repository;
        $this->rolesRepository = $rolesRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('read-users');
        return Inertia::render('users/index', [
            'title' => 'Danh sách người dùng',
            'head' => [
                'title' => 'Người dùng',
                'description' => 'Quản lý người dùng trong hệ thống',
            ],
            'data' => UserResource::collection($this->service->read())->resolve(),
            'roles' => Cache::remember('roles.list', 60, fn() => $this->rolesRepository->select(['id', 'name'])->getAll()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('read-users');
        return Inertia::render('users/created', [
            'title' => 'Tạo mới người dùng',
            'head' => [
                'title' => 'Tạo mới',
                'description' => 'Thêm người dùng mới vào hệ thống',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $this->authorize('create-users');
        DB::beginTransaction();
        try {
            $this->service->created($request->validated());
            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'User created successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to create user',
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
        $this->authorize('view-users');
        return Inertia::render('users/edited', [
            'title' => 'Chỉnh sửa người dùng',
            'head' => [
                'title' => 'Chỉnh sửa',
                'description' => 'Cập nhật thông tin người dùng trong hệ thống',
            ],
            'user' => $this->repository->with('roles')->firstBy(['uid' => $id]),
            'role' => Cache::remember('roles.list', 60, fn() => $this->rolesRepository->select(['id', 'name'])->getAll()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(string $id, UserRequest $request)
    {
        $this->authorize('update-users');
        DB::beginTransaction();
        try {
            $this->service->updated($id, $request->validated());
            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'User updated successfully',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->authorize('delete-users');
        $this->service->deleted($id);
        return redirect()->route('users.index');
    }
}
