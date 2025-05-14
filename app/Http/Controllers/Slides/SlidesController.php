<?php

namespace App\Http\Controllers\Slides;

use App\Http\Controllers\Controller;
use App\Http\Requests\Slides\SlidesRequest;
use App\Models\Slides;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class SlidesController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct()
    {
        $this->model = Slides::class;
    }
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Danh sách Slides', 'url' => '/admin/slides'],
        ];
        $this->data = $this->model::orderBy('created_at', 'desc')->get();
        $trashs = $this->model::onlyTrashed()->get();
        return Inertia::render('Slides/Index', ['slides' => $this->data, 'trashs' => $trashs, 'crumbs' => $this->crumbs]);
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
    public function store(SlidesRequest $request)
    {
        $this->data = $request->validated();
        $this->data['slug'] = Str::slug($this->data['name']);

        $desktopImages = $request->file('desktop');
        // Lưu từng cặp slide
        for ($i = 0; $i < count($desktopImages); $i++) {
            $this->saveSlide($this->data, $desktopImages[$i]);
        }

        if ($this->instance) {
            $this->data = Slides::all();
            return response()->json(['check' => true, 'message' => 'Slides đã được thêm thành công!', 'data' => $this->data], 201);
        }
        return response()->json(['check' => false, 'message' => 'Thêm vai trò thất bại!'], 400);
    }

    private function saveSlide($data, $desktopImage)
    {
        $desktopFilename = time() . '_' . $desktopImage->getClientOriginalName();

        Storage::putFileAs('/public/slides', $desktopImage, $desktopFilename);

        $this->instance = $this->model::create(['name' => $data['name'], 'slug' => $data['slug'], 'status' => $data['status'], 'desktop' => $desktopFilename]);
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
    public function update(SlidesRequest $request, string $id)
    {
        $this->data = $request->validated();
        if (isset($this->data['name'])) $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::orderBy('created_at', 'desc')->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
        }

        // Nếu cập nhật thất bại
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);
        $this->instance->delete();

        if ($this->instance) {
            $this->data = $this->model::orderBy('created_at', 'desc')->get();
            $trashs = $this->model::onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Xóa thành công!', 'trashs' => $trashs, 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Xóa thất bại!'], 400);
    }

    public function restore($id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);
        $this->instance->restore();

        if ($this->instance) {
            $this->data = $this->model::orderBy('created_at', 'desc')->get();
            $trashs = $this->model::onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Khôi phục thành công!', 'trashs' => $trashs, 'data' => $this->data], 200);
        }

        return response()->json(['check' => false, 'message' => 'Khôi phục thất bại!'], 400);
    }

    public function permanent($id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);

        if ($this->instance) {
            // Xóa file liên quan nếu tồn tại
            $desktopPath = '/public/slides/' . $this->instance->desktop;

            if (Storage::exists($desktopPath)) {
                Storage::delete($desktopPath);
            }

            $this->instance->forceDelete();

            $this->data = $this->model::orderBy('created_at', 'desc')->get();
            $trashs = $this->model::onlyTrashed()->get();

            return response()->json(['check' => true, 'message' => 'Xóa vĩnh viễn thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }

        return response()->json(['check' => false, 'message' => 'Dữ liệu không tồn tại!'], 404);
    }

    /**
     * API Client
     */
    public function apiIndex()
    {
        $this->data = $this->model::active()->select('id', 'name', 'slug', 'status', 'url', 'desktop')->get();
        $this->data->transform(function ($item) {
            $item->desktop = asset('storage/slides/' . $item->desktop);
            return $item;
        });
        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    public function apiShow($slug)
    {
        $this->data = $this->model::active()->select('id', 'name', 'slug', 'status', 'url', 'desktop')->where('slug', $slug)->firstOrFail();

        $this->data->desktop = asset('/storage/slides/' . $this->data->desktop);

        if (!$this->data) {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy slide'], 404);
        }
        return response()->json(['check' => true, 'data' => $this->data], 200);
    }
}