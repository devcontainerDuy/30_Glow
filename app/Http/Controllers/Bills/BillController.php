<?php

namespace App\Http\Controllers\Bills;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bills\BillRequest;
use App\Models\Bills;
use App\Models\BillsDetail;
use App\Models\Customers;
use App\Traits\GeneratesUniqueId;
use Illuminate\Support\Facades\Auth;
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
     * Cho khách hàng lấy danh sách hóa đơn
     */
    public function create()
    {
        $this->data = $this->model::where('customer_id', Auth::user()->id)->orderBy('created_at', 'desc')->get();

        if ($this->data->isEmpty()) {
            return response()->json(['check' => false, 'message' => 'Không có hóa đơn nào cho khách hàng với ID này!',], 404);
        }

        $this->data->transform(function ($item) {
            return [
                'uid' => $item->uid,
                'payment_status' => $item->payment_status,
                'status' => $item->status,
                'total' => $item->total,
                'created_at' => $item->created_at,
            ];
        });

        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    /**
     * Store a newly created resource in storage.
     * payment_method: 0 - Thanh toán khi nhận hàng, 1 - Thanh toán qua thẻ ngân hàng, 2 - Thanh toán qua ví điện tử
     * status: 0 - Đang chờ xử lý, 1 - Đã xác nhận, 2 - Đã giao đơn vị vận chuyển, 3 - Đang giao hàng, 4 - Đã giao hàng, 5 - Khách hàng từ chối nhận hàng, 6 - Đã hoàn trả
     */
    public function store(BillRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->data = $request->validated();
            $this->instance = Customers::where('email', $this->data['email'])->active()->first();

            if ($this->instance !== null && !empty($this->instance)) {
                $customers = $this->instance->load('carts.product');

                if (
                    $customers->name !== $this->data['name'] || $customers->email !== $this->data['email']
                ) {
                    return response()->json(['check' => false, 'message' => 'Thông tin khách hàng không chính xác!'], 401);
                }

                if (is_null($customers->address)) {
                    $customers->update(['address' => $this->data['address']]);
                } elseif ($customers->address !== $this->data['address']) {
                    return response()->json(['check' => false, 'message' => 'Địa chỉ không khớp!'], 401);
                }

                if (is_null($customers->phone)) {
                    $customers->update(['phone' => $this->data['phone']]);
                } elseif ($customers->phone !== $this->data['phone']) {
                    return response()->json(['check' => false, 'message' => 'Số điện thoại không khớp!'], 401);
                }

                if ($customers->carts->isEmpty()) {
                    return response()->json(['check' => false, 'message' => 'Giỏ hàng trống!'], 401);
                }

                $this->data['cart'] = $customers->carts->map(function ($item) {
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
                $customers = Customers::create(['uid' => $this->createCodeCustomer(), 'name' => $this->data['name'], 'email' => $this->data['email'], 'phone' => $this->data['phone'], 'address' => $this->data['address'], 'password' => Hash::make($password)]);
                $customers->carts()->createMany($this->data['cart']);
            }

            $uidBill = $this->createCodeOrder();
            $this->instance = $this->model::insertGetId([
                'uid' => $uidBill,
                'customer_id' => $customers->id,
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
                'payment_status' => $this->data['payment_status'] ?? 0,
                'transaction_id' => $this->data['transaction_id'] ?? null,
                'total' => $this->data['total'],
                'status' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($this->data['cart'] as $item) {
                BillsDetail::create(['id_bill' => $this->instance, 'id_product' => $item['id_product'], 'quantity' => $item['quantity'], 'unit_price' => $item['unit_price']]);
            }

            $customers->carts()->delete();

            DB::commit();
            return response()->json(['check' => true, 'uid' => $uidBill, 'total' => $this->data['total']], 201);
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
        try {
            $this->data = $this->model::with('billDetail.product.gallery', 'billDetail.product.category')->where('customer_id', Auth::user()->id)->where('uid', $id)->first();

            $this->data = [
                'uid' =>  $this->data->uid,
                'name' =>  $this->data->name,
                'email' =>  $this->data->email,
                'phone' =>  $this->data->phone,
                'address' =>  $this->data->address,
                'note' =>  $this->data->note,
                'name_other' =>  $this->data->name_other,
                'email_other' =>  $this->data->email_other,
                'phone_other' =>  $this->data->phone_other,
                'address_other' =>  $this->data->address_other,
                'note_other' =>  $this->data->note_other,
                'payment_method' =>  $this->data->payment_method,
                'payment_status' =>  $this->data->payment_status,
                'total' =>  $this->data->total,
                'status' =>  $this->data->status,
                'created_at' =>  $this->data->created_at,
                'bill_detail' =>  $this->data->billDetail->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'product' => [
                            'name' => $detail->product->name,
                            'slug' => $detail->product->slug,
                            'highlighted' => $detail->product->highlighted,
                            'gallery' => asset('storage/gallery/' . $detail->product->gallery->firstWhere('status', 1)->image) ?? null,
                            'category' => [
                                'name' => $detail->product->category->name,
                                'slug' => $detail->product->category->slug,
                            ],
                        ],
                        'quantity' => $detail->quantity,
                        'unit_price' => $detail->unit_price,
                    ];
                }),
            ];

            return response()->json(['check' => true, 'data' => $this->data], 200);
        } catch (\Throwable $e) {
            Log::error("Error: " . $e->getMessage());
            return response()->json(['check' => false, 'message' => 'Không tìm thấy hóa đơn!'], 404);
        }
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
        $this->data = $request->validated();
        $this->instance = $this->model::where('uid', $id)->first();

        if ($this->data['status'] < $this->instance->status) {
            return response()->json(['check' => false, 'message' => 'Không thể thay đổi trạng thái trước đó!'], 400);
        }

        if ($this->instance->update($this->data)) {
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!'], 200);
        }

        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 401);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
