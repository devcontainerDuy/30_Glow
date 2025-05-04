<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="X-CSRF-TOKEN" content="{{ csrf_token() }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="base-url" content="{{ url('/') }}">
    <title>Trang quản trị</title>
    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    @inertiaHead
    <script src="https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js" async></script>
</head>

<body>
    @inertia
    <script type="text/javascript">
        const csrfToken = document.head.querySelector('meta[name="csrf-token"]').content;
    </script>
</body>

</html>
