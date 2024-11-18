<?php

namespace App\Http\Controllers\Carts;

use App\Http\Controllers\Controller;
use App\Http\Requests\Carts\CartRequest;
use App\Models\Carts;
use App\Models\Customers;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function __construct()
    {
        $this->model = Carts::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // 
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
    public function store(CartRequest $request)
    {
        $this->data = $request->validated();
        $idCustomer = Customers::where("uid", $this->data['id_customer'])->first();
        $this->instance = $this->model::where('id_customer', $idCustomer->id)->where('id_product', $this->data['id_product'])->first();

        if ($this->instance) {
            $qty = $this->data['quantity'] + $this->instance->quantity;
            if (!$this->checkInStock($this->data['id_product'], $qty)) {
                return response()->json(['check' => false, 'message' => 'Số lượng mua đạt tối đa!'], 401);
            }
            $this->instance->update(['quantity' => $qty]);
        } else {
            $this->data['id_customer'] = $idCustomer->id;
            if (!$this->model::create($this->data)) {
                return response()->json(['check' => false, 'message' => 'Thêm thất bại!'], 401);
            }
        }
        $this->data = $this->model::where('id_customer', $idCustomer->id)->get();
        $this->instance = $this->data->map(function ($item) {
            $galleryImg = $item->product->gallery->firstWhere('status', 1);
            return [
                'id' => $item->id,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'slug' => $item->product->slug,
                    'price' => $item->product->price,
                    'discount' => $item->product->discount,
                    'in_stock' => $item->product->in_stock,
                    'highlighted' => $item->product->highlighted,
                    'gallery' => $galleryImg ? asset('storage/gallery/' . $galleryImg->image) : null,
                ],
                'quantity' => $item->quantity
            ];
        });
        return response()->json(['check' => true, 'message' => 'Thêm thành công!', 'data' => $this->instance], 201);
    }

    private function checkInStock($id, $quantity)
    {
        $product = Products::find($id);
        if (!$product || $product->in_stock < $quantity) {
            return false;
        }
        return true;
    }

    /**
     * Display the specified resource.
     * $id : uid của khách hàng
     */
    public function show(string $id)
    {
        $idCustomer = Customers::where("uid", $id)->first();
        $this->data = $this->model::with('customer', 'product.gallery')->where('id_customer', $idCustomer->id)->get();

        if ($this->data->isEmpty()) {
            return response()->json(['check' => false, 'message' => 'Giỏ hàng trống!'], 404);
        }

        $this->instance = $this->data->map(function ($item) {
            $galleryImg = $item->product->gallery->firstWhere('status', 1);
            return [
                'id' => $item->id,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'slug' => $item->product->slug,
                    'price' => $item->product->price,
                    'discount' => $item->product->discount,
                    'in_stock' => $item->product->in_stock,
                    'highlighted' => $item->product->highlighted,
                    'image' => $galleryImg ? asset('storage/gallery/' . $galleryImg->image) : null,
                ],
                'quantity' => $item->quantity
            ];
        });

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
     * $id : id của giỏ hàng
     */
    public function update(CartRequest $request, string $id)
    {
        $this->data = $request->validated();
        $idCustomer = Customers::where("uid", $this->data['id_customer'])->first();
        $this->instance = $this->model::where('id', $id)->where('id_customer', $idCustomer->id)->where('id_product', $this->data['id_product'])->first();

        if ($this->instance) {
            if (!$this->checkInStock($this->data['id_product'], $this->data['quantity'])) {
                return response()->json(['check' => false, 'message' => 'Số lượng mua đạt tối đa!'], 401);
            }
            $this->data['id_customer'] = $idCustomer->id;
            $this->instance->update($this->data);

            $this->data = $this->model::with('customer', 'product.gallery')->where('id_customer', $idCustomer->id)->get();

            $this->instance = $this->data->map(function ($item) {
                $galleryImg = $item->product->gallery->firstWhere('status', 1);
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'price' => $item->product->price,
                        'discount' => $item->product->discount,
                        'in_stock' => $item->product->in_stock,
                        'highlighted' => $item->product->highlighted,
                        'image' => $galleryImg ? asset('storage/gallery/' . $galleryImg->image) : null,
                    ],
                    'quantity' => $item->quantity
                ];
            });
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->instance], 200);
        }

        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại! Không tìm thấy sản phẩm.'], 404);
    }


    /**
     * Remove the specified resource from storage.
     * $id : id của giỏ hàng
     */
    public function destroy(string $id)
    {
        try {
            $this->instance = $this->model::findOrFail($id);

            if ($this->instance->delete()) {
                $this->data = $this->model::with('customer', 'product.gallery')->where('id', $id)->get();
                $this->instance = $this->data->map(function ($item) {
                    $galleryImg = $item->product->gallery->firstWhere('status', 1);
                    return [
                        'id' => $item->id,
                        'product' => [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                            'slug' => $item->product->slug,
                            'price' => $item->product->price,
                            'discount' => $item->product->discount,
                            'in_stock' => $item->product->in_stock,
                            'highlighted' => $item->product->highlighted,
                            'image' => $galleryImg ? asset('storage/gallery/' . $galleryImg->image) : null,
                        ],
                        'quantity' => $item->quantity
                    ];
                });
                return response()->json(['check' => true, 'message' => 'Xóa thành công!', 'data' => $this->instance], 200);
            }
            return response()->json(['check' => false, 'message' => 'Xóa thất bại!'], 400);
        } catch (\Exception $e) {
            return response()->json(['check' => false, 'message' => 'Lỗi xảy ra khi xóa!', 'error' => $e->getMessage()], 500);
        }
    }

    public function loadCart(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'cartItems' => 'required|array',
            'cartItems.*.id' => 'required|integer',
            'cartItems.*.quantity' => 'required|integer'
        ]);

        if ($validation->fails()) {
            return response()->json(['check' => false, 'message' => $validation->errors()->first()], 400);
        }

        $cartItems = $request->only('cartItems')['cartItems'];
        $cart = [];

        foreach ($cartItems as $key => $value) {
            $cart = Products::with('gallery')->find($value['id']);

            if ($cart) {
                $cart[] = [
                    'id' => $cart->id,
                    'name' => $cart->name,
                    'slug' => $cart->slug,
                    'price' => $cart->price,
                    'discount' => $cart->discount,
                    'in_stock' => $cart->in_stock,
                    'highlighted' => $cart->highlighted,
                    'image' => asset('storage/gallery/' . $cart->gallery->firstWhere('status', 1)->image),
                    'quantity' => $value['quantity']

                ];
            }
        }

        return response()->json(['check' => true, 'data' => $cart], 200);
    }
}
