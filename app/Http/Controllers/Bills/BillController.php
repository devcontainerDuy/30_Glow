<?php

namespace App\Http\Controllers\Bills;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bills\BillRequest;
use App\Models\Bills;
use App\Models\BillsDetail;
use App\Models\Customers;
use App\Models\Products;
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
        if (!Auth::check()) {
            return response()->json(['check' => false, 'message' => 'Chưa đăng nhập!'], 401);
        }

        $this->data = $this->model::where('customer_id', Auth::user()->id)->orderBy('created_at', 'desc')->get();

        if ($this->data->isEmpty()) {
            return response()->json(['check' => false, 'data' => [], 'message' => 'Chưa tạo hóa đơn'], 200);
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
    // public function store(BillRequest $request)
    // {
    //     $this->data = $request->validated();
    //     DB::beginTransaction();
    //     try {

    //         if (Auth::check()) {
    //             $customers = Auth::user()->load('carts.product');

    //             if (
    //                 $customers->name !== $this->data['name'] || $customers->email !== $this->data['email']
    //             ) {
    //                 return response()->json(['check' => false, 'message' => 'Thông tin khách hàng không chính xác!'], 401);
    //             }

    //             if ($customers->address === null) {
    //                 $customers->update(['address' => $this->data['address']]);
    //             }

    //             if ($customers->phone === null) {
    //                 $customers->update(['phone' => $this->data['phone']]);
    //             } elseif ($customers->phone !== $this->data['phone']) {
    //                 return response()->json(['check' => false, 'message' => 'Số điện thoại không khớp!'], 401);
    //             }

    //             if ($customers->carts->isEmpty()) {
    //                 return response()->json(['check' => false, 'message' => 'Giỏ hàng trống!'], 401);
    //             }

    //             $this->data['cart'] = $customers->carts->map(function ($item) {
    //                 if (!$item->product) {
    //                     return response()->json(['check' => false, 'message' => 'Sản phẩm không tồn tại!'], 401);
    //                 }
    //                 return [
    //                     'id_product' => $item->id_product,
    //                     'quantity' => $item->quantity,
    //                     'unit_price' => $item->product->price * (1 - $item->product->discount / 100),
    //                 ];
    //             })->toArray();
    //         } else {
    //             $this->instance = Customers::where('email', $this->data['email'])->active()->first();

    //             if ($this->instance->phone === $this->data['phone']) {
    //                 return response()->json(['check' => false, 'message' => 'Số điện thoại đã có người dùng!'], 401);
    //             } elseif ($this->instance->email === $this->data['email']) {
    //                 return response()->json(['check' => false, 'message' => 'Email đã có người dùng!'], 401);
    //             }
    //             $password = Str::random(10);
    //             $customers = Customers::create(['uid' => $this->createCodeCustomer(), 'name' => $this->data['name'], 'email' => $this->data['email'], 'phone' => $this->data['phone'], 'address' => $this->data['address'], 'password' => Hash::make($password)]);
    //             $customers->carts()->createMany($this->data['cart']);
    //         }

    //         $uidBill = $this->createCodeOrder();
    //         $this->instance = $this->model::insertGetId([
    //             'uid' => $uidBill,
    //             'customer_id' => $customers->id,
    //             'name' => $this->data['name'],
    //             'email' => $this->data['email'],
    //             'phone' => $this->data['phone'],
    //             'address' => $this->data['address'],
    //             'note' => $this->data['note'],
    //             'name_other' => $this->data['name_other'] ?? null,
    //             'email_other' => $this->data['email_other'] ?? null,
    //             'phone_other' => $this->data['phone_other'] ?? null,
    //             'address_other' => $this->data['address_other'] ?? null,
    //             'note_other' => $this->data['note_other'] ?? null,
    //             'payment_method' => $this->data['payment_method'],
    //             'payment_status' => $this->data['payment_status'] ?? 0,
    //             'transaction_id' => $this->data['transaction_id'] ?? null,
    //             'total' => $this->data['total'],
    //             'status' => 0,
    //             'created_at' => now(),
    //             'updated_at' => now(),
    //         ]);

    //         foreach ($this->data['cart'] as $item) {
    //             BillsDetail::create(['id_bill' => $this->instance, 'id_product' => $item['id_product'], 'quantity' => $item['quantity'], 'unit_price' => $item['unit_price']]);
    //         }

    //         $customers->carts()->delete();

    //         DB::commit();
    //         return response()->json(['check' => true, 'uid' => $uidBill, 'total' => $this->data['total']], 201);
    //     } catch (\Throwable $e) {
    //         DB::rollBack();
    //         Log::error("Error: " . $e->getMessage());
    //         return response()->json(['check' => false, 'message' => 'Đặt hàng thất bại!'], 401);
    //     }
    // }

    public function store(BillRequest $request)
    {
        $data = $request->validated();

        return DB::transaction(function () use ($data) {
            try {
                // Tìm customer theo uid (nếu có) hoặc theo email/phone
                $customer = null;
                if (!empty($data['uid'])) {
                    $customer = Customers::where('uid', $data['uid'])->active()->first();
                } else {
                    $customer = Customers::where(function ($query) use ($data) {
                        $query->where('email', $data['email'])
                            ->orWhere('phone', $data['phone']);
                    })->active()->first();
                }

                // Nếu đã có customer
                if ($customer) {
                    $customer->load('carts.product');
                    // Kiểm tra thông tin khách hàng
                    if ($customer->name !== $data['name'] || $customer->email !== $data['email']) {
                        return response()->json(['check' => false, 'message' => 'Thông tin khách hàng không chính xác!'], 401);
                    }
                    // Cập nhật địa chỉ, số điện thoại nếu thiếu
                    if ($customer->address === null) {
                        $customer->update(['address' => $data['address']]);
                    }

                    if ($customer->phone === null) {
                        $customer->update(['phone' => $data['phone']]);
                    } elseif ($customer->phone !== $data['phone']) {
                        return response()->json(['check' => false, 'message' => 'Số điện thoại không khớp!'], 401);
                    }
                    // Kiểm tra giỏ hàng
                    if ($customer->carts->isEmpty()) {
                        return response()->json(['check' => false, 'message' => 'Giỏ hàng trống!'], 401);
                    }
                    // Chuẩn hóa lại cart
                    $cartItems = $customer->carts->map(function ($item) {
                        if (!$item->product) {
                            throw new \Exception('Sản phẩm không tồn tại!');
                        }
                        return [
                            'id_product' => $item->id_product,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->product->price * (1 - $item->product->discount / 100),
                        ];
                    })->toArray();
                } else {
                    // Nếu chưa có customer, kiểm tra trùng email/phone
                    $existingCustomer = Customers::where(function ($query) use ($data) {
                        $query->where('email', $data['email'])
                            ->orWhere('phone', $data['phone']);
                    })->active()->first();

                    if ($existingCustomer && $existingCustomer->phone === $data['phone']) {
                        return response()->json(['check' => false, 'message' => 'Số điện thoại đã có người dùng!'], 401);
                    } elseif ($existingCustomer && $existingCustomer->email === $data['email']) {
                        return response()->json(['check' => false, 'message' => 'Email đã có người dùng!'], 401);
                    }

                    $password = Str::random(10);
                    $customer = Customers::create([
                        'uid' => $this->createCodeCustomer(),
                        'name' => $data['name'],
                        'email' => $data['email'],
                        'phone' => $data['phone'],
                        'address' => $data['address'],
                        'password' => Hash::make($password)
                    ]);
                    // Tạo cart cho customer mới
                    $customer->carts()->createMany($data['cart']);
                    $cartItems = $data['cart'];
                }

                // Tạo hóa đơn
                $uidBill = $this->createCodeOrder();
                $billId = $this->model::insertGetId([
                    'uid' => $uidBill,
                    'customer_id' => $customer->id,
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'],
                    'address' => $data['address'],
                    'note' => $data['note'],
                    'name_other' => $data['name_other'] ?? null,
                    'email_other' => $data['email_other'] ?? null,
                    'phone_other' => $data['phone_other'] ?? null,
                    'address_other' => $data['address_other'] ?? null,
                    'note_other' => $data['note_other'] ?? null,
                    'payment_method' => $data['payment_method'],
                    'payment_status' => $data['payment_status'] ?? 0,
                    'transaction_id' => $data['transaction_id'] ?? null,
                    'total' => $data['total'],
                    'status' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Lưu chi tiết hóa đơn và cập nhật tồn kho
                foreach ($cartItems as $item) {
                    BillsDetail::create([
                        'id_bill' => $billId,
                        'id_product' => $item['id_product'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price']
                    ]);
                    $product = Products::find($item['id_product']);
                    if ($product) {
                        if ($item['quantity'] > $product->in_stock) {
                            throw new \Exception('Số lượng sản phẩm không đủ!');
                        }
                        $product->decrement('in_stock', $item['quantity']);
                    } else {
                        throw new \Exception('Sản phẩm không tồn tại!');
                    }
                }

                // Xóa giỏ hàng sau khi đặt hàng
                $customer->carts()->delete();

                return response()->json(['check' => true, 'uid' => $uidBill, 'total' => $data['total']], 201);
            } catch (\Throwable $e) {
                Log::error("Error: " . $e->getMessage());
                return response()->json(['check' => false, 'message' => 'Đặt hàng thất bại!'], 401);
            }
        });
    }

    /**
     * Display the specified resource.
     * $id: uid của hóa đơn
     * Cho khách hàng lấy chi tiết hóa đơn
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
     * $id: uid của hóa đơn
     * Cho khách hàng hủy hóa đơn
     */
    public function destroy(string $id)
    {
        try {
            if (Auth::check()) {
                $this->instance = $this->model::where('customer_id', Auth::user()->id)->where('uid', $id)->first();

                if (!$this->instance) {
                    return response()->json(['check' => false, 'message' => 'Đơn hàng không tồn tại!'], 404);
                }

                switch ($this->instance->status) {
                    case 0:
                    case 1:
                        $this->instance->status = 5;
                        $this->instance->save();
                        return response()->json(['check' => true, 'message' => 'Đơn hàng đã được hủy thành công!'], 200);
                    case 2:
                        return response()->json(['check' => false, 'message' => 'Đơn hàng đã giao cho đơn vị vận chuyển, không thể hủy!'], 400);
                    case 3:
                        return response()->json(['check' => false, 'message' => 'Đơn hàng đang được giao, không thể hủy!'], 400);
                    case 4:
                        return response()->json(['check' => false, 'message' => 'Đơn hàng đã giao, không thể hủy!'], 400);
                    case 5:
                        return response()->json(['check' => false, 'message' => 'Đơn hàng đã bị hủy, không thể hủy!'], 400);
                    case 6:
                        return response()->json(['check' => false, 'message' => 'Đơn hàng đã hoàn trả, không thể hủy!'], 400);
                    default:
                        return response()->json(['check' => false, 'message' => 'Trạng thái đơn hàng không hợp lệ!'], 400);
                }
            } else {
                return response()->json(['check' => false, 'message' => 'Không thể vào hóa đơn người khác!'], 401);
            }
        } catch (\Exception $e) {
            Log::error("Error: " . $e->getMessage());
            return response()->json(['check' => false, 'message' => 'Có lỗi xảy ra!'], 500);
        }
    }

    /**
     * Refund the specified resource from storage.
     * $id: uid của hóa đơn
     */
    public function refund(string $id)
    {
        try {
            if (Auth::check()) {
                $this->instance = $this->model::where('customer_id', Auth::user()->id)->where('uid', $id)->first();

                if (!$this->instance) {
                    return response()->json(['check' => false, 'message' => 'Đơn hàng không tồn tại!'], 404);
                }

                switch ($this->instance->status) {
                    case  $this->instance->status <= 3:
                        return response()->json(['check' => false, 'message' => 'Đơn hàng chưa giao, không thể hoàn trả!'], 400);
                    case 4:
                        $this->instance->status = 6;
                        $this->instance->save();
                        return response()->json(['check' => true, 'message' => 'Đơn hàng được hoàn trả thành công!'], 200);
                    case 5:
                        return response()->json(['check' => false, 'message' => 'Đơn hàng đã hủy, không thể hoàn trả!'], 400);
                    case 6:
                        return response()->json(['check' => false, 'message' => 'Đơn hàng đã hoàn trả, không thể hoàn trả!'], 400);
                    default:
                        return response()->json(['check' => false, 'message' => 'Trạng thái đơn hàng không hợp lệ!'], 400);
                }
            } else {
                return response()->json(['check' => false, 'message' => 'Không thể vào hóa đơn người khác!'], 401);
            }
        } catch (\Throwable $th) {
            return response()->json(['check' => false, 'message' => 'Có lỗi xảy ra!'], 500);
        }
    }
}