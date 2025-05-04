<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Phản hồi từ 30Glow</title>
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
                    style="border-collapse: collapse; border: 1px solid #cccccc;">
                    <!-- Header -->
                    <tr>
                        <td class="header"
                            style="background-color: #333333; padding: 32px; text-align: center; color: white; font-size: 24px;">
                            <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg"
                                alt="30Glow Logo" width="200" />
                            <br />
                            <span>Phản hồi từ 30Glow</span>
                            <br />
                            <small style="font-size: 18px">{{ $email }}</small>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td class="body"
                            style="padding: 40px; padding-bottom: 0px; text-align: left; font-size: 16px; line-height: 1.6;">
                            Xin chào {{ $name }}!, <br />
                            Chúng tôi đã nhận được yêu cầu của bạn và rất vui khi có cơ hội hỗ trợ. Dưới đây là thông tin phản hồi của chúng tôi:
                            <br />
                            <br />
                            <b>Phản hồi từ 30Glow:</b>
                            <p>{{ $replyMessage }}</p>
                            <br />
                            Nếu bạn có bất kỳ câu hỏi nào thêm, đừng ngần ngại liên hệ với chúng tôi qua email hoặc điện thoại.
                            <br />
                            Cảm ơn bạn đã liên hệ với 30Glow!
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="footer"
                            style="background-color: #333333; padding: 40px; text-align: center; color: white; font-size: 14px;">
                            Copyright &copy; 2024 | 30Glow
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
