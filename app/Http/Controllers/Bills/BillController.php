<?php

namespace App\Http\Controllers\Bills;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bills\BillRequest;
use App\Models\Bills;
use App\Models\BillsDetail;
use App\Models\Customers;
use App\Traits\GeneratesUniqueId;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BillController extends Controller
{
    use GeneratesUniqueId;
    public function __construct()
    {
        $this->middleware('auth');
        $this->model = Bills::class;
    }

    /**
     * Display a listing of the resource.
     */
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
    public function store(BillRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->data = $request->validated();
            $idCustomer = Customers::where("uid", $this->data['customer_id'])->first();

            if ($idCustomer->address === null && $idCustomer->phone === null) {
                $idCustomer->update(['address' => $this->data['address'], 'phone' => $this->data['phone']]);
            }

            $this->instance = $this->model::insertGetId([
                'uid' => $this->createCodeOrder(),
                'customer_id' => $idCustomer->id,
                'name' => $this->data['name'],
                'email' => $this->data['email'],
                'phone' => $this->data['phone'],
                'address' => $this->data['address'],
                'note' => $this->data['note'],
                'name_other' => $this->data['name_other'] ?? null,
                'email_other' => $this->data['email_other'] ?? null,
                'phone_other' => $this->data['phone_other'] ?? null,
                'address_other' => $this->data['address_other'] ?? null,
                'note_other' => $this->data['note_other'] ?? null,
                'payment_method' => $this->data['payment_method'],
                'transaction_id' => $this->data['transaction_id'] ?? null,
                'total' => $this->data['total'],
                'status' => 1,
            ]);

            foreach ($this->data['cart'] as $item) {
                BillsDetail::create(['id_bill' => $this->instance, 'id_product' => $item['id_product'], 'quantity' => $item['quantity'], 'unit_price' => $item['unit_price']]);
            }

            DB::commit();
            return response()->json(['check' => true, 'message' => 'Đặt hàng thành công!'], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Error: " . $e->getMessage());
            return response()->json(['check' => false, 'message' => 'Đặt hàng thất bại!'], 401);
        }
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
    public function update(BillRequest $request, string $id)
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