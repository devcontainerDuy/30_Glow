<?php

namespace App\Http\Controllers\Bookings;

use App\Events\Bookings\BookingEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Bookings\BookingRequest;
use App\Models\BookingHasService;
use App\Models\Bookings;
use App\Models\Customers;
use App\Models\ServiceBills;
use App\Models\ServiceBillsDetails;
use App\Models\User;
use App\Traits\GeneratesUniqueId;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BookingController extends Controller
{
    use GeneratesUniqueId;
    public function __construct()
    {
        $this->model = Bookings::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Dịch vụ', 'url' => '/admin/services'],
            ['name' => 'Danh sách dịch vụ đặt lịch', 'url' => '/admin/bookings'],
        ];
        $this->data = $this->model::with('user', 'customer', 'service')->recent()->orderBy('id', 'desc')->get();
        return Inertia::render('Bookings/Index', ['bookings' => $this->data, 'crumbs' => $this->crumbs]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user()->load('roles');

        $user->roles->pluck('name')[0] === "Staff" ? $this->data = $this->model::with('user', 'customer', 'service')->where('id_user', $user->id)->recent()->orderBy('id', 'desc')->get()
            : $this->data = $this->model::with('user', 'customer', 'service')->recent()->orderBy('id', 'desc')->get();

        $this->instance = $this->data->map(function ($item) {
            return [
                'id' => $item->id,
                'user' => $item->user ? [
                    'uid' => $item->user->uid,
                    'name' => $item->user->name,
                ] : null,
                'customer' => $item->customer ? [
                    'uid' => $item->customer->uid,
                    'name' => $item->customer->name,
                ] : null,
                'time' => $item->time,
                'service' => $item->service ? $item->service->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'name' => $service->name,
                    ];
                })->toArray() : null,
                'note' => $item->note,
                'status' => $item->status,
            ];
        });
        return response()->json(['check' => true, 'data' => $this->instance], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BookingRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->data = $request->validated();
            $this->instance = Customers::where('email', $this->data['email'])->where('phone', $this->data['phone'])->active()->first();

            if (!empty($this->data['id_user'])) {
                $idUser = User::where('uid', $this->data['id_user'])->first();
                $this->data['status'] = 2;
            }

            if ($this->instance) {
                $customerId = $this->instance->id;
            } else {
                $password = Str::random(10);
                $customerId = Customers::insertGetId(['uid' => $this->createCodeCustomer(), 'name' => $this->data['name'], 'email' => $this->data['email'], 'phone' => $this->data['phone'], 'password' => Hash::make($password),]);
            }

            $booking = $this->model::insertGetId(['id_user' => $idUser->id ?? null, 'id_customer' => $customerId, 'time' => $this->data['time'], 'status' => $this->data['status'] ?? 1, 'created_at' => now(), 'updated_at' => now(),]);

            if ($booking) {
                foreach ($this->data['service'] as $item) {
                    BookingHasService::create(['id_booking' => $booking, 'id_service' => $item,]);
                }
            }

            $newBooking = $this->model::with('user', 'customer', 'service')->findOrFail($booking);
            broadcast(new BookingEvent($newBooking))->toOthers();

            DB::commit();
            return response()->json(['check' => true, 'message' => 'Đặt lịch thành công!'], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Booking failed: " . $e->getMessage());
            return response()->json(['check' => false, 'message' => "Đặt lịch thất bại!"], 400);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $this->data = $this->model::with('user', 'customer', 'service', 'service.collection')->findOrFail($id);
        $this->instance = [
            'id' => $this->data->id,
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
            'time' => $this->data->time,
            'service' => $this->data->service ? $this->data->service->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'slug' => $service->slug,
                    'price' => $service->price,
                    'compare_price' => $service->compare_price,
                    'discount' => $service->discount,
                    'summary' => $service->summary,
                    'image' => asset('storage/services/' . $service->image),
                    'content' => $service->content,
                    'highlighted' => $service->highlighted,
                    "collection" => $service->collection ? [
                        'id' => $service->collection->id,
                        'name' => $service->collection->name,
                        'slug' => $service->collection->slug,
                        'highlighted' => $service->collection->highlighted,
                    ] : null,
                ];
            })->toArray() : null,
            'note' => $this->data->note,
            'status' => $this->data->status,
        ];
        return response()->json(['check' => true, 'data' => $this->instance], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $this->crumbs = [
            ['name' => 'Dịch vụ', 'url' => '/admin/services'],
            ['name' => 'Chi tiết lịch đặt', 'url' => '/admin/bookings' . $id . '/edit'],
        ];
        $this->data = $this->model::with('user', 'customer', 'service')->findOrFail($id);
        return Inertia::render('Bookings/Edit', ['bookings' => $this->data, 'crumbs' => $this->crumbs]);
    }

    /**
     * Update the specified resource in storage.
     * status: 0 - Đang chờ xếp nhân viên, 1 - Đã xếp nhân viên, 2 - Đang thực hiện, 3 - Thành công, 4 - Đã thanh toán, 5 - Thất bại
     */
    public function update(BookingRequest $request, string $id)
    {
        DB::beginTransaction();
        try {
            $this->data = $request->validated();

            if (!empty($this->data['id_user'])) {
                $this->data['id_user'] = User::where('uid', $this->data['id_user'])->first()->id;
                $this->data['status'] = 2;
            }

            $this->instance = $this->model::findOrFail($id);

            if ($this->instance->id_user === null && empty($this->data['id_user']) && $this->data['status'] >= 2) {
                return response()->json(['check' => false, 'message' => 'Vui lòng chọn nhân viên!'], 400);
            }

            if ($this->instance->note === null && empty($this->data['note']) && $this->data['status'] === 5) {
                return response()->json(['check' => false, 'message' => 'Vui lòng nhập ghi chú!'], 400);
            }

            $this->instance->update($this->data);

            broadcast(new BookingEvent($this->instance))->toOthers();
            DB::commit();
            return response()->json(['check' => true, 'message' => 'Cập nhật lịch thành công!'], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Booking update failed: " . $e->getMessage());
            return response()->json(['check' => false, 'message' => "Cập nhật lịch thất bại!"], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
