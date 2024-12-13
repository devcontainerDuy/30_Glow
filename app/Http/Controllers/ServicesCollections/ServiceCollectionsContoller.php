<?php

namespace App\Http\Controllers\ServicesCollections;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServicesCollections\ServiceCollectionsrRequest;
use App\Models\ServicesCollections;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ServiceCollectionsContoller extends Controller
{
    public function __construct()
    {
        $this->model = ServicesCollections::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Dịch Vụ', 'url' => '/admin/services'],
            ['name' => 'Phân Loại Dịch Vụ', 'url' => '/admin/services/collections'],
        ];
        $this->data = $this->model::orderBy('id', 'desc')->get();
        return Inertia::render('ServicesCollections/Index', ['collections' => $this->data, 'crumbs' => $this->crumbs]);
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
    public function store(ServiceCollectionsrRequest $request)
    {
        $this->data = $request->validated();
        $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::create($this->data);
        if ($this->instance) {
            $this->data = $this->model::orderBy('id', 'desc')->get();
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ServiceCollectionsrRequest $request, string $id)
    {
        $this->data = $request->validated();
        if (isset($this->data['name'])) $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::orderBy('id', 'desc')->get();
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
            $this->data = $this->model::orderBy('id', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Xóa thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Xóa thất bại!'], 400);
    }

    /**
     * API Client
     */
    public function apiHighlighted()
    {
        $this->data = $this->model::highlighted()->select('id', 'name', 'slug', 'status', 'highlighted')->whereHas('services')->orderBy('created_at', 'asc')->get();
        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiIndex()
    {
        $this->data = $this->model::active()->select('id', 'name', 'slug', 'status', 'highlighted')->whereHas('services')->orderBy('created_at', 'asc')->get();
        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiShow($slug)
    {
        $this->data = $this->model::with('services')->active()->select('id', 'name', 'slug', 'status', 'highlighted')->whereHas(
            'services',
            function ($query) {
                $query->where('status', 1);
            }
        )->where('slug', $slug)->firstOrFail();

        if (!$this->data) {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy dịch vụ!'], 404);
        }

        $this->data->services->transform(function ($item) {
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
}