<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Dòng ngôn ngữ xác thực
    |--------------------------------------------------------------------------
    |
    | Các dòng ngôn ngữ sau đây chứa các thông điệp lỗi mặc định được sử dụng bởi
    | lớp xác thực. Một số quy tắc có nhiều phiên bản như quy tắc kích thước.
    | Hãy tự do điều chỉnh từng thông điệp này tại đây.
    |
    */

    'accepted' => 'Trường :attribute phải được chấp nhận.',
    'accepted_if' => 'Trường :attribute phải được chấp nhận khi :other là :value.',
    'active_url' => 'Trường :attribute phải là một URL hợp lệ.',
    'after' => 'Trường :attribute phải là một ngày sau :date.',
    'after_or_equal' => 'Trường :attribute phải là một ngày sau hoặc bằng :date.',
    'alpha' => 'Trường :attribute chỉ có thể chứa chữ cái.',
    'alpha_dash' => 'Trường :attribute chỉ có thể chứa chữ cái, số, dấu gạch ngang và dấu gạch dưới.',
    'alpha_num' => 'Trường :attribute chỉ có thể chứa chữ cái và số.',
    'array' => 'Trường :attribute phải là một mảng.',
    'ascii' => 'Trường :attribute chỉ có thể chứa các ký tự đơn byte chữ và số và các ký hiệu.',
    'before' => 'Trường :attribute phải là một ngày trước :date.',
    'before_or_equal' => 'Trường :attribute phải là một ngày trước hoặc bằng :date.',
    'between' => [
        'array' => 'Trường :attribute phải có từ :min đến :max mục.',
        'file' => 'Trường :attribute phải có kích thước từ :min đến :max kilobyte.',
        'numeric' => 'Trường :attribute phải có giá trị từ :min đến :max.',
        'string' => 'Trường :attribute phải có từ :min đến :max ký tự.',
    ],
    'boolean' => 'Trường :attribute phải là true hoặc false.',
    'can' => 'Trường :attribute chứa một giá trị không được phép.',
    'confirmed' => 'Xác nhận trường :attribute không khớp.',
    'current_password' => 'Mật khẩu không chính xác.',
    'date' => 'Trường :attribute phải là một ngày hợp lệ.',
    'date_equals' => 'Trường :attribute phải là một ngày bằng :date.',
    'date_format' => 'Trường :attribute phải khớp với định dạng :format.',
    'decimal' => 'Trường :attribute phải có :decimal chữ số thập phân.',
    'declined' => 'Trường :attribute phải bị từ chối.',
    'declined_if' => 'Trường :attribute phải bị từ chối khi :other là :value.',
    'different' => 'Trường :attribute và :other phải khác nhau.',
    'digits' => 'Trường :attribute phải có :digits chữ số.',
    'digits_between' => 'Trường :attribute phải có từ :min đến :max chữ số.',
    'dimensions' => 'Trường :attribute có kích thước hình ảnh không hợp lệ.',
    'distinct' => 'Trường :attribute có giá trị trùng lặp.',
    'doesnt_end_with' => 'Trường :attribute không được kết thúc bằng một trong các giá trị sau: :values.',
    'doesnt_start_with' => 'Trường :attribute không được bắt đầu bằng một trong các giá trị sau: :values.',
    'email' => 'Trường :attribute phải là một địa chỉ email hợp lệ.',
    'ends_with' => 'Trường :attribute phải kết thúc bằng một trong các giá trị sau: :values.',
    'enum' => 'Giá trị :attribute đã chọn không hợp lệ.',
    'exists' => 'Giá trị :attribute đã chọn không hợp lệ.',
    'extensions' => 'Trường :attribute phải có một trong các phần mở rộng sau: :values.',
    'file' => 'Trường :attribute phải là một tệp.',
    'filled' => 'Trường :attribute phải có giá trị.',
    'gt' => [
        'array' => 'Trường :attribute phải có nhiều hơn :value mục.',
        'file' => 'Trường :attribute phải có kích thước lớn hơn :value kilobyte.',
        'numeric' => 'Trường :attribute phải có giá trị lớn hơn :value.',
        'string' => 'Trường :attribute phải có nhiều hơn :value ký tự.',
    ],
    'gte' => [
        'array' => 'Trường :attribute phải có ít nhất :value mục.',
        'file' => 'Trường :attribute phải có kích thước lớn hơn hoặc bằng :value kilobyte.',
        'numeric' => 'Trường :attribute phải có giá trị lớn hơn hoặc bằng :value.',
        'string' => 'Trường :attribute phải có ít nhất :value ký tự.',
    ],
    'hex_color' => 'Trường :attribute phải là một màu thập lục hợp lệ.',
    'image' => 'Trường :attribute phải là một hình ảnh.',
    'in' => 'Giá trị :attribute đã chọn không hợp lệ.',
    'in_array' => 'Trường :attribute phải tồn tại trong :other.',
    'integer' => 'Trường :attribute phải là một số nguyên.',
    'ip' => 'Trường :attribute phải là một địa chỉ IP hợp lệ.',
    'ipv4' => 'Trường :attribute phải là một địa chỉ IPv4 hợp lệ.',
    'ipv6' => 'Trường :attribute phải là một địa chỉ IPv6 hợp lệ.',
    'json' => 'Trường :attribute phải là một chuỗi JSON hợp lệ.',
    'lowercase' => 'Trường :attribute phải là chữ thường.',
    'lt' => [
        'array' => 'Trường :attribute phải có ít hơn :value mục.',
        'file' => 'Trường :attribute phải có kích thước nhỏ hơn :value kilobyte.',
        'numeric' => 'Trường :attribute phải có giá trị nhỏ hơn :value.',
        'string' => 'Trường :attribute phải có ít hơn :value ký tự.',
    ],
    'lte' => [
        'array' => 'Trường :attribute không được có nhiều hơn :value mục.',
        'file' => 'Trường :attribute phải có kích thước nhỏ hơn hoặc bằng :value kilobyte.',
        'numeric' => 'Trường :attribute phải có giá trị nhỏ hơn hoặc bằng :value.',
        'string' => 'Trường :attribute không được có nhiều hơn :value ký tự.',
    ],
    'mac_address' => 'Trường :attribute phải là một địa chỉ MAC hợp lệ.',
    'max' => [
        'array' => 'Trường :attribute không được có nhiều hơn :max mục.',
        'file' => 'Trường :attribute không được có kích thước lớn hơn :max kilobyte.',
        'numeric' => 'Trường :attribute không được có giá trị lớn hơn :max.',
        'string' => 'Trường :attribute không được có nhiều hơn :max ký tự.',
    ],
    'max_digits' => 'Trường :attribute không được có nhiều hơn :max chữ số.',
    'mimes' => 'Trường :attribute phải là một tệp có loại: :values.',
    'mimetypes' => 'Trường :attribute phải là một tệp có loại: :values.',
    'min' => [
        'array' => 'Trường :attribute phải có ít nhất :min mục.',
        'file' => 'Trường :attribute phải có kích thước ít nhất :min kilobyte.',
        'numeric' => 'Trường :attribute phải có giá trị ít nhất :min.',
        'string' => 'Trường :attribute phải có ít nhất :min ký tự.',
    ],
    'min_digits' => 'Trường :attribute phải có ít nhất :min chữ số.',
    'missing' => 'Trường :attribute phải bị thiếu.',
    'missing_if' => 'Trường :attribute phải bị thiếu khi :other là :value.',
    'missing_unless' => 'Trường :attribute phải bị thiếu trừ khi :other là :value.',
    'missing_with' => 'Trường :attribute phải bị thiếu khi :values được cung cấp.',
    'missing_with_all' => 'Trường :attribute phải bị thiếu khi tất cả :values được cung cấp.',
    'multiple_of' => 'Trường :attribute phải là một bội số của :value.',
    'not_in' => 'Giá trị :attribute đã chọn không hợp lệ.',
    'not_regex' => 'Định dạng trường :attribute không hợp lệ.',
    'numeric' => 'Trường :attribute phải là một số.',
    'password' => [
        'letters' => 'Trường :attribute phải chứa ít nhất một chữ cái.',
        'mixed' => 'Trường :attribute phải chứa ít nhất một chữ cái viết hoa và một chữ cái viết thường.',
        'numbers' => 'Trường :attribute phải chứa ít nhất một số.',
        'symbols' => 'Trường :attribute phải chứa ít nhất một ký hiệu.',
        'uncompromised' => 'Giá trị :attribute đã được tiết lộ. Vui lòng chọn một giá trị khác.',
    ],
    'present' => 'Trường :attribute phải được cung cấp.',
    'present_if' => 'Trường :attribute phải được cung cấp khi :other là :value.',
    'present_unless' => 'Trường :attribute phải được cung cấp trừ khi :other là :value.',
    'present_with' => 'Trường :attribute phải được cung cấp khi :values được cung cấp.',
    'present_with_all' => 'Trường :attribute phải được cung cấp khi tất cả :values được cung cấp.',
    'prohibited' => 'Trường :attribute bị cấm.',
    'prohibited_if' => 'Trường :attribute bị cấm khi :other là :value.',
    'prohibited_unless' => 'Trường :attribute bị cấm trừ khi :other là trong :values.',
    'prohibits' => 'Trường :attribute cấm :other được cung cấp.',
    'regex' => 'Định dạng trường :attribute không hợp lệ.',
    'required' => 'Trường :attribute là bắt buộc.',
    'required_array_keys' => 'Trường :attribute phải chứa các khóa sau: :values.',
    'required_if' => 'Trường :attribute là bắt buộc khi :other là :value.',
    'required_if_accepted' => 'Trường :attribute là bắt buộc khi :other được chấp nhận.',
    'required_unless' => 'Trường :attribute là bắt buộc trừ khi :other là trong :values.',
    'required_with' => 'Trường :attribute là bắt buộc khi :values được cung cấp.',
    'required_with_all' => 'Trường :attribute là bắt buộc khi tất cả :values được cung cấp.',
    'required_without' => 'Trường :attribute là bắt buộc khi :values không được cung cấp.',
    'required_without_all' => 'Trường :attribute là bắt buộc khi không có :values được cung cấp.',
    'same' => 'Trường :attribute và :other phải giống nhau.',
    'size' => [
        'array' => 'Trường :attribute phải chứa :size mục.',
        'file' => 'Trường :attribute phải có kích thước :size kilobyte.',
        'numeric' => 'Trường :attribute phải có giá trị :size.',
        'string' => 'Trường :attribute phải có :size ký tự.',
    ],
    'starts_with' => 'Trường :attribute phải bắt đầu bằng một trong các giá trị sau: :values.',
    'string' => 'Trường :attribute phải là một chuỗi.',
    'timezone' => 'Trường :attribute phải là một múi giờ hợp lệ.',
    'unique' => 'Giá trị :attribute đã được sử dụng.',
    'uploaded' => 'Trường :attribute tải lên thất bại.',
    'uppercase' => 'Trường :attribute phải là chữ hoa.',
    'url' => 'Trường :attribute phải là một URL hợp lệ.',
    'ulid' => 'Trường :attribute phải là một ULID hợp lệ.',
    'uuid' => 'Trường :attribute phải là một UUID hợp lệ.',

    /*
    |--------------------------------------------------------------------------
    | Dòng ngôn ngữ xác thực tùy chỉnh
    |--------------------------------------------------------------------------
    |
    | Ở đây bạn có thể chỉ định các thông điệp xác thực tùy chỉnh cho các thuộc tính
    | bằng cách sử dụng quy ước "attribute.rule" để đặt tên cho các dòng.
    | Điều này giúp bạn dễ dàng chỉ định một thông điệp ngôn ngữ tùy chỉnh cụ thể
    | cho một quy tắc thuộc tính nhất định.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Thuộc tính xác thực tùy chỉnh
    |--------------------------------------------------------------------------
    |
    | Các dòng ngôn ngữ sau đây được sử dụng để thay thế các thuộc tính giả
    | bằng các thuộc tính thực tế trong thông điệp xác thực.
    | Điều này giúp bạn dễ dàng thay đổi tên thuộc tính trong thông điệp xác thực.
    |
    */

    'attributes' => [],

];
