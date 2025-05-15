<?php

namespace App\Http\Controllers\PostsCollections;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostsCollections\PostCollectionsRequest;
use App\Models\PostCollections;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PostCollectionsController extends Controller
{
    public function __construct()
    {
        $this->model = PostCollections::class;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('read', PostCollections::class);
        $this->crumbs = [
            ['name' => 'Bài Viết', 'url' => '/admin/posts'],
            ['name' => 'Chuyên Đề Bài Viết', 'url' => '/admin/posts/collections'],
        ];
        $this->data = $this->model::orderBy('id', 'desc')->get();
        $trashs = $this->model::onlyTrashed()->orderBy('id', 'desc')->get();
        return Inertia::render('PostsCollections/Index', ['collections' => $this->data, 'trashs' => $trashs, 'crumbs' => $this->crumbs]);
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
    public function store(PostCollectionsRequest $request)
    {
        $this->authorize('create', PostCollections::class);
        $this->data = $request->validated();
        $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::create($this->data);
        if ($this->instance) {
            $this->data = $this->model::orderBy('id', 'desc')->get();
            $trashs = $this->model::orderBy('id', 'desc')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Thêm thành công!', 'trashs' => $trashs, 'data' => $this->data], 201);
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
    public function update(PostCollectionsRequest $request, string $id)
    {
        $this->authorize('update', PostCollections::class);
        $this->data = $request->validated();
        if (isset($this->data['name'])) $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::orderBy('id', 'desc')->get();
            $trashs = $this->model::orderBy('id', 'desc')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'trashs' => $trashs, 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->authorize('delete', PostCollections::class);
        DB::beginTransaction();
        try {
            $this->instance = $this->model::findOrFail($id);
            $this->instance->update(['status' => 0]);
            $this->instance->delete();

            $this->data = $this->model::orderBy('id', 'desc')->get();
            $trashs = $this->model::onlyTrashed()->orderBy('id', 'desc')->get();

            DB::commit();
            return response()->json(['check' => true, 'message' => 'Xóa thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['check' => false, 'message' => 'Xóa thất bại!'], 400);
        }
    }

    public function restore($id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id)->restore();
        if ($this->instance) {
            $this->data = $this->model::orderBy('id', 'desc')->get();
            $trashs = $this->model::onlyTrashed()->orderBy('id', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Khôi phục thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }
    }

    public function permanent($id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);
        $this->instance->forceDelete();
        if ($this->instance) {
            $this->data = $this->model::orderBy('id', 'desc')->get();
            $trashs = $this->model::onlyTrashed()->orderBy('id', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Xóa vĩnh viễn thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }
    }

    public function apiIndex()
    {
        $this->data = $this->model::orderBy('id', 'desc')->select('name', 'slug')->active()->get();
        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiShow($id)
    {
        $this->data = $this->model::with('posts')->where('slug', $id)->active()->first();

        if (!$this->data) {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy'], 404);
        }

        $this->instance = [
            'name' => $this->data->name,
            'slug' => $this->data->slug,
            'posts' => $this->data->posts ? $this->data->posts->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'summary' => $item->summary,
                    'image' => asset('storage/posts/' . $item->image ?? '1747288084_Untitled.png'),
                    'collection' => $item->collection ? [
                        'name' => $item->collection->name,
                        'slug' => $item->collection->slug,
                    ] : null,
                    'status' => $item->status,
                    'highlighted' => $item->highlighted,
                    'created_at' => $item->created_at->format('H:i d-m-Y'),
                ];
            }) : null,
            'status' => $this->data->status
        ];
        return response()->json(['check' => true, 'data' => $this->instance], 200);
    }
}
