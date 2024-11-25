<?php

namespace App\Http\Controllers\Bills;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bills\BillRequest;
use App\Models\Bills;
use App\Models\BillsDetail;
use App\Models\Customers;
use App\Traits\GeneratesUniqueId;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BillController extends Controller
{
    use GeneratesUniqueId;
    public function __construct()
    {
        $this->model = Bills::class;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Sản phẩm', 'url' => '/admin/products'],
            ['name' => 'Danh sách hóa đơn', 'url' => '/admin/bills']
        ];
        $this->data = $this->model::with('customer', 'billDetail.product')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Bills/Index', ['bills' => $this->data, 'crumbs' => $this->crumbs]);
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
     * status: 0 - Đã thanh toán online, 1 - Đang chờ xử lý, 2 - Đã xác nhận, 3 - Đang giao hàng, 4 - Đã giao hàng, 5 - Đã thanh toán tiền mặt, 6 - Đã hủy
     */
    public function store(BillRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->data = $request->validated();
            $this->instance = Customers::where('email', $this->data['email'] ?? null)->where('phone', $this->data['phone'] ?? null)->first();

            if ($this->instance) {
                $idCustomer = $this->instance->load('carts.product');

                if (
                    $idCustomer->name !== $this->data['name'] ||
                    $idCustomer->email !== $this->data['email'] ||
                    (!empty($idCustomer->phone) && $idCustomer->phone !== $this->data['phone']) ||
                    (!empty($idCustomer->address) && $idCustomer->address !== $this->data['address'])
                ) {
                    return response()->json(['check' => false, 'message' => 'Thông tin khách hàng không chính xác!'], 401);
                }

                if (is_null($idCustomer->address)) {
                    $idCustomer->update(['address' => $this->data['address']]);
                } elseif ($idCustomer->address !== $this->data['address']) {
                    return response()->json(['check' => false, 'message' => 'Địa chỉ không khớp!'], 401);
                }

                if (is_null($idCustomer->phone)) {
                    $idCustomer->update(['phone' => $this->data['phone']]);
                } elseif ($idCustomer->phone !== $this->data['phone']) {
                    return response()->json(['check' => false, 'message' => 'Số điện thoại không khớp!'], 401);
                }

                if ($idCustomer->carts->isEmpty()) {
                    return response()->json(['check' => false, 'message' => 'Giỏ hàng trống!'], 401);
                }

                $this->data['cart'] = $idCustomer->carts->map(function ($item) {
                    if (!$item->product) {
                        return response()->json(['check' => false, 'message' => 'Sản phẩm không tồn tại!'], 401);
                    }
                    return [
                        'id_product' => $item->id_product,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->product->price * (1 - $item->product->discount / 100),
                    ];
                })->toArray();
            } else {
                $password = Str::random(10);
                $idCustomer = Customers::create(['uid' => $this->createCodeCustomer(), 'name' => $this->data['name'], 'email' => $this->data['email'], 'phone' => $this->data['phone'], 'address' => $this->data['address'], 'password' => Hash::make($password)]);
                $idCustomer->carts()->createMany($this->data['cart']);
            }

            $this->instance = $this->model::insertGetId([
                'uid' => $this->createCodeOrder(),
                'customer_id' => $idCustomer->id,
                'name' => $this->data['name'],
                'email' => $this->data['email'],
                'phone' => $this->data['phone'],
                'address' => $this->data['address'],
                'note' => $this->data['note'],
                'name_other' => $this->data['name_other'] ?? null,
                'email_other' => $this->data['email_other'] ?? null,
                'phone_other' => $this->data['phone_other'] ?? null,
                'address_other' => $this->data['address_other'] ?? null,
                'note_other' => $this->data['note_other'] ?? null,
                'payment_method' => $this->data['payment_method'],
                'transaction_id' => $this->data['transaction_id'] ?? null,
                'total' => $this->data['total'],
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($this->data['cart'] as $item) {
                BillsDetail::create(['id_bill' => $this->instance, 'id_product' => $item['id_product'], 'quantity' => $item['quantity'], 'unit_price' => $item['unit_price']]);
            }

            $idCustomer->carts()->delete();

            DB::commit();
            return response()->json(['check' => true, 'message' => 'Đặt hàng thành công!'], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Error: " . $e->getMessage());
            return response()->json(['check' => false, 'message' => 'Đặt hàng thất bại!'], 401);
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
        $this->crumbs = [
            ['name' => 'Sản phẩm', 'url' => '/admin/products'],
            ['name' => 'Danh sách hóa đơn', 'url' => '/admin/bills'],
            ['name' => 'Chi tiết hóa đơn', 'url' => '/admin/bills/' . $id . '/edit']
        ];
        $this->data = $this->model::with('customer', 'billDetail.product')->where('uid', $id)->orderBy('created_at', 'desc')->first();
        // dd($this->data);
        return Inertia::render('Bills/Edit', ['bill' => $this->data, 'crumbs' => $this->crumbs]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BillRequest $request, string $id)
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