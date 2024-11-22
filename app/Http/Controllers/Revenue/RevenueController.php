<?php

namespace App\Http\Controllers\Revenue;

use App\Http\Controllers\Controller;
use App\Http\Requests\Revenue\RevenueRequest;
use App\Models\ServiceBills;
use App\Models\ServiceBillsDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RevenueController extends Controller
{
    public function __construct()
    {
        $this->model = ServiceBillsDetails::class;
    }
    public function getRevenueAllServices()
    {
        $this->data = $this->model::join('service_bills', 'service_bills_details.id_service_bill', '=', 'service_bills.id')
            ->join('services', 'service_bills_details.id_service', '=', 'services.id')
            ->selectRaw('MONTH(service_bills.created_at) as month, SUM(services.price) as revenue')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->keyBy('month');

        $this->instance = [];
        $totalRevenueYear = 0;
        for ($month = 1; $month <= 12; $month++) {
            $totalRevenue = $this->data->get($month)->revenue ?? 0;
            $this->instance[] = [
                'month' => $month,
                'revenue' => $this->data->get($month)->revenue ?? 0
            ];
            $totalRevenueYear += $totalRevenue;
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'monthly_revenue' => $this->instance,
                'revenue_year' => $totalRevenueYear
            ]
        ], 200);
    }
    public function getRevenueByService($id)
    {
        $this->data = $this->model::join('services as s', 'service_bills_details.id_service', '=', 's.id')
            ->select(
                'service_bills_details.id_service',
                's.name',
                's.slug',
                's.price',
                's.image',
                DB::raw('SUM(s.price) AS revenue'),
                DB::raw('COUNT(service_bills_details.id_service) AS quantity')
            )
            ->where('service_bills_details.id_service', $id)
            ->groupBy('service_bills_details.id_service', 's.id')
            ->first();

        if (!$this->data) {
            return response()->json([
                'status' => 'error',
                'message' => 'Sản phảm này chưa có hóa đơn!!'
            ], 404);
        }

        $this->instance = [
            'id' => $this->data->id_service,
            'name' => $this->data->name,
            'slug' => $this->data->slug,
            'price' => $this->data->price,
            'image' => asset('storage/services/' . $this->data->image),
            'revenue' => $this->data->revenue,
            'quantity' => $this->data->quantity,
        ];

        return response()->json([
            'status' => 'success',
            'data' => $this->instance,
        ]);
    }
    public function getRevenueByUser($id)
    {
        $this->data = DB::table('bookings as b')
            ->join('users as u', 'b.id_user', '=', 'u.id')
            ->select(
                'u.id as user_id',
                'u.name as user_name',
                'u.email as user_email',
                'b.id as booking_id',
                'b.time as booking_time',
                'b.status as booking_status'
            )
            ->where('b.id_user', $id)
            ->get();

        if ($this->data->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Chưa có booking nào cho nhân vgiên này!!'
            ], 404);
        }

        $this->instance = [
            'user' => [
                'id' => $this->data[0]->user_id,
                'name' => $this->data[0]->user_name,
                'email' => $this->data[0]->user_email,
            ],
            'bookings' => $this->data->map(function ($item) {
                return [
                    'booking' => [
                        'id' => $item->booking_id,
                        'time' => $item->booking_time,
                        'status' => $item->booking_status,
                    ],
                ];
            }),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $this->instance,
        ]);
    }
    public function getRevenueByCustomer($id)
    {
        $this->data = $this->model::join('service_bills as sb', 'service_bills_details.id_service_bill', '=', 'sb.id')
            ->join('services as s', 'service_bills_details.id_service', '=', 's.id')
            ->join('customers as c', 'sb.id_customer', '=', 'c.id')
            ->select(
                'c.uid as bill_uid',
                'sb.id as bill_id',
                'sb.id_booking',
                'sb.status as bill_status',
                'sb.created_at as bill_created_at',
                's.id as service_id',
                's.name as service_name',
                's.slug',
                's.price',
                's.image',
                'c.name as customer_name',
                'c.email as customer_email',
                'c.phone as customer_phone',
                DB::raw('SUM(s.price) AS revenue'),
                DB::raw('COUNT(service_bills_details.id_service) AS quantity')
            )
            ->where('sb.id_customer', $id)
            ->groupBy('sb.id', 's.id', 'c.id')
            ->get();
    
        if ($this->data->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Người dùng chưa có bất kỳ hóa đơn nào'
            ], 404);
        }
    
        $services = $this->data->groupBy('service_id')->map(function ($group) {
            return [
                'id' => $group[0]->service_id,
                'name' => $group[0]->service_name,
                'slug' => $group[0]->slug,
                'price' => $group[0]->price,
                'image' => asset('storage/services/' . $group[0]->image),
                'revenue' => $group->sum('revenue'),
                'quantity' => $group->sum('quantity'),
            ];
        });
    
        $this->instance = [
            'customer' => [
                'id' => $id,
                'name' => $this->data[0]->customer_name,
                'email' => $this->data[0]->customer_email,
                'phone' => $this->data[0]->customer_phone,
            ],
            'bills' => $this->data->groupBy('bill_id')->map(function ($group) {
                return [
                    'id' => $group[0]->bill_uid,
                    'id_booking' => $group[0]->id_booking,
                    'status' => $group[0]->bill_status,
                    'created_at' => $group[0]->bill_created_at,
                    'services' => $group->map(function ($item) {
                        return [
                            'id' => $item->service_id,
                            'name' => $item->service_name,
                            'slug' => $item->slug,
                            'price' => $item->price,
                            'image' => asset('storage/services/' . $item->image),
                            'revenue' => $item->revenue,
                            'quantity' => $item->quantity,
                        ];
                    })
                ];
            }),
        ];
    
        // Trả về kết quả
        return response()->json([
            'status' => 'success',
            'data' => $this->instance,
        ]);
    }    
}


