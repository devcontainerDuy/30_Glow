<?php

namespace App\Http\Controllers\BillServices;

use App\Http\Controllers\Controller;
use App\Http\Requests\BillServiceRequest\BillServiceRequest;
use App\Models\BookingHasService;
use App\Models\Bookings;
use App\Models\Customers;
use App\Models\ServiceBills;
use App\Models\ServiceBillsDetails;
use App\Traits\GeneratesUniqueId;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        //
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
    public function store(BillServiceRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $this->data = $request->validated();

            $booking = Bookings::findOrFail($id);
            if ($booking->status != 3) {
                return response()->json(['check' => false, 'message' => 'Không thể thanh toán! Trạng thái không hợp lệ.'], 400);
            }

            $idCustomer = Customers::where("uid", $this->data['customer_id'])->first();
            $existingBill = $this->model::where('id_booking', $id)->first();
            if ($existingBill) {
                return response()->json([
                    'check' => false,
                    'message' => 'Hóa đơn cho booking này đã tồn tại!'
                ], 400);
            }

            $this->instance = $this->model::insertGetId([
                'uid' => $this->createCodeOrderService(),
                'id_customer' => $idCustomer->id,
                'id_booking' => $id,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $services_cart = BookingHasService::where('id_booking', $id)->get();
            foreach ($services_cart as $item) {
                ServiceBillsDetails::create([
                    'id_service_bill' => $this->instance,
                    'id_service' => $item->id_service,
                ]);
            }

            $booking->update(['status' => 4]);

            DB::commit();
            return response()->json(['check' => true, 'message' => 'Thanh toán booking thành công!'], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Error: " . $e->getMessage());
            return response()->json(['check' => false, 'message' => 'Thanh toán booking thất bại!'], 401);
        }
    }


    /**
     * Display the specified resource.
     */
    public function apiIndex()
    {
        $this->data = $this->model::with('customer', 'booking', 'serviceBillDetails.service')->get();

        $this->instance = $this->data->map(function ($bill) {
            return [
                'id' => $bill->id,
                'uid' => $bill->uid,
                'customer' => $bill->customer ? [
                    'uid' => $bill->customer->uid,
                    'name' => $bill->customer->name,
                    'email' => $bill->customer->email,
                    'phone' => $bill->customer->phone,
                    'address' => $bill->customer->address,
                ] : null,
                'booking' => $bill->booking ? [
                    'id' => $bill->booking->id,
                    'time' => $bill->booking->time,
                    'note' => $bill->booking->note,
                    'status' => $bill->booking->status,
                ] : null,
                'status' => $bill->status,
                'service_details' => $bill->serviceBillDetails->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'service' => $detail->service ? [
                            'name' => $detail->service->name,
                            'price' => $detail->service->price,
                            'summary' => $detail->service->summary,
                            'image' => asset('storage/services/' . $detail->service->image),
                        ] : null,
                    ];
                })->toArray(),
            ];
        });

        return response()->json([
            'check' => true,
            'data' => $this->instance,
        ], 200);
    }
    public function apiShow($id)
    {
        $this->data = $this->model::with('customer', 'booking', 'serviceBillDetails.service')->findOrFail($id);

        $this->instance =  [
                'id' => $this->data->id,
                'uid' => $this->data->uid,
                'customer' => $this->data->customer ? [
                    'uid' => $this->data->customer->uid,
                    'name' => $this->data->customer->name,
                    'email' => $this->data->customer->email,
                    'phone' => $this->data->customer->phone,
                    'address' => $this->data->customer->address,
                ] : null,
                'booking' => $this->data->booking ? [
                    'id' => $this->data->booking->id,
                    'time' => $this->data->booking->time,
                    'note' => $this->data->booking->note,
                    'status' => $this->data->booking->status,
                ] : null,
                'status' => $this->data->status,
                'service_details' => $this->data->serviceBillDetails->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'service' => $detail->service ? [
                            'name' => $detail->service->name,
                            'price' => $detail->service->price,
                            'summary' => $detail->service->summary,
                            'image' => asset('storage/services/' . $detail->service->image),
                        ] : null,
                    ];
                })->toArray(),
            ];

        return response()->json([
            'check' => true,
            'data' => $this->instance,
        ], 200);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
