<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\VnPayRequest;
use App\Models\Bills;
use Illuminate\Http\Request;

class VnPayController extends Controller
{
    public function __construct()
    {
        $this->model = Bills::class;
    }

    public function createPayment(VnPayRequest $request)
    {
        session(['cost_id' => $request->uid]);
        session(['url_prev' => url()->previous()]);
        $order = $this->model::where('uid', $request->uid)->first();

        if (!$order) {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy đơn hàng'], 400);
        }

        if (!$order || !$request->total || $request->total <= 0) {
            return response()->json(['check' => false, 'message' => 'Dữ liệu không hợp lệ'], 400);
        }

        $vnp_TmnCode = config('vnpay.vnp_TmnCode');
        $vnp_HashSecret = config('vnpay.vnp_HashSecret');
        $vnp_Url = config('vnpay.vnp_Url');
        $vnp_ReturnUrl = config('vnpay.vnp_Returnurl');

        $vnp_TxnRef = $order->uid;
        $vnp_Inv_Customer = $order->name;
        $vnp_Inv_Email = $order->email;
        $vnp_Inv_Phone = $order->phone;
        $vnp_Inv_Address = $order->address;
        $vnp_OrderInfo = "Thanh toan don hang #" . $vnp_TxnRef;
        $vnp_OrderType =  "billpayment";
        $vnp_Amount = round($request->total, 0) * 100;
        $vnp_Locale = "vn";
        $vnp_BankCode = "VNBANK";
        $vnp_IpAddr = $request->ip();
        $startTime = date("YmdHis");

        $inputData = (array) [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => $startTime,
            "vnp_ExpireDate" => date('YmdHis', strtotime('+15 minutes', strtotime($startTime))), // Thời gian hết hạn của đơn hàng
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" =>  $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_ReturnUrl,
            "vnp_TxnRef" => $vnp_TxnRef,
            "vnp_Inv_Customer" => $vnp_Inv_Customer,
            "vnp_Inv_Email" => $vnp_Inv_Email,
            "vnp_Inv_Phone" => $vnp_Inv_Phone,
            "vnp_Inv_Address" => $vnp_Inv_Address,
        ];

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }


        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        ksort($inputData);

        $query = "";
        $i = 0;
        $hashdata = "";

        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;

        if (isset($vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        return response()->json(['check' => true, 'url' => $vnp_Url], 200);
    }

    public function vnpayReturn(Request $request)
    {
        // dd($request->all());
        $vnp_SecureHash = $request->vnp_SecureHash;
        $inputData = $request->all();

        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $hashData = "";
        foreach ($inputData as $key => $value) {
            $hashData .= urlencode($key) . "=" . urlencode($value) . '&';
        }
        $hashData = rtrim($hashData, '&');

        $secureHash = hash_hmac('sha512', $hashData, config('vnpay.vnp_HashSecret'));

        if ($secureHash === $vnp_SecureHash) {
            $this->instance = $this->model::where('uid', $request->vnp_TxnRef)->first();
            // dd($this->instance);
            if ($request->vnp_ResponseCode == '00' || $request->vnp_TransactionStatus == '00') {
                // Thanh toán thành công
                $this->instance->update([
                    'payment_status' => 1,
                    'transaction_id' => $request->vnp_TransactionNo,
                    'updated_at' => now()
                ]);
                return redirect()->away(url(env('CLIENT_URL') . '/thanh-toan-thanh-cong') . '?uid=' . $request->vnp_TxnRef . '&status=1');
            } else {
                // Thanh toán không thành công
                $this->instance->update([
                    'payment_status' => 2,
                    'transaction_id' => $request->vnp_TransactionNo,
                    'updated_at' => now()
                ]);
                return redirect()->away(url(env('CLIENT_URL') . '/thanh-toan-that-bai') . '?uid=' . $request->vnp_TxnRef . '&status=2');
            }
        } else {
            // Dữ liệu không hợp lệ
            return redirect()->away(url(env('CLIENT_URL') . '/thanh-toan-that-bai') . '?uid=' . $request->vnp_TxnRef . '&status=2');
        }
    }
}