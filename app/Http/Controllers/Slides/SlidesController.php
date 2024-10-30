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
        $this->data = $this->model::all();

        // Trả về view với dữ liệu
        return Inertia::render('Slides/Index', [
            'slides' => $this->data, // Dữ liệu slides
            'crumbs' => $this->crumbs // Dữ liệu crumbs
        ]);
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
        $mobileImages = $request->file('mobile');
        if (count($desktopImages) !== count($mobileImages)) {
            return response()->json(['check' => false, 'message' => 'Hãy thêm số lượng ảnh bằng nhau!'], 400);
        }
        // Lưu từng cặp slide
        for ($i = 0; $i < count($desktopImages); $i++) {
            $this->saveSlide($this->data, $desktopImages[$i], $mobileImages[$i]);
        }

        if ($this->instance) {
            $this->data = Slides::all();
            return response()->json(['check' => true, 'message' => 'Slides đã được thêm thành công!', 'data' => $this->data], 201);
        }
        return response()->json(['check' => false, 'message' => 'Thêm vai trò thất bại!'], 400);
    }

    private function saveSlide($data, $desktopImage, $mobileImage)
    {
        $desktopFilename = time() . '_' . $desktopImage->getClientOriginalName();
        $mobileFilename = time() . '_' . $mobileImage->getClientOriginalName();

        Storage::putFileAs('public/slides/desktop', $desktopImage, $desktopFilename);
        Storage::putFileAs('public/slides/mobile', $mobileImage, $mobileFilename);

        $this->instance = $this->model::create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'status' => $data['status'],
            'desktop' => $desktopFilename,
            'mobile' => $mobileFilename,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
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
            $this->data = $this->model::all();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
        }

        // Nếu cập nhật thất bại
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->instance = $this->model::findOrFail($id);
        if (!$this->instance) {
            return response()->json(['check' => false, 'message' => 'Slide không tồn tại.'], 404);
        }

        // Xóa các file ảnh liên quan nếu chúng tồn tại
        $desktopPath = 'public/slides/desktop/' . $this->instance->desktop;
        $mobilePath = 'public/slides/mobile/' . $this->instance->mobile;
        if (Storage::exists($desktopPath)) {
            Storage::delete($desktopPath);
        }
        if (Storage::exists($mobilePath)) {
            Storage::delete($mobilePath);
        }
        $this->instance->delete();

        $this->data = $this->model::all();
        return response()->json(['check' => true, 'message' => 'Slide đã được xóa thành công!', 'data' => $this->data], 200);
    }

    /**
     * API Client
     */
    public function apiIndex()
    {
        $this->data = $this->model::active()->select('id', 'name', 'slug', 'status', 'url', 'desktop', 'mobile')->get();
        $this->data->transform(function ($item) {
            $item->desktop = asset('storage/slides/desktop/' . $item->desktop);
            $item->mobile = asset('storage/slides/mobile/' . $item->mobile);
            return $item;
        });
        return response()->json($this->data);
    }

    public function apiShow($slug)
    {
        $this->data = $this->model::active()->select('id', 'name', 'slug', 'status', 'url', 'desktop', 'mobile')->where('slug', $slug)->firstOrFail();

        $this->data->desktop = asset('storage/slides/desktop/' . $this->data->desktop);
        $this->data->mobile = asset('storage/slides/mobile/' . $this->data->mobile);

        if (!$this->data) {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy slide'], 404);
        }
        return response()->json($this->data);
    }
}
