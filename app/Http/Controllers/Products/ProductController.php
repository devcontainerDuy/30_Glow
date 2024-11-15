<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\ProductRequest;
use App\Models\Brands;
use App\Models\Categories;
use App\Models\Gallery;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;


class ProductController extends Controller
{
    public function __construct()
    {
        $this->model = Products::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Sản phẩm', 'url' => '/admin/products'],
            ['name' => 'Danh sách sản phẩm', 'url' => '/admin/products'],
        ];
        $this->data = $this->model::with('category', 'brand', 'gallery')->orderBy('id', 'desc')->get();
        $category = Categories::active()->select('id', 'name')->get();
        $brand = Brands::active()->select('id', 'name')->get();
        return Inertia::render('Products/Index', ['products' => $this->data, 'crumbs' => $this->crumbs, 'categories' => $category, 'brands' => $brand]);
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
    public function store(ProductRequest $request)
    {
        $this->data = $request->validated();
        $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::create($this->data);

        if ($request->hasFile('image')) {
            $galleryData = [];

            foreach ($request->file('image') as $key => $item) {
                $image = time() . '_' . $item->getClientOriginalName();
                Storage::putFileAs('public/gallery', $item, $image);

                $status = $key === 0 ? 1 : 0;
                $galleryData[] = [
                    'image' => $image,
                    'id_parent' => $this->instance->id,
                    'status' => $status,
                ];
            }
            Gallery::insert($galleryData);
        }

        if ($this->instance) {
            $this->data = $this->model::with('category', 'brand', 'gallery')->orderBy('id', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Tạo thành công!', 'data' => $this->data], 201);
        }

        return response()->json(['check' => false, 'message' => 'Tạo thất bại!'], 400);
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
            ['name' => 'Chi tiết sản phẩm', 'url' => '/admin/products/' . $id . '/edit'],
        ];
        $this->data = $this->model::with('category', 'brand', 'gallery')->findOrFail($id);
        $category = Categories::active()->select('id', 'name')->get();
        $brand = Brands::active()->select('id', 'name')->get();
        return Inertia::render('Products/Edit', ['products' => $this->data, 'crumbs' => $this->crumbs, 'categories' => $category, 'brands' => $brand]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, string $id)
    {
        $this->data = $request->validated();
        if (isset($this->data['name'])) $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::with('category', 'brand', 'gallery')->orderBy('id', 'desc')->get();
            $categories = Categories::with('parent')->withCount('products')->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data, 'categories' => $categories], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }

    /**
     * Remove the specified resource from storage.
     */

    public function destroy(string $id)
    {
        $this->instance = $this->model::with('gallery')->findOrFail($id);

        foreach ($this->instance->gallery as $image) {
            $imagePath = "public/gallery/{$image->image}";
            if (Storage::exists($imagePath)) {
                Storage::delete($imagePath);
            }
            $image->delete();
        }

        $this->instance = $this->instance->delete();

        if ($this->instance) {
            $this->data = $this->model::with('category', 'brand', 'gallery')->orderBy('id', 'desc')->get();
            $categories = Categories::with('parent')->withCount('products')->get();
            return response()->json(['check' => true, 'message' => 'Xoá thành công!', 'data' => $this->data, 'categories' => $categories], 200);
        }

        return response()->json(['check' => false, 'message' => 'Xoá thất bại!'], 400);
    }

    /**
     * API Client
     */
    public function apiHighlighted()
    {
        $this->data = $this->model::with('category', 'brand', 'gallery')->highlighted()->active()->orderBy('created_at', 'desc')->limit(5)->get();
        $this->data->transform(function ($item) {
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

    public function apiIndex()
    {
        $this->data = $this->model::with('category', 'brand', 'gallery')->active()->paginate(10);
        $this->data->getCollection()->transform(function ($item) {
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

    public function apiShow($slug)
    {
        $this->data = $this->model::with(['category', 'brand', 'gallery', 'relatedProducts'])->active()->where('slug', $slug)->firstOrFail();

        if (!$this->data) {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy sản phẩm'], 404);
        }

        $this->instance = [
            'id' => $this->data->id,
            'name' => $this->data->name,
            'slug' => $this->data->slug,
            'price' => $this->data->price,
            'discount' => $this->data->discount,
            'in_stock' => $this->data->in_stock,
            'content' => $this->data->content,
            'status' => $this->data->status,
            'category' => $this->data->category ? [
                'id' => $this->data->category->id,
                'name' => $this->data->category->name,
                'slug' => $this->data->category->slug,
                'status' => $this->data->category->status,
            ] : null,
            'brand' => $this->data->brand ? [
                'id' => $this->data->brand->id,
                'name' => $this->data->brand->name,
                'slug' => $this->data->brand->slug,
                'status' => $this->data->brand->status,
            ] : null,
            'gallery' => $this->data->gallery->map(function ($gallery) {
                return [
                    'id' => $gallery->id,
                    'image' => asset('storage/gallery/' . $gallery->image),
                    'id_parent' => $gallery->id_parent,
                    'status' => $gallery->status,
                ];
            }),
            'related_products' => $this->data->relatedProducts->map(function ($related) {
                return [
                    'id' => $related->id,
                    'name' => $related->name,
                    'slug' => $related->slug,
                    'price' => $related->price,
                    'discount' => $related->discount,
                    'in_stock' => $related->in_stock,
                    'status' => $related->status,
                    'category' => $related->category ? [
                        'id' => $related->category->id,
                        'name' => $related->category->name,
                        'slug' => $related->category->slug,
                        'status' => $related->category->status,
                    ] : null,
                    'brand' => $related->brand ? [
                        'id' => $related->brand->id,
                        'name' => $related->brand->name,
                        'slug' => $related->brand->slug,
                        'status' => $related->brand->status,
                    ] : null,
                    'gallery' => $related->gallery->map(function ($gallery) {
                        return [
                            'id' => $gallery->id,
                            'image' => asset('storage/gallery/' . $gallery->image),
                            'id_parent' => $gallery->id_parent,
                            'status' => $gallery->status,
                        ];
                    }),
                ];
            }),
        ];
        return response()->json(['check' => true, 'data' => $this->instance], 200);
    }
}