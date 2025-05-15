<?php

namespace App\Http\Controllers\Sitemap;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sitemap\SitemapRequest;
use App\Models\Sitemap;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SitemapController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        $this->model = Sitemap::class;
    }
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Sitemap', 'url' => '/admin/sitemap'],
        ];
        $this->data = $this->model::orderBy('id', 'desc')->get();
        $trashs = $this->model::orderBy('id', 'desc')->onlyTrashed()->get();
        return Inertia::render('Sitemap/Index', ['sitemap' => $this->data, 'trashs' => $trashs, 'crumbs' => $this->crumbs]);
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
    public function store(SitemapRequest $request)
    {
        //t kh gọi Request từ SitemapRequest
        $this->data = $request->validated();

        $this->data['stastus'] = 1;
        $this->instance = $this->model::create($this->data);

        if ($this->instance) {
            $this->data = $this->model::orderBy('id', 'desc')->get();
            $trashs = $this->model::orderBy('id', 'desc')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Tạo thành công!', 'trashs' => $trashs, 'data' => $this->data], 201);
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
            ['name' => 'Sitemap', 'url' => '/admin/Sitemap'],
            ['name' => 'Danh sách Sitemap', 'url' => '/admin/Sitemap'],
            ['name' => 'Chi tiết Sitemap', 'url' => '/admin/Sitemap/' . $id . '/edit'],
        ];
        $this->data = $this->model::findOrFail($id);
        // dd($this->data);
        return Inertia::render('Sitemap/Edit', ['sitemap' => $this->data, 'crumbs' => $this->crumbs]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SitemapRequest $request, $id)
    {
        $this->data = $request->validated();
        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::orderBy('id', 'desc')->get();
            $trashs = $this->model::orderBy('id', 'desc')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'trashs' => $trashs, 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->instance = $this->model::findOrFail($id)->delete();
        if ($this->instance) {
            $this->data = $this->model::orderBy('id', 'desc')->get();
            $trashs = $this->model::orderBy('id', 'desc')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Xóa thành công!', 'trashs' => $trashs, 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Xóa thất bại!'], 400);
    }

    public function restore($id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);
        $this->instance->restore();
        if ($this->instance) {
            $this->data = $this->model::orderBy('id', 'desc')->get();
            $trashs = $this->model::orderBy('id', 'desc')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Khôi phục thành công!', 'trashs' => $trashs, 'data' => $this->data], 200);
        }
    }

    public function permanent($id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);
        $this->instance->forceDelete();
        if ($this->instance) {
            $this->data = $this->model::orderBy('id', 'desc')->get();
            $trashs = $this->model::orderBy('id', 'desc')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Xóa vĩnh viễn thành công!', 'trashs' => $trashs, 'data' => $this->data], 200);
        }
    }

    public function apiIndex()
    {
        $this->data = $this->model::orderBy('created_at', 'desc')->active()->get();
        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiShow($id)
    {
        $this->data = $this->model::findOrFail($id);
        return response()->json(['check' => true, 'data' => $this->data], 200);
    }
}