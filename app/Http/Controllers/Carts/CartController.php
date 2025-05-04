<?php

namespace App\Http\Controllers\Carts;

use App\Http\Controllers\Controller;
use App\Http\Requests\Carts\CartRequest;
use App\Models\Carts;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $this->data = $this->model::with('customer', 'product.gallery')->where('id_customer', Auth::user()->id)->get();

        if ($this->data->isEmpty()) {
            return response()->json(['check' => false, 'message' => 'Giỏ hàng trống!', 'data' => []], 404);
        }

        $this->instance = $this->data->map(function ($item) {
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
                    'image' => $item->product->gallery ? asset('storage/gallery/' . $item->product->gallery->firstWhere('status', 1)->image) : null,
                ],
                'quantity' => $item->quantity
            ];
        });

        return response()->json(['check' => true, 'data' => $this->instance], 200);
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
        $this->instance = $this->model::where('id_customer', Auth::user()->id)->where('id_product', $this->data['id_product'])->first();

        if ($this->instance) {
            $qty = $this->data['quantity'] + $this->instance->quantity;
            if (!$this->checkInStock($this->data['id_product'], $qty)) {
                return response()->json(['check' => false, 'message' => 'Số lượng mua đạt tối đa!'], 401);
            }
            $this->instance->update(['quantity' => $qty]);
        } else {
            $this->data['id_customer'] = Auth::user()->id;
            if (!$this->model::create($this->data)) {
                return response()->json(['check' => false, 'message' => 'Thêm thất bại!'], 401);
            }
        }
        return response()->json(['check' => true, 'message' => 'Thêm thành công!'], 201);
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
     * $id : id của giỏ hàng
     */
    public function update(CartRequest $request, string $id)
    {
        $this->data = $request->validated();
        $this->instance = $this->model::where('id', $id)->where('id_customer', Auth::user()->id)->where('id_product', $this->data['id_product'])->first();

        if ($this->instance) {
            if (!$this->checkInStock($this->data['id_product'], $this->data['quantity'])) {
                return response()->json(['check' => false, 'message' => 'Số lượng mua đạt tối đa!'], 401);
            }

            $this->instance->update($this->data);
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!'], 200);
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
            $this->instance->delete();
            return response()->json(['check' => true, 'message' => 'Xóa thành công!'], 200);
        } catch (\Exception $e) {
            return response()->json(['check' => false, 'message' => 'Xóa thất bại!'], 400);
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

        $this->data = $request->only('cartItems')['cartItems'];
        $cart = [];

        foreach ($this->data as $value) {
            $this->instance = Products::with(['gallery', 'category', 'brand'])->active()->findOrFail($value['id']);

            if ($this->instance) {
                $cart[] = [
                    'id' => $this->instance->id,
                    'name' => $this->instance->name,
                    'slug' => $this->instance->slug,
                    'price' => $this->instance->price,
                    'discount' => $this->instance->discount,
                    'in_stock' => $this->instance->in_stock,
                    'highlighted' => $this->instance->highlighted,
                    'gallery' => asset('storage/gallery/' . $this->instance->gallery->firstWhere('status', 1)->image),
                    'quantity' => $value['quantity']
                ];
            } else {
                return response()->json(['check' => false, 'message' => 'Sản phẩm không tồn tại!'], 404);
            }
        }

        return response()->json(['check' => true, 'data' => $cart], 200);
    }
}
