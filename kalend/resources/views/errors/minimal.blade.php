<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">

    <title>
        @if ($common->web_name_before == '1')
            {{ $common->web_name . ' ' . $common->web_name_separator_symbol }} @stack('page_name')
        @else
            @stack('page_name') {{ $common->web_name_separator_symbol . ' ' . $common->web_name }}
        @endif
    </title>

    <base href="{{ asset('') }}">
    <link rel="shortcut icon" type="image/x-icon" href="{{ $common->web_icon }}">

    <link rel="stylesheet preload" href="assets/css/vendor/bootstrap.min.css" as="style">
    <link rel="stylesheet preload" href="assets/css/plugins/fontawesome.min.css" as="style">
    <link rel="stylesheet preload" href="assets/css/plugins/swiper.min.css" as="style">
    <link rel="stylesheet preload" href="assets/css/plugins/magnific-popup.css" as="style">
    <link rel="stylesheet preload" href="assets/css/plugins/sal.min.css" as="style">
    <link rel="stylesheet preload" href="assets/css/plugins/nice-select.css" as="style">
    <link rel="stylesheet preload" href="assets/css/plugins/metismenu.css" as="style">
    <link rel="stylesheet preload" href="assets/css/style.css" as="style">
    @stack('css')
</head>

<body class="maintenance-home">
    <div class="rts-error-section maintenance">
        <div class="section-inner">
            <img src="error.png" width="400" alt="error">
            <div class="wrapper-para mt--50">
                {{-- <h3 class="title">@yield('code')</h3>
                <p class="disc">@yield('message')</p> --}}
                <a href="{{ route('home') }}"
                    class="rts-btn btn__long btn-primary m-auto">Back to home</a>
            </div>
        </div>
    </div>
</body>

</html>
