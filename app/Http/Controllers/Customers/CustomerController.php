<?php

namespace App\Http\Controllers\Customers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cumtomers\CustomerRequest;
use App\Models\Customers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Mail\createUser;
use App\Mail\resetPassword;
use App\Traits\GeneratesUniqueId;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    use GeneratesUniqueId;
    public function __construct()
    {
        $this->model = Customers::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Tài khoản', 'url' => '/admin/users'],
            ['name' => 'Danh sách khách hàng', 'url' => '/admin/customers'],
        ];
        $this->data = $this->model::all();
        return Inertia::render('Customers/Index', [
            'customers' => $this->data,
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
    public function store(CustomerRequest $request)
    {
        $this->data = $request->validated();

        $password = Str::random(10);
        $this->data['uid'] = $this->createCodeCustomer();
        $this->data['password'] = Hash::make($password);

        $this->instance = $this->model::create($this->data);
        if ($this->instance) {
            $dataMail = [
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => $password,
            ];
            $this->data = $this->model::all();
            Mail::to($request->input('email'))->send(new createUser($dataMail));
            return response()->json(['check' => true, 'message' => 'Tạo tài khoản thành công!', 'data' => $this->data], 201);
        }
        return response()->json(['check' => false, 'message' => 'Tạo tài khoản thất bại!'], status: 400);
    }

    public function resetPassword($id)
    {
        $this->instance = Str::random(10);
        $this->data = $this->model::findOrFail($id);

        if ($this->data) {
            $this->data['password'] = Hash::make($this->instance);
            $this->data->save();
            $dataMail = [
                'name' => $this->data['name'],
                'email' => $this->data['email'],
                'password' => $this->instance,
            ];
            Mail::to($this->data['email'])->send(new resetPassword($dataMail));
            return response()->json(['check' => true, 'message' => 'Mật khẩu đã được đặt lại thành công và gửi qua email!'], 200);
        }

        return response()->json(['check' => false, 'message' => 'Không tìm thấy tài khoản với email này!'], 404);
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
    public function update(CustomerRequest $request, string $id)
    {
        $this->data = $request->validated();
        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::all();
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
            $this->data = $this->model::all();
            return response()->json(['check' => true, 'message' => 'Xoá thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Xoá thất bại!'], 400);
    }
}
