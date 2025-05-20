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
            'data' => $this->service->read()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('roles/created');
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
        return Inertia::render('roles/show', [
            'data' => $this->repository->find($id)
        ]);
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
