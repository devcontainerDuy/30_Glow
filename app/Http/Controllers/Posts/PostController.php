<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Http\Requests\Posts\PostRequest;
use App\Models\PostCollections;
use App\Models\Posts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function __construct()
    {
        $this->model = Posts::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Bài viết', 'url' => '/admin/posts'],
            ['name' => 'Danh sách bài viết', 'url' => '/admin/posts'],
        ];
        $this->data = $this->model::with('collection')->orderBy('id', 'desc')->get();
        $trashs = $this->model::onlyTrashed()->orderBy('id', 'desc')->get();
        $this->instance = PostCollections::active()->select('id', 'name')->get();
        return Inertia::render('Posts/Index', ['posts' => $this->data, 'trashs' => $trashs, 'collections' => $this->instance, 'crumbs' => $this->crumbs]);
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
    public function store(PostRequest $request)
    {
        $this->data = $request->validated();
        $this->data['slug'] = Str::slug($this->data['title']);
        $file = $request->file('image');
        $imageName = $file->getClientOriginalName();
        $extractTo = storage_path('app/public/posts/');
        $file->move($extractTo, $imageName);

        $this->data['image'] = $imageName;
        $this->instance = $this->model::create($this->data);
        if ($this->instance) {
            $this->data = $this->model::with('collection')->orderBy('id', 'desc')->get();
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
            ['name' => 'Bài viết', 'url' => '/admin/posts'],
            ['name' => 'Danh sách bài viết', 'url' => '/admin/posts'],
            ['name' => 'Chi tiết bài viết', 'url' => '/admin/posts/' . $id . '/edit'],
        ];
        $this->data = $this->model::findOrFail($id);
        $this->instance = PostCollections::active()->select('id', 'name')->get();
        return Inertia::render('Posts/Edit', ['service' => $this->data, 'collections' => $this->instance, 'crumbs' => $this->crumbs]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PostRequest $request, string $id)
    {
        $this->data = $request->validated();
        if (isset($this->data['name'])) $this->data['slug'] = Str::slug($this->data['title']);

        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::with('collection')->orderBy('id', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }

    public function updateFiles(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'image' => ['required', 'image', 'max:2048'],
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'message' => $validator->errors()->first()], 400);
        }

        $file = $request->file('image');
        $imageName = $file->getClientOriginalName();
        $extractTo = storage_path('app/public/posts/');
        $file->move($extractTo, $imageName);

        $this->instance = $this->model::findOrFail($id)->update(['image' => $imageName]);
        if ($this->instance) {
            $this->data = $this->model::with('collection')->orderBy('id', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật ảnh thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật ảnh thất bại!'], 400);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::beginTransaction();
        try {
            $this->instance = $this->model::findOrFail($id);
            $this->instance->update(['status' => 0, 'highlighted' => 0]);
            $this->instance->delete();

            $this->data = $this->model::with('collection')->orderBy('id', 'desc')->get();
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
            $this->data = $this->model::with('collection')->orderBy('id', 'desc')->get();
            $trashs = $this->model::onlyTrashed()->orderBy('id', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Khôi phức thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }
    }

    public function permanent($id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);

        $imagePath = "public/posts/{$this->instance->image}";

        if (Storage::exists($imagePath)) {
            Storage::delete($imagePath);
        }

        if ($this->instance->forceDelete()) {
            $this->data = $this->model::with('collection')->orderBy('id', 'desc')->get();
            $trashs = $this->model::onlyTrashed()->orderBy('id', 'desc')->get();

            return response()->json(['check' => true, 'message' => 'Xoá vĩnh viễn thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }

        return response()->json(['check' => false, 'message' => 'Xoá vĩnh viễn thất bại!'], 400);
    }

    public function apiHighlighted()
    {
        $this->data = $this->model::with('collection')->active()->highlighted()->orderBy('id', 'desc')->take(10)->get();

        $this->data->transform(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'summary' => $item->summary,
                'image' => asset('storage/posts/' . $item->image),
                'collection' => $item->collection ? [
                    'name' => $item->collection->name,
                    'slug' => $item->collection->slug,
                ] : null,
                // 'content' => $item->content,
                'status' => $item->status,
                'highlighted' => $item->highlighted,
                'created_at' => $item->created_at->format('H:i d-m-Y'),
            ];
        });

        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiIndex()
    {
        $this->data = $this->model::with('collection')->active()->orderBy('id', 'desc')->paginate(20);

        $this->data->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'summary' => $item->summary,
                'image' => asset('storage/posts/' . $item->image),
                'collection' => $item->collection ? [
                    'name' => $item->collection->name,
                    'slug' => $item->collection->slug,
                ] : null,
                // 'content' => $item->content,
                'status' => $item->status,
                'highlighted' => $item->highlighted,
                'created_at' => $item->created_at->format('H:i d-m-Y'),
            ];
        });

        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiShow($id)
    {
        $this->data = $this->model::with('collection', 'relatedPosts')->where('slug', $id)->active()->first();

        if (!$this->data) {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy bài viết'], 404);
        }

        $this->instance = [
            'id' => $this->data->id,
            'title' => $this->data->title,
            'slug' => $this->data->slug,
            'summary' => $this->data->summary,
            'image' => asset('storage/posts/' . $this->data->image),
            'collection' => $this->data->collection ? [
                'name' => $this->data->collection->name,
                'slug' => $this->data->collection->slug,
            ] : null,
            'content' => $this->data->content,
            'status' => $this->data->status,
            'highlighted' => $this->data->highlighted,
            'created_at' => $this->data->created_at->format('H:i d-m-Y'),
            'related' => $this->data->relatedPosts ? $this->data->relatedPosts->take(4)->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'summary' => $item->summary,
                    'image' => asset('storage/posts/' . $item->image),
                    'collection' => $item->collection ? [
                        'name' => $item->collection->name,
                        'slug' => $item->collection->slug,
                    ] : null,
                    'status' => $item->status,
                    'highlighted' => $item->highlighted,
                    'created_at' => $item->created_at->format('H:i d-m-Y'),
                ];
            }) : null
        ];

        return response()->json(['check' => true, 'data' => $this->instance], 200);
    }
}