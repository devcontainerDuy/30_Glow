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
        $this->data = $this->model::with('parent', 'products', 'products.gallery')->active()->select('id', 'name', 'slug', 'id_parent', 'status')->withCount('products')->orderBy('id', 'desc')->get();
        return Inertia::render('Categories/Index', ['categories' => $this->data, 'crumbs' => $this->crumbs]);
    }
    public function store(CategoriesRequest $request)
    {
        $this->data = $request->validated();
        $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::create($this->data);
        if ($this->instance) {
            $this->data = $this->model::with('parent')->orderBy('id', 'desc')->get();
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
        $category = Categories::active()->select('id', 'name')->get();
        $brand = Brands::active()->select('id', 'name')->get();
        return Inertia::render('Products/Index', ['products' => $this->data, 'crumbs' => $this->crumbs, 'categories' => $category, 'brands' => $brand]);
    }

    public function update(CategoriesRequest $request, $id)
    {
        $this->data = $request->validated();
        if (isset($this->data['name'])) $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::with('parent')->orderBy('id', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }

    public function destroy($id)
    {
        try {
            $this->instance = $this->model::findOrFail($id)->delete();
            if ($this->instance) {
                $this->data = $this->model::with('parent')->orderBy('id', 'desc')->get();
                return response()->json(['check' => true, 'message' => 'Xoá thành công!', 'data' => $this->data], 200);
            }
            return response()->json(['check' => false, 'message' => 'Xoá thất bại!'], 400);
        } catch (\Exception $e) {
            return response()->json(['check' => false, 'message' => 'Doanh mục có sản phẩm!'], 400);
        }
    }

    /**
     * API Client
     */
    public function apiIndex()
    {
        $this->data = $this->model::with("parent")->active()->select('id', 'name', 'slug', 'id_parent', 'status')->whereHas('products')->orderBy('created_at', 'desc')->get();
        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiShow($slug)
    {
        $this->data = $this->model::with("products.gallery", "products.brand", "products.category")->active()->select('id', 'name', 'slug', 'id_parent', 'status')->whereHas('products.gallery')->where('slug', $slug)->firstOrFail();

        if (!$this->data) {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy phân loại sản phẩm'], 404);
        }

        $this->data->products->transform(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'price' => $item->price,
                'discount' => $item->discount,
                'in_stock' => $item->in_stock,
                'content' => $item->content,
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
