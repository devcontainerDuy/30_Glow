<?php

namespace App\Http\Controllers\Categories;

use App\Http\Controllers\Controller;
use App\Http\Requests\Categories\CategoriesRequest;
use App\Models\Brands;
use App\Models\Categories;
use App\Models\Products;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoriesController extends Controller
{
    public function __construct()
    {
        $this->model = Categories::class;
    }

    public function index()
    {
        $this->crumbs = [
            ['name' => 'Sản phẩm', 'url' => '/admin/products'],
            ['name' => 'Danh sách danh mục', 'url' => '/admin/categories'],
        ];
        $this->data = $this->model::with('parent', 'products', 'products.gallery')->withCount('products')->get();
        $trashs = $this->model::with('parent', 'products', 'products.gallery')->withCount('products')->onlyTrashed()->get();
        return Inertia::render('Categories/Index', ['categories' => $this->data, 'trashs' => $trashs, 'crumbs' => $this->crumbs,]);
    }

    public function store(CategoriesRequest $request)
    {
        $this->data = $request->validated();
        $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::create($this->data);
        if ($this->instance) {
            $this->data = $this->model::with('parent', 'products', 'products.gallery')->withCount('products')->get();
            return response()->json(['check' => true, 'message' => 'Tạo thành công!', 'data' => $this->data], 201);
        }
        return response()->json(['check' => false, 'message' => 'Tạo thất bại!'], status: 400);
    }

    public function edit(string $id)
    {
        $this->crumbs = [
            ['name' => 'Sản phẩm', 'url' => '/admin/products'],
            ['name' => 'Danh sách danh mục', 'url' => '/admin/categories'],
            ['name' => 'Sản phẩm thuộc danh mục', 'url' => '/admin/categories/' . $id . '/edit']
        ];
        $this->data = Products::with('category', 'brand', 'gallery')->where('id_category', $id)->get();
        return Inertia::render('Products/Index', ['products' => $this->data, 'crumbs' => $this->crumbs]);
    }

    public function update(CategoriesRequest $request, $id)
    {
        $this->data = $request->validated();
        if (isset($this->data['name'])) $this->data['slug'] = Str::slug($this->data['name']);

        $this->instance = $this->model::findOrFail($id)->load('products', 'children');

        if ($this->instance->update($this->data)) {
            $this->data = $this->model::with('parent', 'products', 'products.gallery')->withCount('products')->get();
            $trashs = $this->model::with('parent', 'products', 'products.gallery')->withCount('products')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'trashs' => $trashs,  'data' => $this->data], 200);
        }

        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }

    public function destroy($id)
    {
        $this->instance = $this->model::findOrFail($id)->load('products', 'children');

        if ($this->instance->products()->count() > 0) {
            return response()->json(['check' => false, 'message' => 'Danh mục có sản phẩm, không thể xóa!'], 400);
        }

        if ($this->instance->children()->count() > 0) {
            return response()->json(['check' => false, 'message' => 'Danh mục đang là cha, không thể xóa!'], 400);
        }

        $this->instance->update(['status' => 0]);

        if ($this->instance->delete()) {
            $this->data = $this->model::with('parent', 'products', 'products.gallery')->select('id', 'name', 'slug', 'id_parent', 'status')->withCount('products')->get();
            $trashs = $this->model::with('parent', 'products', 'products.gallery')->select('id', 'name', 'slug', 'id_parent', 'status')->withCount('products')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Xoá thành công!', 'data' => $this->data, 'trashs' => $trashs,], 200);
        }

        return response()->json(['check' => false, 'message' => 'Có lỗi xảy ra khi xóa!'], 500);
    }

    public function restore($id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);
        $this->instance->restore();
        $this->instance->update(['status' => 1]);
        if ($this->instance) {
            $this->data = $this->model::with('parent', 'products', 'products.gallery')->select('id', 'name', 'slug', 'id_parent', 'status')->withCount('products')->get();
            $trashs = $this->model::with('parent', 'products', 'products.gallery')->select('id', 'name', 'slug', 'id_parent', 'status')->withCount('products')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Khôi phục thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }
    }

    public function permanent(string $id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);
        $this->instance->forceDelete();
        if ($this->instance) {
            $this->data = $this->model::with('parent', 'products', 'products.gallery')->select('id', 'name', 'slug', 'id_parent', 'status')->withCount('products')->get();
            $trashs = $this->model::with('parent', 'products', 'products.gallery')->select('id', 'name', 'slug', 'id_parent', 'status')->withCount('products')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Đã xóa vĩnh viễn thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }
    }

    /**
     * API Client
     */
    public function apiIndex()
    {
        $this->data = $this->model::with("parent")->select('id', 'name', 'slug', 'id_parent', 'status')->whereHas('products')->orderBy('created_at', 'desc')->get();
        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiShow($slug)
    {
        $this->data = $this->model::with("products.gallery", "products.brand", "products.category", "children.products")->select('id', 'name', 'slug', 'id_parent', 'status')->where('slug', $slug)->first();

        if (!$this->data) {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy phân loại sản phẩm'], 404);
        }

        if (!$this->data->products) {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy sản phẩm nào'], 404);
        }

        $this->data->parent = $this->data->parent ? [
            'id' => $this->data->parent->id,
            'name' => $this->data->parent->name,
            'slug' => $this->data->parent->slug,
            'status' => $this->data->parent->status,
        ] : null;

        $this->data->products->transform(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'price' => $item->price,
                'discount' => $item->discount,
                'in_stock' => $item->in_stock,
                // 'content' => $item->content,
                'category' => $item->category ? [
                    'name' => $item->category->name,
                    'slug' => $item->category->slug,
                ] : null,
                'brand' => $item->brand ? [
                    'name' => $item->brand->name,
                    'slug' => $item->brand->slug,
                ] : null,
                'gallery' => $item->gallery ?
                    asset('storage/gallery/' . ($item->gallery->firstWhere('status', 1)->image ?? null)) :
                    null,
            ];
        });

        $childrenProducts = $this->data->children->pluck('products')->flatten();
        $this->data->children = $childrenProducts->transform(function ($item) {
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
                        'image' => asset("storage/gallery/{$galleryItem->image}"),
                        'id_parent' => $galleryItem->id_parent,
                        'status' => $galleryItem->status,
                    ];
                }),
            ];
        });

        return response()->json(['check' => true, 'data' => $this->data], 200);
    }
}