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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class RevenueController extends Controller
{
    public function __construct()
    {
        $this->model = ServiceBills::class;
    }
    public function index()
    {
        // Doanh thu sản phẩm tháng hiện tại
        $currentMonthProductRevenue = Bills::whereMonth('created_at', now()->month)->sum('total');

        // Doanh thu dịch vụ tháng hiện tại
        $currentMonthServiceRevenue = ServiceBills::whereMonth('created_at', now()->month)->sum('total');

        // Doanh thu sản phẩm tháng trước
        $lastMonthProductRevenue = Bills::whereMonth('created_at', now()->subMonth()->month)->sum('total');

        // Doanh thu dịch vụ tháng trước
        $lastMonthServiceRevenue = ServiceBills::whereMonth('created_at', now()->subMonth()->month)->sum('total');

        // Tính phần trăm thay đổi cho sản phẩm
        $productRevenuePercentageChange = $lastMonthProductRevenue > 0
            ? (($currentMonthProductRevenue - $lastMonthProductRevenue) / $lastMonthProductRevenue) * 100
            : ($currentMonthProductRevenue > 0 ? 100 : 0);

        // Tính phần trăm thay đổi cho dịch vụ
        $serviceRevenuePercentageChange = $lastMonthServiceRevenue > 0
            ? (($currentMonthServiceRevenue - $lastMonthServiceRevenue) / $lastMonthServiceRevenue) * 100
            : ($currentMonthServiceRevenue > 0 ? 100 : 0);
        // Số đơn hàng mới hôm nay
        $newOrdersCount = Bills::whereDate('created_at', now()->toDateString())
            ->where('status', 1)
            ->count();

        // Số lượt đặt chỗ mới hôm nay
        $newBookingCount = Bookings::whereDate('created_at', now()->toDateString())
            ->count();

        // Sản phẩm bán chạy nhất
        $bestSellingProduct = BillsDetail::selectRaw('id_product, SUM(quantity) as total_quantity')
            ->whereMonth('created_at', now()->month)
            ->with(['product.gallery' => function ($query) {
                $query->where('status', 1);
            }])
            ->groupBy('id_product')
            ->orderByDesc('total_quantity')
            ->first();

        $bestSellingProductData = $bestSellingProduct ? [
            'id' => $bestSellingProduct->product->id,
            'name' => $bestSellingProduct->product->name,
            'image' => $bestSellingProduct->product->gallery->first()->image ?? null,
            'total_quantity' => $bestSellingProduct->total_quantity,
            'price' => $bestSellingProduct->product->price,
        ] : null;

        // Dịch vụ bán chạy nhất
        $bestSellingService = ServiceBillsDetails::selectRaw('id_service, COUNT(*) as total_orders')
            ->whereMonth('created_at', now()->month)
            ->with(['service' => function ($query) {
                $query->select('id', 'name', 'price', 'image');
            }])
            ->groupBy('id_service')
            ->orderByDesc('total_orders')
            ->first();

        $bestSellingServiceData = $bestSellingService ? [
            'id' => $bestSellingService->service->id,
            'name' => $bestSellingService->service->name,
            'image' => $bestSellingService->service->image,
            'total_orders' => $bestSellingService->total_orders,
            'price' => $bestSellingService->service->price,
        ] : null;

        // Các đơn hàng sản phẩm mới nhất
        $latestProductOrders = Bills::select('uid', 'created_at', 'total')
            ->latest()
            ->take(3)
            ->get();

        // Các hóa đơn dịch vụ mới nhất
        $latestServiceBills = ServiceBills::select('uid', 'created_at', 'total')
            ->latest()
            ->take(3)
            ->get();

        // Doanh thu sản phẩm theo tháng
        $products = Bills::monthlyRevenue()->get()->keyBy('month');
        $productData = [];
        $totalProductRevenueYear = 0;
        for ($month = 1; $month <= 12; $month++) {
            $totalRevenue = $products->get($month)->revenue ?? 0;
            $productData[] = [
                'month' => $month,
                'revenue' => $totalRevenue,
            ];
            $totalProductRevenueYear += $totalRevenue;
        }

        $totalProducts = [
            'monthly_revenue' => $productData,
            'revenue_year' => $totalProductRevenueYear
        ];

        // Doanh thu dịch vụ theo tháng
        $services = ServiceBills::monthlyRevenue()->get()->keyBy('month');
        $serviceData = [];
        $totalServiceRevenueYear = 0;
        for ($month = 1; $month <= 12; $month++) {
            $totalRevenue = $services->get($month)->revenue ?? 0;
            $serviceData[] = [
                'month' => $month,
                'revenue' => $totalRevenue,
            ];
            $totalServiceRevenueYear += $totalRevenue;
        }

        $totalServices = [
            'monthly_revenue' => $serviceData,
            'revenue_year' => $totalServiceRevenueYear
        ];

        // Truyền tất cả dữ liệu vào trang Vue
        return Inertia::render('Home', [
            'products' => $totalProducts,
            'services' => $totalServices,
            'currentMonthProductRevenue' => $currentMonthProductRevenue,
            'currentMonthServiceRevenue' => $currentMonthServiceRevenue,
            'productRevenuePercentageChange' => $productRevenuePercentageChange,
            'serviceRevenuePercentageChange' => $serviceRevenuePercentageChange,
            'newOrdersCount' => $newOrdersCount,
            'newBookingCount' => $newBookingCount,
            'bestSellingProduct' => $bestSellingProductData,
            'bestSellingService' => $bestSellingServiceData,
            'latestProductOrders' => $latestProductOrders,
            'latestServiceBills' => $latestServiceBills,
        ]);
    }
    public function billProDuctsList()
    {
        $this->crumbs = [
            ['name' => 'Trang chủ', 'url' => '/admin/'],
            ['name' => 'Danh sách doanh thu trong ngày', 'url' => '/admin/dailyProductRevenues'],
        ];

        $this->data = Bills::selectRaw('DATE(created_at) as date, SUM(total) as daily_revenue, COUNT(*) as quality, payment_method')
            ->whereMonth('created_at', now()->month)
            ->where('payment_status', 1)
            ->where('status', 4)
            ->groupBy('date', 'payment_method')
            ->orderBy('date', 'desc')
            ->get();

        $this->data = $this->data->groupBy('date')->map(function ($dayBills) {
            $dailyRevenue = $dayBills->sum('daily_revenue');
            $quality = $dayBills->sum('quality');

            $paymentMethodTotals = $dayBills->groupBy('payment_method')->map(function ($methodBills) {
                return [
                    'payment_method' => $methodBills->first()->payment_method,
                    'total_by_payment_method' => $methodBills->sum('daily_revenue'),
                ];
            });

            return [
                'date' => $dayBills->first()->date,
                'daily_revenue' => $dailyRevenue,
                'quality' => $quality,
                'payment_method_totals' => $paymentMethodTotals,
            ];
        })->values();

        return Inertia::render('Revenue/Index', [
            'crumbs' => $this->crumbs,
            'dailyRevenues' => $this->data,
        ]);
    }
    public function billProDuctsDetail(string $date)
    {
        $this->crumbs = [
            ['name' => 'Trang chủ', 'url' => '/admin/'],
            ['name' => 'Danh sách doanh thu trong ngày', 'url' => '/admin/dailyProductRevenues'],
            ['name' => 'Chi tiết doanh thu trong ngày', 'url' => '/admin/dailyProductRevenues/' . $date . '/edit']
        ];

        $this->data = Bills::with(['customer'])
            ->whereDate('created_at', $date)
            ->where('payment_status', 1)
            ->where('status', 4)
            ->get()
            ->groupBy(function ($bill) {
                return $bill->created_at->format('Y-m-d');
            })
            ->map(function ($bills) {
                $dailyRevenue = $bills->sum('total');  // Tính tổng doanh thu trong ngày

                $paymentMethodTotals = $bills->groupBy('payment_method')->map(function ($methodBills) {
                    return [
                        'payment_method' => $methodBills->first()->payment_method,
                        'total_by_payment_method' => $methodBills->sum('total'),
                    ];
                });

                $billsList = $bills->map(function ($bill) {
                    $customer = $bill->customer;
                    return [
                        'uid' => $bill->uid,
                        'total' => $bill->total,
                        'payment_method' => $bill->payment_method,
                        'created_at' => $bill->created_at->toDateTimeString(),
                        'status' =>  $bill->status,
                        'customer' => [
                            'name' => $customer ? $customer->name : null,
                            'phone' => $customer ? $customer->phone : null,
                        ],
                    ];
                });

                // Tổng tiền trong ngày là tổng của tất cả các bill trong ngày
                $total = $bills->sum('total');

                return [
                    'date' => $bills->first()->created_at->toDateString(),
                    'daily_revenue' => $dailyRevenue,
                    'payment_method_totals' => $paymentMethodTotals,
                    'bills' => $billsList,
                    'total' => $total,  // Trả về tổng tiền trong ngày
                ];
            });

        return Inertia::render('Revenue/Edit', [
            'date' => $date,
            'dailyRevenues' => $this->data,
            'crumbs' => $this->crumbs,
        ]);
    }
    public function billServicesList()
    {
        $this->crumbs = [
            ['name' => 'Trang chủ', 'url' => '/admin/'],
            ['name' => 'Danh sách doanh thu dịch vụ trong ngày', 'url' => '/admin/dailyServiceRevenues'],
        ];

        $this->data = ServiceBills::selectRaw('DATE(created_at) as date, SUM(total) as daily_revenue, COUNT(*) as quality, status')
            ->whereMonth('created_at', now()->month)
            ->where('status', 1)  // Assuming 1 means completed, adjust as necessary
            ->groupBy('date', 'status')
            ->orderBy('date', 'desc')
            ->get();

        $this->data = $this->data->groupBy('date')->map(function ($dayBills) {
            $dailyRevenue = $dayBills->sum('daily_revenue');
            $quality = $dayBills->sum('quality');

            $statusTotals = $dayBills->groupBy('status')->map(function ($statusBills) {
                return [
                    'status' => $statusBills->first()->status,
                    'total_by_status' => $statusBills->sum('daily_revenue'),
                ];
            });

            return [
                'date' => $dayBills->first()->date,
                'daily_revenue' => $dailyRevenue,
                'quality' => $quality,
                'status_totals' => $statusTotals,
            ];
        })->values();

        return Inertia::render('Revenue/Index', [
            'crumbs' => $this->crumbs,
            'dailyRevenues' => $this->data,
        ]);
    }
    public function billServicesDetail(string $date)
    {
        $this->crumbs = [
            ['name' => 'Trang chủ', 'url' => '/admin/'],
            ['name' => 'Danh sách doanh thu dịch vụ trong ngày', 'url' => '/admin/dailyServiceRevenues'],
            ['name' => 'Chi tiết doanh thu dịch vụ trong ngày', 'url' => '/admin/dailyServiceRevenues/' . $date . '/edit'],
        ];

        $this->data = ServiceBills::with(['customer', 'booking'])
            ->whereDate('created_at', $date)
            ->where('status', 1)  // Assuming 1 means completed, adjust as necessary
            ->get()
            ->groupBy(function ($bill) {
                return $bill->created_at->format('Y-m-d');
            })
            ->map(function ($bills) {
                $dailyRevenue = $bills->sum('total');  // Tính tổng doanh thu trong ngày

                $statusTotals = $bills->groupBy('status')->map(function ($statusBills) {
                    return [
                        'status' => $statusBills->first()->status,
                        'total_by_status' => $statusBills->sum('total'),
                    ];
                });

                $billsList = $bills->map(function ($bill) {
                    $customer = $bill->customer;
                    $booking = $bill->booking;
                    return [
                        'uid' => $bill->uid,
                        'total' => $bill->total,
                        'status' => $bill->status,
                        'created_at' => $bill->created_at->toDateTimeString(),
                        'customer' => [
                            'name' => $customer ? $customer->name : null,
                            'phone' => $customer ? $customer->phone : null,
                        ],
                        'booking' => [
                            'id' => $booking ? $booking->id : null,
                            'time' => $booking ? $booking->time : null,
                        ],
                    ];
                });

                // Tổng tiền trong ngày là tổng của tất cả các bill trong ngày
                $total = $bills->sum('total');

                return [
                    'date' => $bills->first()->created_at->toDateString(),
                    'daily_revenue' => $dailyRevenue,
                    'status_totals' => $statusTotals,
                    'bills' => $billsList,
                    'total' => $total,  // Trả về tổng tiền trong ngày
                ];
            });

        return Inertia::render('Revenue/Edit', [
            'date' => $date,
            'dailyRevenues' => $this->data,
            'crumbs' => $this->crumbs,
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
