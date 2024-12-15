<?php

namespace App\Http\Controllers\Brands;

use App\Http\Controllers\Controller;
use App\Http\Requests\Brands\BrandsRequest;
use App\Models\Brands;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BrandsController extends Controller
{
    public function __construct()
    {
        $this->model = Brands::class;
    }
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Sản phẩm', 'url' => '/admin/products'],
            ['name' => 'Danh sách thương hiệu', 'url' => '/admin/brands'],
        ];
        $this->data = $this->model::with('products.gallery')->withCount('products')->get();
        $trashs = $this->model::with('products.gallery')->withCount('products')->onlyTrashed()->get();
        return Inertia::render('Brands/Index', ['brands' => $this->data, 'trashs' => $trashs, 'crumbs' => $this->crumbs]);
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
    public function store(BrandsRequest $request)
    {
        $this->data = $request->validated();
        $this->data['slug'] = str::slug($this->data['name']);
        $this->instance = $this->model::create($this->data);
        if ($this->instance) {
            $this->data = $this->model::with('products.gallery')->withCount('products')->orderBy('id', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Tạo thành công!', 'data' => $this->data], 201);
        }
        return response()->json(['check' => false, 'message' => 'Tạo thất bại!'], status: 400);
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
    public function update(BrandsRequest $request, string $id)
    {
        $this->data = $request->validated();
        if (isset($this->data['name'])) $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::with('products.gallery')->withCount('products')->orderBy('id', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    // public function destroy(string $id)
    // {
    //     try {
    //         $this->instance = $this->model::findOrFail($id)->delete();
    //         if ($this->instance) {
    //             $this->data = $this->model::orderBy('id', 'desc')->get();
    //             return response()->json(['check' => true, 'message' => 'Xoá thành công!', 'data' => $this->data], 200);
    //         }
    //         return response()->json(['check' => false, 'message' => 'Xoá thất bại!'], 400);
    //     } catch (\Throwable $th) {
    //         return response()->json(['check' => false, 'message' => 'Thương hiệu có sản phẩm!'], 400);
    //     }
    // }

    public function destroy($id)
    {
        $this->instance = $this->model::findOrFail($id)->load('products');

        if ($this->instance->products()->count() > 0) {
            return response()->json(['check' => false, 'message' => 'Thương hiệu đang có sản phẩm, không thể xóa!'], 400);
        }

        $this->instance->update(['status' => 0]);
        $this->instance = $this->instance->delete();

        if ($this->instance) {
            $this->data = $this->model::with('products.gallery')->withCount('products')->orderBy('id', 'desc')->get();
            $trashs = $this->model::with('products.gallery')->withCount('products')->orderBy('id', 'desc')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Xoá thành công!', 'data' => $this->data, 'trashs' => $trashs,], 200);
        }

        return response()->json(['check' => false, 'message' => 'Có lỗi xảy ra khi xóa!'], 500);
    }

    public function restore($id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);
        $this->instance->update(['status' => 1]);
        $this->instance->restore();
        if ($this->instance) {
            $this->data = $this->model::with('products.gallery')->withCount('products')->orderBy('id', 'desc')->get();
            $trashs = $this->model::with('products.gallery')->withCount('products')->orderBy('id', 'desc')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Khôi phục thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }
    }

    public function permanent(string $id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);
        $this->instance->forceDelete();
        if ($this->instance) {
            $this->data = $this->model::with('products.gallery')->withCount('products')->orderBy('id', 'desc')->get();
            $trashs = $this->model::with('products.gallery')->withCount('products')->orderBy('id', 'desc')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Đã xóa vĩnh viễn thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }
    }

    /**
     * API Client
     */
    public function apiIndex()
    {
        $this->data = $this->model::active()->select('id', 'name', 'slug', 'status')->whereHas('products')->orderBy('created_at', 'desc')->get();
        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiShow($slug)
    {
        $this->data = $this->model::with("products")->active()->select('id', 'name', 'slug', 'status')->whereHas('products.gallery')->where('slug', $slug)->firstOrFail();

        if (!$this->data) {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy thương hiệu'], 404);
        }

        $this->data->products->transform(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'price' => $item->price,
                'discount' => $item->discount,
                'in_stock' => $item->in_stock,
                // 'content' => $item->content,
                'status' => $item->status,
                'category' => $item->category ? [
                    'id' => $item->category->id,
                    'name' => $item->category->name,
                    'slug' => $item->category->slug,
                    'status' => $item->category->status,
                ] : null,
                'brand' => $item->brand ? [
                    'id' => $item->brand->id,
                    'name' => $item->brand->name,
                    'slug' => $item->brand->slug,
                    'status' => $item->brand->status,
                ] : null,
                'gallery' => $item->gallery->map(function ($galleryItem) {
                    return [
                        'id' => $galleryItem->id,
                        'image' => asset('storage/gallery/' . $galleryItem->image),
                        'id_parent' => $galleryItem->id_parent,
                        'status' => $galleryItem->status,
                    ];
                }),
            ];
        });

        return response()->json(['check' => true, 'data' => $this->data], 200);
    }
}
