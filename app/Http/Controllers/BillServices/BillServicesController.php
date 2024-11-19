<?php

namespace App\Http\Controllers\BillServices;

use App\Http\Controllers\Controller;
use App\Models\ServiceBills;
use App\Traits\GeneratesUniqueId;
use Illuminate\Http\Request;

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
    public function store(Request $request)
    {
        //
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
