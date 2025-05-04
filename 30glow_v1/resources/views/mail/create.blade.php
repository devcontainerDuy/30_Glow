<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Tạo tài khoản</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet" />
    <style>
        @media screen and (max-width: 600px) {
            .content {
                width: 100% !important;
                display: block !important;
                padding: 10px !important;
            }

            .header,
            .body,
            .footer {
                padding: 20px !important;
            }
        }
    </style>
</head>

<body style="font-family: 'Poppins', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 20px">
                <table class="content" width="600" border="0" cellspacing="0" cellpadding="0"
                    style="
                            border-collapse: collapse;
                            border: 1px solid #cccccc;
                        ">
                    <!-- Header -->
                    <tr>
                        <td class="header"
                            style="
                                    background-color: #333333;
                                    padding: 32px;
                                    text-align: center;
                                    color: white;
                                    font-size: 24px;
                                ">
                            <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg"
                                alt="Laravel Logo" width="200" />
                            <br />
                            <span>Tạo tài khoản thành công</span>
                            <br />
                            <small style="font-size: 18px">{{ $email }}</small>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td class="body"
                            style="
                                    padding: 40px;
                                    padding-bottom: 0px;
                                    text-align: left;
                                    font-size: 16px;
                                    line-height: 1.6;
                                ">
                            Xin chào {{ $name }}!, <br />
                            Chúc mừng bạn đã chính thức trở thành thành viên
                            của 30Glow! Việc tạo tài khoản thành công mở ra
                            cánh cửa đến với thế giới làm đẹp tóc chuyên
                            nghiệp và tiện lợi. Dưới đây là thông tin tài
                            khoản của bạn:
                            <br />
                            <br />
                            <ul style="padding-left: 20px">
                                <li>
                                    <strong>Email:</strong> {{ $email }}
                                </li>
                                <li><strong>Mật khẩu:</strong></li>
                            </ul>
                        </td>
                    </tr>

                    <!-- Call to action Button -->
                    <tr>
                        <td
                            style="
                                    padding: 0px 40px 0px 40px;
                                    text-align: center;
                                ">
                            <!-- CTA Button -->
                            <table cellspacing="0" cellpadding="0" style="margin: auto">
                                <tr>
                                    <td align="center"
                                        style="
                                                background-color: #333333;
                                                padding: 10px 20px;
                                                border-radius: 5px;
                                                width: 200px;
                                            ">
                                        <a href="https://www.yourwebsite.com" target="_blank"
                                            style="
                                                    color: #ffffff;
                                                    text-decoration: none;
                                                    font-weight: bold;
                                                ">{{ $password }}</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="body"
                            style="
                                    padding: 40px;
                                    text-align: left;
                                    font-size: 16px;
                                    line-height: 1.6;
                                ">
                            Giờ đây, bạn có thể dễ dàng đặt lịch cho các
                            dịch vụ chăm sóc tóc tuyệt vời tại 30Glow, từ
                            cắt tạo kiểu đến phục hồi hư tổn, với đội ngũ
                            stylist giàu kinh nghiệm. <br />
                            Bên cạnh đó, bạn còn được thỏa sức mua sắm các
                            sản phẩm chăm sóc tóc chất lượng, được tuyển
                            chọn kỹ lưỡng từ những thương hiệu uy tín, đảm
                            bảo mang đến cho bạn mái tóc khỏe đẹp và rạng
                            ngời. <br />
                            Hãy khám phá ngay những ưu đãi độc quyền dành
                            riêng cho thành viên 30Glow và bắt đầu hành
                            trình chinh phục vẻ đẹp hoàn hảo cho mái tóc của
                            bạn!
                            <br />
                            <p><b>Lưu ý:</b></p>
                            <ul>
                                <li>
                                    Vì lý do bảo mật, bạn nên thay đổi mật
                                    khẩu mặc định (hiển thị ở trên) sau khi
                                    đăng nhập lần đầu.
                                </li>
                                <li>
                                    Luôn giữ kín thông tin tài khoản của bạn
                                    và không chia sẻ với bất kỳ ai.
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td class="footer"
                            style="
                                    background-color: #333333;
                                    padding: 40px;
                                    text-align: center;
                                    color: white;
                                    font-size: 14px;
                                ">
                            Copyright &copy; 2024 | 30Glow
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
