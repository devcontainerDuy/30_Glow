<?php

namespace App\Http\Controllers\Users;

use Spatie\Permission\Models\Role;
use App\Models\User;
use App\Traits\GeneratesUniqueId;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserRequest;
use App\Mail\createUser;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    use GeneratesUniqueId;
    public function __construct()
    {
        $this->model = User::class;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Tài khoản', 'url' => '/admin/users'],
            ['name' => 'Danh sách tài khoản', 'url' => '/admin/users'],
        ];
        $this->data = $this->model::with('roles')->get();
        // dd($this->data);
        $this->instance = Role::select('id', 'name')->get();
        return Inertia::render('Users/Index', [
            'users' => $this->data,
            'role' => $this->instance,
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
    public function store(UserRequest $request)
    {
        $this->data = $request->validated();

        $password = Str::random(10);
        $this->data['uid'] = $this->createCodeUser();
        $this->data['password'] = Hash::make($password);

        $this->instance = $this->model::create($this->data);
        $this->instance->syncRoles(['name' => $this->data['roles']]);

        if ($this->instance) {
            $dataMail = [
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => $password,
            ];
            $this->data = $this->model::with('roles')->get();
            Mail::to($request->input('email'))->send(new createUser($dataMail));
            return response()->json(['check' => true, 'message' => 'Tạo tài khoản thành công!', 'data' => $this->data], 201);
        }
        return response()->json(['check' => false, 'message' => 'Tạo tài khoản thất bại!'], status: 400);
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
    public function update(UserRequest $request, string $id)
    {
        $this->data = $request->validated();
        isset($this->data['roles']) ? $this->instance = $this->model::findOrFail($id)->syncRoles(['name' => $this->data['roles']]) : $this->instance = $this->model::findOrFail($id)->update($this->data);

        if ($this->instance) {
            $this->data = $this->model::with('roles')->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->instance = $this->model::findOrFail($id)->delete();
        if ($this->instance) {
            $this->data = $this->model::with('roles')->get();
            return response()->json(['check' => true, 'message' => 'Xoá thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Xoá thất bại!'], 400);
    }

    public function apiIndex()
    {
        $this->data = $this->model::with('roles')->active()->whereHas("roles", function (Builder $query) {
            $query->where('name', 'Staff');
        })->get();

        $this->data->transform(function ($item) {
            return [
                'uid' => $item->uid,
                'name' => $item->name,
                'roles' => $item->roles->pluck('name')->toArray(),
            ];
        });

        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiShow($id)
    {
        $this->data = $this->model::with('roles')->where('uid', $id)->active()->whereHas("roles", function (Builder $query) {
            $query->where('name', 'Staff');
        })->first();

        $this->data = [
            'uid' => $this->data->uid,
            'name' => $this->data->name,
            'email' => $this->data->email,
            'phone' => $this->data->phone,
            'address' => $this->data->address,
            'roles' => $this->data->roles->pluck('name')->toArray(),
        ];

        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiEdit()
    {
        // if (Auth::guard('api')->check()) {
        //     $this->data = $this->model::with('roles')->where('uid', Auth::guard('api')->user()->uid)->active()->whereHas("roles", function (Builder $query) {
        //         $query->where('name', 'Staff');
        //     })->first();
        //     return response()->json(['check' => true, 'data' => $this->data], 200);
        // }
        return response()->json(['check' => false, 'message' => 'Unauthorized'], 401);
    }
}
