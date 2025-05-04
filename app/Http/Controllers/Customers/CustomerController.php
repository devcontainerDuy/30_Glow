<?php

namespace App\Http\Controllers\Customers;

use App\Events\Customers\PhoneChanged;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cumtomers\CustomerRequest;
use App\Models\Customers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Mail\createUser;
use App\Mail\resetPassword;
use App\Traits\GeneratesUniqueId;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
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
        $this->data = $this->model::orderBy('created_at', 'desc')->get();
        $trashs = $this->model::onlyTrashed()->orderBy('created_at', 'desc')->get();
        return Inertia::render('Customers/Index', ['customers' => $this->data, 'trashs' => $trashs, 'crumbs' => $this->crumbs]);
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
            $this->data = $this->model::orderBy('created_at', 'desc')->get();
            $trashs = $this->model::onlyTrashed()->orderBy('created_at', 'desc')->get();
            Mail::to($request->input('email'))->send(new createUser($dataMail));
            return response()->json(['check' => true, 'message' => 'Tạo tài khoản thành công!', 'data' => $this->data, 'trashs' => $trashs], 201);
        }
        return response()->json(['check' => false, 'message' => 'Tạo tài khoản thất bại!'], 400);
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
    public function show()
    {
        $this->instance = $this->model::where('uid', Auth::user()->uid)->select('uid', 'name', 'address', 'email', 'phone',)->active()->first();

        if ($this->instance) {
            return response()->json(['check' => true, 'data' => $this->instance], 200);
        }

        return response()->json(['check' => false, 'message' => 'Không tìm thấy tài khoản!'], 404);
    }

    /**
     * Show api the form for editing the specified resource.
     */
    public function edit(CustomerRequest $request)
    {
        $this->data = $request->validated();
        $this->instance = $this->model::where('uid', Auth::user()->uid)->active()->first();

        if ($this->instance->update($this->data)) {
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!'], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 401);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            // 'password_confirmation' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'message' => $validator->errors()->first()], 401);
        }

        $this->data = $request->only('password');
        $this->instance = $this->model::where('uid', Auth::user()->uid)->active()->first();

        $hashPassword = Hash::make($this->data['password']);
        if ($this->instance->update(['password' => $hashPassword])) {
            $dataMail = [
                'name' => $this->instance['name'],
                'email' => $this->instance['email'],
                'password' => $this->data['password'],
            ];
            Mail::to($this->instance['email'])->send(new resetPassword($dataMail));
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!'], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 401);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CustomerRequest $request, string $id)
    {
        $this->data = $request->validated();
        // $this->instance = $this->model::findOrFail($id)->update($this->data); gộp 1 dòng kh chạy đc mà tách ra thì đc :)))))))) 
        // à tại dòng ở trên là trả về true fail nên bị bắt lỗi kiểu dữ liệu nha
        $this->instance = $this->model::findOrFail($id);
        $this->instance->update($this->data);
        if (isset($this->data['phone'])) broadcast(new PhoneChanged($this->instance))->toOthers();
        if ($this->instance) {
            $this->data = $this->model::all();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data,], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->instance = $this->model::findOrFail($id);
        $this->instance->update(['status' => 0]);
        if ($this->instance->delete()) {
            $this->data = $this->model::orderBy('created_at', 'desc')->get();
            $trashs = $this->model::onlyTrashed()->orderBy('created_at', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Xoá thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }
        return response()->json(['check' => false, 'message' => 'Xoá thất bại!'], 400);
    }

    public function restore($id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id)->restore();
        if ($this->instance) {
            $this->data = $this->model::orderBy('created_at', 'desc')->get();
            $trashs = $this->model::onlyTrashed()->orderBy('created_at', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Khôi phục thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }
        return response()->json(['check' => false, 'message' => 'Khôi phục thất bại!'], 400);
    }

    public function forceDelete($id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id)->forceDelete();
        if ($this->instance) {
            $this->data = $this->model::orderBy('created_at', 'desc')->get();
            $trashs = $this->model::onlyTrashed()->orderBy('created_at', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Xoá hệ thống!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }
        return response()->json(['check' => false, 'message' => 'Xoá hệ thống thất bại!'], 400);
    }
}
