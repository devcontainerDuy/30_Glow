<?php

namespace App\Http\Controllers\BillServices;

use App\Http\Controllers\Controller;
use App\Http\Requests\BillServiceRequest\BillServiceRequest;
use App\Models\Bookings;
use App\Models\ServiceBills;
use App\Models\ServiceBillsDetails;
use App\Traits\GeneratesUniqueId;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BillServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use GeneratesUniqueId;
    public function __construct()
    {
        $this->model = ServiceBills::class;
    }
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Dịch vụ', 'url' => '/admin/services'],
            ['name' => 'Danh sách hóa đơn', 'url' => '/admin/bills/services']
        ];
        $this->data = $this->model::with('customer', 'booking', 'serviceBillDetails.service')->orderBy('created_at', 'desc')->get();
        return Inertia::render('BillsServices/Index', ['bills' => $this->data, 'crumbs' => $this->crumbs]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->data = $this->model::with('serviceBillDetails.service', 'booking.user', 'customer')->get();

        $this->instance = $this->data->map(function ($bill) {
            return [
                'uid' => $bill->uid,
                'user' => $bill->booking->user ? [
                    'name' => $bill->booking->user->name,
                    'phone' => $bill->booking->user->phone,
                ] : null,
                'customer' => $bill->customer ? [
                    'name' => $bill->customer->name,
                    'phone' => $bill->customer->phone,
                ] : null,
                'service' => $bill->serviceBillDetails->map(function ($item) {
                    return [
                        'name' => $item->service->name,
                        'slug' => $item->service->slug,
                        'unit_price' => $item->unit_price,
                    ];
                })->toArray(),
                'total' => $bill->total,
                'status' => $bill->status,
            ];
        });

        return response()->json(['check' => true, 'data' => $this->instance], 200);
    }

    /**
     * Store a newly created resource in storage.
     * status: 0 - Chưa thanh toán, 1 - Đã thanh toán, 2 - Thanh toán thất bại
     * booking status: 0 - Đang chờ xếp nhân viên, 1 - Đã xếp nhân viên, 2 - Đang thực hiện, 3 - Thành công, 4 - Đã thanh toán, 5 - Thất bại
     */
    public function store(BillServiceRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->data = $request->validated();

            $booking = Bookings::findOrFail($this->data['booking_id'])->load('user', 'customer', 'service', 'service.collection');

            switch ($booking->status) {
                case $booking->status < 3:
                    DB::rollBack();
                    return response()->json(['check' => false, 'message' => 'Không thể thanh toán! Dịch vụ chưa hoàn thành.'], 400);
                case $booking->status > 3:
                    DB::rollBack();
                    return response()->json(['check' => false, 'message' => 'Không thể thanh toán! Dịch vụ đã thanh toán.'], 400);
                case 5:
                    DB::rollBack();
                    return response()->json(['check' => false, 'message' => 'Không thể thanh toán! Dịch vụ đã bị hủy.'], 400);
            }

            if ($this->model::where('id_booking', $this->data['booking_id'])->exists()) {
                return response()->json(['check' => false, 'message' => 'Hóa đơn cho booking này đã tồn tại!'], 400);
            }

            $this->data['total'] = $booking->service->reduce(function ($carry, $item) {
                $price = $item->price ?? $item->compare_price;
                return $carry + $price;
            }, 0);

            $this->instance = $this->model::insertGetId(['uid' => $this->createCodeOrderService(), 'id_customer' => $booking->customer->id, 'id_booking' => $this->data['booking_id'], 'total' => $this->data['total'], 'status' => 0, 'created_at' => now(), 'updated_at' => now()]);

            if ($this->instance) {
                foreach ($booking->service as $item) {
                    ServiceBillsDetails::create(['id_service_bill' => $this->instance, 'id_service' => $item->id, 'unit_price' => $item->price ?? $item->compare_price]);
                }
            }

            DB::commit();
            return response()->json(['check' => true, 'message' => 'Tạo hóa đơn thành công!'], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Error: " . $e->getMessage());
            return response()->json(['check' => false, 'message' => 'Tạo hóa đơn thất bại!'], 401);
        }
    }

    /**
     * Display the specified resource.
     * status: 0 - Chưa thanh toán, 1 - Đã thanh toán, 2 - Thanh toán thất bại
     * @param  string  $id : uid of bill
     */
    public function show(string $id)
    {
        $this->data = $this->model::with('serviceBillDetails.service', 'booking.user', 'customer')->where('uid', $id)->first();
        $this->instance = [
            'uid' => $this->data->uid,
            'user' => $this->data->user ? [
                'uid' => $this->data->user->uid,
                'name' => $this->data->user->name,
                'email' => $this->data->user->email,
                'phone' => $this->data->user->phone,
                'address' => $this->data->user->address,
            ] : null,
            'customer' => $this->data->customer ? [
                'uid' => $this->data->customer->uid,
                'name' => $this->data->customer->name,
                'email' => $this->data->customer->email,
                'phone' => $this->data->customer->phone,
                'address' => $this->data->customer->address,
            ] : null,
            'time' => $this->data->booking->time,
            'service' => $this->data->serviceBillDetails ? $this->data->serviceBillDetails->map(function ($item) {
                return [
                    'name' => $item->service->name,
                    'slug' => $item->service->slug,
                    'unit_price' => $item->unit_price,
                ];
            })->toArray() : null,
            'total' => $this->data->total,
            'status' => $this->data->status,
            'created_at' => $this->data->created_at,
        ];

        return response()->json(['check' => true, 'data' => $this->instance], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $this->crumbs = [
            ['name' => 'Dịch vụ', 'url' => '/admin/services '],
            ['name' => 'Danh sách hóa đơn', 'url' => '/admin/bills-services'],
            ['name' => 'Chi tiết hóa đơn', 'url' => '/admin/bills-services/' . $id . '/edit']
        ];
        $this->data = $this->model::with('customer', 'booking', 'serviceBillDetails.service')->where('uid', $id)->orderBy('created_at', 'desc')->firstOrFail();
        // dd($this->data);
        return Inertia::render('BillsServices/Edit', ['bill' => $this->data, 'crumbs' => $this->crumbs]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BillServiceRequest $request, string $id)
    {
        DB::beginTransaction();
        try {
            $this->data = $request->validated();
            $this->instance  = $this->model::with('serviceBillDetails.service', 'booking.user', 'customer')->where('uid', $id)->first();

            if (!$this->instance) {
                return response()->json(['check' => false, 'message' => 'Hóa đơn không tồn tại!'], 400);
            } elseif ($this->instance->status === 1 && $this->data['status'] !== 1) {
                return response()->json(['check' => false, 'message' => 'Hóa đơn đã thanh toán! Không thể thay đổi'], 400);
            } elseif ($this->instance->status === 1 && $this->data['status'] === 1) {
                return response()->json(['check' => false, 'message' => 'Hóa đơn đã thanh toán!'], 400);
            }

            $this->instance->update(['status' => $this->data['status']]);

            DB::commit();
            return response()->json(['check' => true, 'message' => 'Thanh toán hóa đơn thành công!'], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Error: " . $e->getMessage());
            return response()->json(['check' => false, 'message' => 'Thanh toán hóa đơn thất bại!'], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Get all bill services by customer
     */
    public function apiIndex()
    {
        if (!Auth::check()) {
            return response()->json(['check' => false, 'message' => 'Chưa đăng nhập!'], 401);
        }

        $this->data = $this->model::with(['booking'])->where('id_customer', Auth::user()->id)->get();

        if ($this->data->isEmpty()) {
            return response()->json(['check' => false, 'data' => [], 'message' => 'Chưa tạo hóa đơn'], 200);
        }

        $this->data->transform(function ($item) {
            return [
                'uid' => $item->uid,
                'time' => $item->booking->time,
                'total' => (float) $item->total,
                'status' => $item->status,
                'created_at' => $item->created_at,
            ];
        });

        return response()->json(['check' => true, 'data' => $this->data], 200);
    }

    /**
     * Get detail bill services by customer
     * @param  string  $id : uid of bill
     */
    public function apiShow(string $id)
    {
        $this->data = $this->model::with(['booking', 'serviceBillDetails.service'])->where('id_customer', Auth::user()->id)->where('uid', $id)->first();
        $this->instance = [
            'uid' => $this->data->uid,
            'time' => $this->data->booking->time,
            'service' => $this->data->serviceBillDetails ? $this->data->serviceBillDetails->map(function ($item) {
                return [
                    'name' => $item->service->name,
                    'slug' => $item->service->slug,
                    'unit_price' => $item->unit_price,
                ];
            })->toArray() : null,
            'total' => $this->data->total,
            'status' => $this->data->status,
            'created_at' => $this->data->created_at,
        ];
        return response()->json(['check' => true, 'data' => $this->instance], 200);
    }
}