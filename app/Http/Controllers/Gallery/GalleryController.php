<?php

namespace App\Http\Controllers\Gallery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Gallery\GalleryRequest;
use App\Models\Gallery;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function __construct()
    {
        $this->model = Gallery::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Bộ sưu tập', 'url' => '/admin/galleries'],
        ];
        $this->instance = Products::all();
        $this->data = $this->model::with('parent')->get();
        // dd($this->data, $this->instance);
        return Inertia::render('Gallery/Index', ['galleries' => $this->data, 'products' => $this->instance, 'crumbs' => $this->crumbs]);
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
    public function store(GalleryRequest $request)
    {
        $this->data = $request->validated();
        $files = $request->file('images');

        // Kiểm tra dữ liệu hình ảnh
        if (!is_array($files) || empty($files)) {
            return response()->json(['check' => false, 'message' => 'Dữ liệu hình ảnh không hợp lệ.'], 400);
        }
        $hasMainImage = $this->model::findParent($this->data['id_parent'])->active()->exists();
        $this->instance = $this->storeImages($files);

        // Tạo bản ghi trong cơ sở dữ liệu cho mỗi file đã lưu
        $isFirstImage = true; // Biến để xác định ảnh đầu tiên
        foreach ($this->instance as $filename) {
            $this->createGalleryRecord($filename, $hasMainImage, $isFirstImage);
            $isFirstImage = false;
        }

        $this->data = $this->model::all();
        return response()->json(['check' => true, 'message' => 'Thêm thành công!', 'data' => $this->data,], 201);
    }

    /**
     * Lưu hình ảnh và trả về mảng tên file đã lưu
     */
    private function storeImages($files)
    {
        $this->data = [];

        foreach ($files as $item) {
            $this->instance = time() . '_' . $item->getClientOriginalName();
            if (Storage::putFileAs('public/gallery', $item, $this->instance)) {
                $this->data[] = $this->instance;
            } else {
                throw new \Exception('Đã xảy ra lỗi khi lưu file ảnh: ' . $item->getClientOriginalName());
            }
        }

        return $this->data;
    }

    /**
     * Tạo bản ghi trong cơ sở dữ liệu cho hình ảnh
     */
    private function createGalleryRecord($filename, $hasMainImage, $isFirstImage)
    {
        $this->data['image'] = $filename;
        ($hasMainImage || !$isFirstImage) ? $this->data['status'] = 0 : $this->data['status'] = 1;
        $this->model::create($this->data);
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
    public function update(GalleryRequest $request, string $id)
    {
        $this->data = $request->validated();
        $this->instance = $this->model::findOrFail($id);

        if (is_null($this->instance->id_parent)) {
            return $this->updateInstance();
        }

        if (!$this->isMain($id)) {
            return response()->json(['check' => false, 'message' => 'Không thể bỏ trạng thái ảnh chính khi sản phẩm chỉ có 1 ảnh chính'], 400);
        }

        return $this->updateInstance();
    }

    private function isMain($id)
    {
        if (isset($this->data['status']) && $this->data['status'] == 1) {
            $current = $this->model::findParent($this->instance->id_parent)->active()->where('id', '!=', $id)->first();

            if ($current) {
                $current->update(['status' => 0]);
            }
        } else {
            if ($this->instance->status == 1) {
                return false;
            }
        }
        return true;
    }

    private function updateInstance()
    {
        $this->instance = $this->instance->update($this->data);

        if ($this->instance) {
            $this->data = $this->model::all();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
        }

        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->instance = $this->model::findOrFail($id);
        $filePath = 'public/gallery/' . $this->instance->image;

        // Xóa file khỏi thư mục nếu tồn tại
        if (Storage::exists($filePath)) {
            Storage::delete($filePath);
        }
        $this->instance->delete();
        $this->data = $this->model::all();
        return response()->json(['check' => true, 'message' => 'Xoá thành công!', 'data' => $this->data], 200);
    }
}
