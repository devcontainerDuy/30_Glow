<?php

namespace App\Http\Controllers\Comments;

use App\Http\Controllers\Controller;
use App\Http\Requests\Comments\CommentsRequest;
use App\Models\Comments;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentsController extends Controller
{
    public function __construct()
    {
        $this->model = Comments::class;
    }
    public function index()
    {
        $this->crumbs = [
            ['name' => 'comments', 'url' => '/admin/comments'],
        ];
        $this->data = $this->model::with('parent', 'product:id,slug', 'service', 'customer:id,uid,name', 'user:id,uid,name')->get();
        $trashs = $this->model::with('parent', 'product:id,slug', 'service', 'customer:id,uid,name', 'user:id,uid,name')->onlyTrashed()->get();
        return Inertia::render('Comments/Index', ['comment' => $this->data, 'trashs' => $trashs, 'crumbs' => $this->crumbs]);
    }
    public function update(Request $request, $id)
    {
        $this->data = $request->validate([
            'status' => ['nullable', 'boolean'],
        ]);
        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::with('parent')->get();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }
    public function destroy($id)
    {
        $this->instance = $this->model::findOrFail($id)->load('parent', 'product:id,slug', 'service', 'customer:id,uid,name', 'user:id,uid,name');
        $this->instance->update(['status' => 0]);

        if ($this->instance->delete()) {
            $this->data = $this->model::with('parent', 'product:id,slug', 'service', 'customer:id,uid,name', 'user:id,uid,name')->get();
            $trashs = $this->model::with('parent', 'product:id,slug', 'service', 'customer:id,uid,name', 'user:id,uid,name')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Xoá thành công!', 'data' => $this->data, 'trashs' => $trashs,], 200);
        }

        return response()->json(['check' => false, 'message' => 'Có lỗi xảy ra khi xóa!'], 500);
    }
    public function restore($id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);
        $this->instance->restore();
        if ($this->instance) {
            $this->data = $this->model::with('parent', 'product:id,slug', 'service', 'customer:id,uid,name', 'user:id,uid,name')->get();
            $trashs = $this->model::with('parent', 'product:id,slug', 'service', 'customer:id,uid,name', 'user:id,uid,name')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Khôi phục thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }
    }
    public function permanent(string $id)
    {
        $this->instance = $this->model::withTrashed()->findOrFail($id);
        $this->instance->forceDelete();
        if ($this->instance) {
            $this->data = $this->model::with('parent', 'product:id,slug', 'service', 'customer:id,uid,name', 'user:id,uid,name')->get();
            $trashs = $this->model::with('parent', 'product:id,slug', 'service', 'customer:id,uid,name', 'user:id,uid,name')->onlyTrashed()->get();
            return response()->json(['check' => true, 'message' => 'Đã xóa vĩnh viễn thành công!', 'data' => $this->data, 'trashs' => $trashs], 200);
        }
    }
    public function addComment(CommentsRequest $request)
    {
        $this->data = $request->validated();
        if ($request->id_parent) {
            $parentComment = $this->model::find($request->id_parent);
            $id_parent =  $parentComment['id_parent'];
            if ($parentComment) {
                $level = 0;
                while ($parentComment->id_parent) {
                    $parentComment = $this->model::find($parentComment->id_parent);
                    $level++;
                }
                if ($level >= 2) {
                    $this->data['id_parent'] = $id_parent;
                }
            }
        }
        $this->instance = $this->model::create($this->data);
        if ($this->instance) {
            return response()->json(['check' => true, 'message' => 'Bình luận được tạo thành công!'], 201);
        }

        return response()->json(['check' => false, 'message' => 'Tạo bình luận thất bại!'], 400);
    }

    public function getCommentsByProduct($id)
    {
        $allComments = $this->model::where('id_product', $id)
            ->with(['parent', 'product', 'customer', 'user'])
            ->get();

        if ($allComments->isEmpty()) {
            return response()->json([
                'check' => false,
                'message' => 'Sản phẩm chưa có bình luận nào!',
            ], 404);
        }

        $this->data = $allComments->whereNull('id_parent')->map(function ($parent) use ($allComments) {
            $childrenLevel1 = $allComments->where('id_parent', $parent->id)->map(function ($child) use ($allComments) {
                $childrenLevel2 = $allComments->where('id_parent', $child->id)->map(function ($childLevel2) {
                    return [
                        'id' => $childLevel2->id,
                        'comment' => $childLevel2->comment,
                        'created_at' => $childLevel2->created_at,
                        'id_parent' => $childLevel2->id_parent,
                        'name' => $childLevel2->customer ? $childLevel2->customer->name : $childLevel2->user->name,
                        'uid' => $childLevel2->user ? $childLevel2->user->uid : ($childLevel2->customer ? $childLevel2->customer->uid : null),
                    ];
                })->values();

                return [
                    'id' => $child->id,
                    'comment' => $child->comment,
                    'created_at' => $child->created_at,
                    'id_parent' => $child->id_parent,
                    'name' => $child->customer ? $child->customer->name : $child->user->name,
                    'uid' => $child->user ? $child->user->uid : ($child->customer ? $child->customer->uid : null),
                    'children' => $childrenLevel2,
                ];
            })->values();

            return [
                'id' => $parent->id,
                'comment' => $parent->comment,
                'created_at' => $parent->created_at,
                'name' => $parent->customer ? $parent->customer->name : null,
                'uid' => $parent->user ? $parent->user->name : ($parent->customer ? $parent->customer->uid : null),
                'product' => $parent->product ? $parent->product->name : null,
                'children' => $childrenLevel1,
            ];
        })->values();

        return response()->json(['check' => true, 'message' => 'Danh sách bình luận theo sản phẩm!', 'data' => $this->data,], 200);
    }

    public function getCommentsByService($id)
    {
        $allComments = $this->model::where('id_service', $id)
            ->with(['parent', 'product', 'customer', 'user'])
            ->get();

        if ($allComments->isEmpty()) {
            return response()->json([
                'check' => false,
                'message' => 'Dịch vụ chưa có bình luận nào!',
            ], 404);
        }

        $this->data = $allComments->whereNull('id_parent')->map(function ($parent) use ($allComments) {
            $childrenLevel1 = $allComments->where('id_parent', $parent->id)->map(function ($child) use ($allComments) {
                $childrenLevel2 = $allComments->where('id_parent', $child->id)->map(function ($childLevel2) {
                    return [
                        'id' => $childLevel2->id,
                        'comment' => $childLevel2->comment,
                        'created_at' => $childLevel2->created_at,
                        'id_parent' => $childLevel2->id_parent,
                        'name' => $childLevel2->customer ? $childLevel2->customer->name : $childLevel2->user->name,
                        'uid' => $childLevel2->user ? $childLevel2->user->uid : ($childLevel2->customer ? $childLevel2->customer->uid : null),
                    ];
                })->values();

                return [
                    'id' => $child->id,
                    'comment' => $child->comment,
                    'created_at' => $child->created_at,
                    'id_parent' => $child->id_parent,
                    'name' => $child->customer ? $child->customer->name : $child->user->name,
                    'uid' => $child->user ? $child->user->uid : ($child->customer ? $child->customer->uid : null),
                    'children' => $childrenLevel2,
                ];
            })->values();

            return [
                'id' => $parent->id,
                'comment' => $parent->comment,
                'created_at' => $parent->created_at,
                'name' => $parent->customer ? $parent->customer->name : null,
                'uid' => $parent->user ? $parent->user->name : ($parent->customer ? $parent->customer->uid : null),
                'product' => $parent->product ? $parent->product->name : null,
                'children' => $childrenLevel1,
            ];
        })->values();

        return response()->json(['check' => true, 'message' => 'Danh sách bình luận theo dịch vụ!', 'data' => $this->data,], 200);
    }
}
