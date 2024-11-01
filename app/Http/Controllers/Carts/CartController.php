<?php

namespace App\Http\Controllers\Carts;

use App\Http\Controllers\Controller;
use App\Http\Requests\Carts\CartRequest;
use App\Models\Carts;
use Illuminate\Http\Request;

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
        $this->instance = $this->model::where('id_customer', $this->data['id_customer'])->where('id_product', $this->data['id_product'])->first();
        if ($this->instance) {
            $this->data['quantity'] += $this->instance->quantity;
            $this->instance->update($this->data);
        } else {
            if (!$this->model::create($this->data)) {
                return response()->json(['check' => false, 'message' => 'Thêm thất bại!'], 401);
            }
        }

        $this->data = $this->model::where('id_customer', $this->data['id_customer'])->get();
        return response()->json(['check' => true, 'message' => 'Thêm thành công!', 'data' => $this->data], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $this->data = $this->model::with('customer', 'product.gallery')->where('id_customer', $id)->get();

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
     */
    public function update(CartRequest $request, string $id)
    {
        $this->data = $request->validated();

        $this->instance = $this->model::where('id', $id)->where('id_customer', $this->data['id_customer'])->where('id_product', $this->data['id_product'])->first();

        if ($this->instance) {
            $this->instance->update($this->data);

            $this->data = $this->model::with('customer', 'product.gallery')->where('id_customer', $this->data['id_customer'])->get();

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
     */
    public function destroy(string $id)
    {
        try {
            $this->instance = $this->model::findOrFail($id);

            if ($this->instance->delete()) {
                $this->data = $this->model::with('customer', 'product.gallery')->where('id_customer', $id)->get();
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
}
