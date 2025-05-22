<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserRequest;
use App\Repository\Roles\RoleRepositoryInterface;
use App\Repository\Users\UserRepositoryInterface;
use App\Services\Users\UserServiceInterface;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

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
        return Inertia::render('users/index', [
            'data' => $this->service->read(),
            'roles' => $this->rolesRepository->select(['id', 'name'])->getAll(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('users/created', [
            'roles' => $this->rolesRepository->select(['id', 'name'])->getAll(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        DB::beginTransaction();
        try {
            DB::commit();
            $this->service->created($request->validated());
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
        return Inertia::render('users/edited', [
            'user' => $this->repository->with('roles')->firstBy(['uid' => $id]),
            'roles' => $this->rolesRepository->getAll(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(string $id, UserRequest $request)
    {
        $user = $this->repository->findBy(['id' => $id]);
        $this->service->updated($id, $request->validated());
        return redirect()->route('users.edit', ['user' => $user[0]->uid]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->service->deleted($id);
        return redirect()->route('users.index');
    }
}
