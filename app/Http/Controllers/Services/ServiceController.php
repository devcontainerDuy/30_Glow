<?php

namespace App\Http\Controllers\Services;

use App\Http\Controllers\Controller;
use App\Http\Requests\Services\ServiceRequest;
use App\Models\Services;
use App\Models\ServicesCollections;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function __construct()
    {
        $this->model = Services::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Dịch vụ', 'url' => '/admin/services'],
            ['name' => 'Danh sách dịch vụ', 'url' => '/admin/services'],
        ];
        $this->data = $this->model::with('collection')->get();
        $this->instance = ServicesCollections::active()->select('id', 'name')->get();
        return Inertia::render('Services/Index', ['services' => $this->data, 'collections' => $this->instance, 'crumbs' => $this->crumbs]);
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
    public function store(ServiceRequest $request)
    {
        $this->data = $request->validated();
        $this->data['slug'] = Str::slug($this->data['name']);
        $file = $request->file('image');
        $imageName = $file->getClientOriginalName();
        $extractTo = storage_path('app/public/services/');
        $file->move($extractTo, $imageName);

        $this->data['image'] = $imageName;
        $this->instance = $this->model::create($this->data);
        if ($this->instance) {
            $this->data = $this->model::with('collection')->get();
            return response()->json(['check' => true, 'message' => 'Thêm thành công!', 'data' => $this->data], 201);
        }
        return response()->json(['check' => false, 'message' => 'Thêm thất bại!'], 400);
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
            ['name' => 'Dịch vụ', 'url' => '/admin/services'],
            ['name' => 'Danh sách dịch vụ', 'url' => '/admin/services'],
            ['name' => 'Chi tiết dịch vụ', 'url' => '/admin/services/' . $id . '/edit'],
        ];
        $this->data = $this->model::findOrFail($id);
        // dd($this->data);
        $this->instance = ServicesCollections::active()->select('id', 'name')->get();
        return Inertia::render('Services/Edit', ['service' => $this->data, 'collections' => $this->instance, 'crumbs' => $this->crumbs]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ServiceRequest $request, string $id)
    {
        $this->data = $request->validated();
        if (isset($this->data['name'])) $this->data['slug'] = Str::slug($this->data['name']);

        if (isset($this->data['image'])) {
            $file = $request->file('image');
            $imageName = $file->getClientOriginalName();
            $extractTo = storage_path('app/public/services/');
            $file->move($extractTo, $imageName);
            $this->data['image'] = $imageName;
        }

        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::with('collection')->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->instance = $this->model::findOrFail($id)->delete();
        if ($this->instance) {
            $this->data = $this->model::with('collection')->get();
            return response()->json(['check' => true, 'message' => 'Xóa thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Xóa thất bại!'], 400);
    }

    /**
     * API Client
     */

    public function apiHighlighted()
    {
        $this->data = $this->model::with('collection')->highlighted()->active()->limit(5)->get();
        $this->data->transform(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'price' => $item->price,
                'compare_price' => $item->compare_price,
                'discount' => $item->discount,
                'image' => asset('storage/services/' . $item->image),
                'summary' => $item->summary,
                'content' => $item->content,
                'status' => $item->status,
                'collection' => $item->collection ? [
                    'id' => $item->collection->id,
                    'name' => $item->collection->name,
                    'slug' => $item->collection->slug,
                    'status' => $item->collection->status,
                ] : null,
            ];
        });
        return response()->json(['check' => true, 'data' => $this->data], 200);
    }
    public function apiIndex()
    {
        $this->data = $this->model::with('collection')->active()->paginate(10);
        $this->data->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'price' => $item->price,
                'compare_price' => $item->compare_price,
                'discount' => $item->discount,
                'image' => asset('storage/services/' . $item->image),
                'summary' => $item->summary,
                'content' => $item->content,
                'status' => $item->status,
                'collection' => $item->collection ? [
                    'id' => $item->collection->id,
                    'name' => $item->collection->name,
                    'slug' => $item->collection->slug,
                    'status' => $item->collection->status,
                ] : null,
            ];
        });
        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiShow($slug)
    {
        $this->data = $this->model::with('collection')->active()->where('slug', $slug)->firstOrFail();

        $this->instance = [
            'id' => $this->data->id,
            'name' => $this->data->name,
            'slug' => $this->data->slug,
            'price' => $this->data->price,
            'compare_price' => $this->data->compare_price,
            'discount' => $this->data->discount,
            'image' => asset('storage/services/' . $this->data->image),
            'summary' => $this->data->summary,
            'content' => $this->data->content,
            'status' => $this->data->status,
            'collection' => $this->data->collection ? [
                'id' => $this->data->collection->id,
                'name' => $this->data->collection->name,
                'slug' => $this->data->collection->slug,
                'status' => $this->data->collection->status,
            ] : null,
        ];

        return response()->json(['check' => true, 'data' => $this->instance], 200);
    }
}
