<?php

namespace App\Http\Controllers\Revenue;

use App\Http\Controllers\Controller;
use App\Http\Requests\Revenue\RevenueRequest;
use App\Models\Bills;
use App\Models\BillsDetail;
use App\Models\Bookings;
use App\Models\Customers;
use App\Models\ServiceBills;
use App\Models\ServiceBillsDetails;
use App\Models\Services;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RevenueController extends Controller
{
    public function __construct()
    {
        $this->model = ServiceBills::class;
    }

    public function index()
    {
        // Tổng số người dùng
        $totalUsers = Customers::count();

        // Tổng số người dùng mới trong tháng này
        $totalNewUsersThisMonth = Customers::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();

        // Doanh thu tháng này
        $currentMonthRevenue = Bills::whereMonth('created_at', now()->month)
            ->sum('total') + ServiceBills::whereMonth('created_at', now()->month)
            ->sum('total');

        // Đơn hàng mới trong tháng này
        $newOrdersCount = Bills::whereMonth('created_at', now()->month)
            ->where('status', 1)
            ->count();

        // Sản phẩm bán chạy trong tháng này
        $bestSellingProduct = BillsDetail::selectRaw('id_product, SUM(quantity) as total_quantity')
            ->whereMonth('created_at', now()->month)
            ->with(['product.gallery' => function ($query) {
                $query->where('status', 1);
            }])
            ->groupBy('id_product')
            ->orderByDesc('total_quantity')
            ->first();

        // Doanh thu sản phẩm và dịch vụ
        $products = Bills::monthlyRevenue()->get()->keyBy('month');
        $instance = [];
        $totalRevenueYear = 0;

        for ($month = 1; $month <= 12; $month++) {
            $totalRevenue = $products->get($month)->revenue ?? 0;
            $instance[] = [
                'month' => $month,
                'revenue' => $totalRevenue,
            ];
            $totalRevenueYear += $totalRevenue;
        }
        $total_products[] = [
            'monthly_revenue' => $instance,
            'revenue_year' => $totalRevenueYear
        ];
        $services = ServiceBills::monthlyRevenue()->get()->keyBy('month');
        $instance = [];
        $totalRevenueYear = 0;

        for ($month = 1; $month <= 12; $month++) {
            $totalRevenue = $services->get($month)->revenue ?? 0;
            $instance[] = [
                'month' => $month,
                'revenue' => $totalRevenue,
            ];
            $totalRevenueYear += $totalRevenue;
        }
        $total_services[] = [
            'monthly_revenue' => $instance,
            'revenue_year' => $totalRevenueYear
        ];

        $latestProductOrders = Bills::select('uid', 'created_at', 'total')
            ->latest()
            ->take(3)
            ->get();

        $latestServiceBills = ServiceBills::select('uid', 'created_at', 'total')
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Home', [
            'products' => $total_products,
            'services' => $total_services,
            'totalUsers' => $totalUsers,
            'currentMonthRevenue' => $currentMonthRevenue,
            'newOrdersCount' => $newOrdersCount,
            'bestSellingProduct' => $bestSellingProduct,
            'totalNewUsersThisMonth' => $totalNewUsersThisMonth,
            'latestProductOrders' => $latestProductOrders,
            'latestServiceBills' => $latestServiceBills,
        ]);
    }


    //doanh thi cho bill services
    public function getRevenueAllServices()
    {
        $data = $this->model::monthlyRevenue()->get()->keyBy('month');
        $instance = [];
        $totalRevenueYear = 0;

        for ($month = 1; $month <= 12; $month++) {
            $totalRevenue = $data->get($month)->revenue ?? 0;
            $instance[] = [
                'month' => $month,
                'revenue' => $totalRevenue,
            ];
            $totalRevenueYear += $totalRevenue;
        }

        return response()->json(['check' => true, 'data' => ['monthly_revenue' => $instance, 'revenue_year' => $totalRevenueYear,],], 200);
    }
    public function getRevenueByService($id)
    {
        $this->data = ServiceBillsDetails::with(['serviceBill', 'service'])
            ->where('id_service', $id)
            ->get();

        if ($this->data->isEmpty()) {
            return response()->json([
                'check' => false,
                'message' => 'Dịch vụ chưa có bất kỳ booking nào!!!',
            ], 404);
        }

        $this->instance = [];
        $totalRevenueYear = 0;
        $service = $this->data->first()->service->only(['id', 'name', 'slug', 'price', 'image']);

        for ($month = 1; $month <= 12; $month++) {
            $monthlyRevenue = $this->data->filter(function ($item) use ($month) {
                return $item->serviceBill->created_at->month == $month;
            });
            $totalRevenue = $monthlyRevenue->sum('unit_price');
            $totalCount = $monthlyRevenue->count();

            $this->instance[] = [
                'month' => $month,
                'revenue' => $totalRevenue,
                'quantity' => $totalCount,
            ];
            $totalRevenueYear += $totalRevenue;
        }

        return response()->json([
            'check' => true,
            'data' => [
                'service' => $service,
                'monthly_revenue' => $this->instance,
                'revenue_year' => $totalRevenueYear,
            ],
        ], 200);
    }
    public function getRevenueByCustomer($id)
    {
        $this->data = $this->model::with(['customer'])
            ->where('id_customer', $id)
            ->get();

        if ($this->data->isEmpty()) {
            return response()->json([
                'check' => false,
                'message' => 'Khách hàng này chưa có bất kỳ bill nào!!',
            ], 404);
        }

        $customer = $this->data->first()->customer->only(['uid', 'name', 'email']);
        $this->instance = [];
        $totalRevenueYear = 0;

        for ($month = 1; $month <= 12; $month++) {
            $monthlyRevenue = $this->data->filter(function ($item) use ($month) {
                return $item->created_at->month == $month;
            });
            $totalRevenue = $monthlyRevenue->sum('total');
            $totalCount = $monthlyRevenue->count();

            $this->instance[] = [
                'month' => $month,
                'revenue' => $totalRevenue,
                'quantity' => $totalCount,
            ];
            $totalRevenueYear += $totalRevenue;
        }

        return response()->json([
            'check' => true,
            'data' => [
                'customer' => $customer,
                'monthly_revenue' => $this->instance,
                'revenue_year' => $totalRevenueYear,
            ],
        ], 200);
    }
    public function getRevenueByDateRange(RevenueRequest $request)
    {
        $request->validated();
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        $this->data = $this->model::with(['serviceBillDetails.service'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        if ($this->data->isEmpty()) {
            return response()->json([
                'check' => false,
                'message' => 'Không có hóa đơn nào trong khoảng thời gian này!',
            ], 404);
        }

        $this->instance = [
            'total_revenue' => $this->data->sum('total'),
            'services' => $this->data->flatMap(function ($bill) {
                return $bill->serviceBillDetails->map(function ($detail) {
                    $service = $detail->service;
                    return [
                        'name' => $service->name,
                        'slug' => $service->slug,
                        'price' => $service->price,
                        'unit_price' => (float) $detail->unit_price,
                        'image' => asset('storage/services/' . $service->image),
                    ];
                });
            })
                ->groupBy('slug')
                ->map(function ($group) {
                    $service = $group->first();
                    $count = $group->count();
                    $total_price = $count * $service['price'];
                    return [
                        'name' => $service['name'],
                        'slug' => $service['slug'],
                        'unit_price' => $service['unit_price'],
                        'total_price' => $total_price,
                        'image' => $service['image'],
                        'count' => $group->count(),
                    ];
                })
                ->values(),
        ];

        return response()->json(['check' => true, 'data' => $this->instance,], 200);
    }
    //doanh thi cho bill products
    public function getRevenueAllProducts()
    {
        $data = Bills::where('payment_status', 1)
            ->where('status', 4)
            ->monthlyRevenue()
            ->get()
            ->keyBy('month');
        $instance = [];
        $totalRevenueYear = 0;

        for ($month = 1; $month <= 12; $month++) {
            $totalRevenue = $data->get($month)->revenue ?? 0;
            $instance[] = [
                'month' => $month,
                'revenue' => $totalRevenue,
            ];
            $totalRevenueYear += $totalRevenue;
        }

        return response()->json(['check' => true, 'data' => ['monthly_revenue' => $instance, 'revenue_year' => $totalRevenueYear]], 200);
    }
    public function getRevenueByProduct($id)
    {
        $this->data = BillsDetail::with('product', 'product.gallery')
            ->whereHas('bill', function ($query) {
                $query->where('payment_status', 1)->where('status', 4);
            })
            ->where('id_product', $id)
            ->get();

        if ($this->data->isEmpty()) {
            return response()->json([
                'check' => false,
                'message' => 'Không có dữ liệu cho sản phẩm này!',
            ], 404);
        }

        $product = $this->data->first()->product;
        $totalQuantity = $this->data->sum('quantity');

        $monthlyRevenue = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthlyData = $this->data->filter(function ($item) use ($month) {
                return date('m', strtotime($item->created_at)) == $month; // Lọc dữ liệu theo tháng
            });
            $totalRevenue = $monthlyData->sum(function ($item) {
                return $item->quantity * $item->unit_price;
            });
            $monthlyRevenue[] = [
                'month' => $month,
                'revenue' => $totalRevenue,
            ];
        }

        $totalRevenue = $this->data->sum(function ($item) {
            return $item->quantity * $item->unit_price;
        });

        $this->data = [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'quantity' => $totalQuantity,
                'gallery' => $product->gallery->filter(function ($galleryItem) {
                    return $galleryItem->status == 1;
                })->map(function ($galleryItem) {
                    return [
                        'image' => asset('storage/gallery/' . $galleryItem->image),
                    ];
                }),
                'monthly_revenue' => $monthlyRevenue,
                'total_revenue' => $totalRevenue,
            ]
        ];

        return response()->json(['check' => true, 'data' => $this->data], 200);
    }
    public function getRevenueProductByCustomer($id)
    {
        $this->data = Bills::with('customer')
            ->where('payment_status', 1)
            ->where('status', 4)
            ->where('customer_id', $id)
            ->get();
        if ($this->data->isEmpty()) {
            return response()->json([
                'check' => false,
                'message' => 'Khách hàng này chưa có bất kỳ hóa đơn nào!!',
            ], 404);
        }
        $customer = $this->data->first()->customer->only(['uid', 'name', 'email', 'phone']);

        $this->instance = [];
        $totalRevenueYear = 0;

        for ($month = 1; $month <= 12; $month++) {
            $monthlyRevenue = $this->data->filter(function ($item) use ($month) {
                return $item->created_at->month == $month;
            });
            $totalRevenue = $monthlyRevenue->sum('total');
            $totalCount = $monthlyRevenue->count();
            $this->instance[] = [
                'month' => $month,
                'revenue' => $totalRevenue,
                'quantity' => $totalCount,
            ];
            $totalRevenueYear += $totalRevenue;
        }

        $this->data = [
            'customer' => $customer,
            'monthly_revenue' => $this->instance,
            'revenue_year' => $totalRevenueYear,
        ];

        return response()->json(['check' => true, 'data' => $this->data], 200);
    }
    public function getRevenueByDateRangeProduct(RevenueRequest $request)
    {
        $request->validated();
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        $this->data = Bills::with(['billDetail.product.gallery', 'billDetail.product.category' => function ($query) {
            $query->where('status', 1);
        }])
            ->where('payment_status', 1)
            ->where('status', 4)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        if ($this->data->isEmpty()) {
            return response()->json([
                'check' => false,
                'message' => 'Không có hóa đơn nào trong khoảng thời gian này!',
            ], 404);
        }
        $paymentMethods = $this->data->groupBy('payment_method')->map(function ($bills, $paymentMethod) {
            return [
                'payment_method' => $paymentMethod,
                'total' => $bills->sum('total'),
            ];
        })->values();

        $this->instance = [
            'total_revenue' => $this->data->sum('total'),
            'categories' => $this->data->flatMap(function ($bill) {
                return $bill->billDetail->map(function ($detail) {
                    $product = $detail->product;
                    if (!$product) {
                        return null;
                    }
                    $productImage = $product->gallery->firstWhere('status', 1);
                    $imageUrl = $productImage ? asset('storage/products/' . $productImage->image) : null;

                    return [
                        'id_category' => $product->id_category,
                        'name' => $product->category->name ?? 'Uncategorized',
                        'product' => [
                            'name' => $product->name,
                            'slug' => $product->slug,
                            'price' => (float) $product->price,
                            'unit_price' => (float) $detail->unit_price,
                            'quantity' => $detail->quantity,
                            'image' => $imageUrl,
                        ],
                    ];
                })->filter();
            })
                ->groupBy('id_category')
                ->map(function ($group, $categoryId) {
                    $categoryName = $group->first()['name'];
                    $products = $group->pluck('product')->toArray();

                    return [
                        'name' => $categoryName,
                        'products' => $products,
                    ];
                })
                ->values(),
            'payment_methods' => $paymentMethods,
        ];

        return response()->json(['check' => true, 'data' => $this->instance], 200);
    }
}
