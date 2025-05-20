<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=3">
    <meta http-equiv="x-ua-compatible" content="ie=edge">

    @stack('meta')

    <title>
        @if ($common->web_name_before == '1')
            {{ $common->web_name . ' ' . $common->web_name_separator_symbol }} @stack('page_name')
        @else
            @stack('page_name') {{ $common->web_name_separator_symbol . ' ' . $common->web_name }}
        @endif
    </title>

    <base href="{{ asset('') }}">
    <link rel="shortcut icon" type="image/x-icon" href="{{ $common->web_icon }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Quicksand:wght@300..700&display=swap"
        rel="stylesheet">

    {{-- <link rel="stylesheet preload" href="assets/css/vendor/bootstrap.min.css" as="style"> --}}
    <link rel="stylesheet preload" href="assets/css/plugins/fontawesome.min.css" as="style">
    <link rel="stylesheet preload" href="assets/css/plugins/swiper.min.css" as="style">
    <link rel="stylesheet preload" href="assets/css/plugins/magnific-popup.css" as="style">
    <link rel="stylesheet preload" href="assets/css/plugins/sal.min.css" as="style">
    <link rel="stylesheet preload" href="assets/css/plugins/nice-select.css" as="style">
    <link rel="stylesheet preload" href="assets/css/plugins/metismenu.css" as="style">

    {{-- <link rel="stylesheet preload" href="assets/css/style.css" as="style"> --}}
    <link rel="stylesheet preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/fontawesome.min.css"
        async>
    {{-- <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/eliyantosarage/font-awesome-pro@main/fontawesome-pro-6.5.1-web/css/all.min.css"
        rel="stylesheet" async> --}}
    <link rel="stylesheet preload" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" async>
    <link rel="stylesheet preload" href="assets/css/style.min.css" as="style">
    <link rel="stylesheet preload" href="common/css/home-custom.css" as="style">

    @stack('css')

    <script src="https://www.google.com/recaptcha/api.js" async defer></script>

    {!! $common->src_tag_head !!}
</head>

<body class="home-three">
    <!-- HEADER AREA -->
    <header class="rts-header style-six header__default">
        <div class="container">
            <div class="row">
                <div class="rts-header__wrapper">
                    <!-- FOR LOGO -->
                    <div class="rts-header__logo">
                        <a href="{{ route('home') }}" class="site-logo">
                            <img class="logo-white" src="{{ $common->web_logo_2 }}" alt="{{ $common->web_name }}">
                            <img class="logo-dark" src="{{ $common->web_logo_2 }}" alt="{{ $common->web_name }}">
                        </a>
                    </div>
                    <!-- FOR NAVIGATION MENU -->

                    <nav class="rts-header__menu" id="mobile-menu">
                        <div class="hostie-menu">
                            <ul class="list-unstyled hostie-desktop-menu">
                                @foreach ($nav as $navigator)
                                    @if ($navigator->redirect != 'services')
                                        <li class="menu-item">
                                            <a href="{{ $navigator->redirect ? route($navigator->redirect) : 'javascript:void(0)' }}"
                                                class="hostie-dropdown-main-element">{{ $navigator->{'name' . $curLanguage} }}</a>
                                        </li>
                                    @else
                                        <li class="menu-item hostie-has-dropdown mega-menu">
                                            <div class="hostie-dropdown-main-element">
                                                {{ $navigator->{'name' . $curLanguage} }}</div>
                                            <div class="rts-mega-menu">
                                                <div class="wrapper">
                                                    <ul class="mega-menu-item">
                                                        @foreach ($navServices as $navServ)
                                                            <li>
                                                                <a
                                                                    href="{{ route('services.page', $navServ->route) }}">
                                                                    <img class="lazyload"
                                                                        data-src="{{ $navServ->image }}"
                                                                        alt="service">
                                                                    <div class="info">
                                                                        <p>{{ $navServ->{'name' . $curLanguage} }}
                                                                        </p>
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        @endforeach
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    @endif
                                @endforeach

                                <li class="menu-item hostie-has-dropdown">
                                    <div class="hostie-dropdown-main-element">{{ __('text.languages') }}</div>
                                    <ul class="hostie-submenu list-unstyled menu-pages">
                                        @foreach ($languages as $lang)
                                            <li class="nav-item">
                                                <a class="nav-link"
                                                    href="{{ route('locale.change', $lang->code) }}">{{ $lang->name }}</a>
                                            </li>
                                        @endforeach
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <!-- FOR HEADER RIGHT -->
                    <div class="rts-header__right">
                        <div class="button-area">
                            <ul class="list-unstyled hostie-desktop-menu">
                                <li class="menu-item hostie-has-dropdown">
                                    <a href="index.html" class="hostie-dropdown-main-element">Home</a>
                                    <div class="has-homemenu">
                                        <div class="row gx-5 row-cols-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-5">
                                            <div class="col homemenu">asdfasdf</div>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <a href="#anywhere-home" class="get-started__btn ">{{ __('text.contact_us') }}</a>
                        </div>
                        <button id="menu-btn" aria-label="Menu" class="mobile__active menu-btn"><i
                                class="fa-solid fa-bars"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!-- HEADER AREA END -->

    @stack('content')

    <!-- FOOTER AREA -->
    <footer class="rts-footer site-footer-six">
        <div class="container position-relative z-1">
            <div class="row">
                <!-- widget -->
                <div class="col-lg-3 col-md-8 col-sm-6 rts-footer__widget--column">
                    <div class="rts-footer__widget footer__widget w-280">
                        <a href="{{ route('home') }}" class="footer__logo">
                            <img src="{{ $common->web_logo_2 }}" alt="{{ $common->web_name }}">
                        </a>

                        <h5 class="mb--0">France</h5>
                        <p class="brand-desc address">{{ $office->address_1 }}</p>

                        <div class="contact-method mt--10">
                            @if ($office->tel_1)
                                <a href="tell:{{ $office->tel_1 }}"><span><i
                                            class="fa-regular fa-phone"></i></span>{{ $office->tel_1 }}</a>
                            @endif
                            <a href="mailto:{{ $office->email_1 }}">
                                <span><i class="fa-light fa-envelope"></i></span>{{ $office->email_1 }}</a>
                        </div>
                    </div>
                </div>
                <!-- widget end -->

                <!-- widget -->
                <div class="col-lg-3 col-md-4 col-sm-6 rts-footer__widget--column">
                    <div class="rts-footer__widget footer__widget extra-padding">
                        <h5 class="widget-title">{{ __('text.quick_links') }}</h5>
                        <div class="rts-footer__widget--menu ">
                            <ul>
                                @foreach ($nav as $navigator)
                                    @if ($navigator->redirect != '' && $navigator->redirect != 'services')
                                        <li><a
                                                href="{{ route($navigator->redirect) }}">{{ $navigator->{'name' . $curLanguage} }}</a>
                                        </li>
                                    @endif
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- widget end -->

                <!-- widget -->
                <div class="col-lg-3 col-md-4 col-sm-6 rts-footer__widget--column">
                    <div class="rts-footer__widget footer__widget">
                        <h5 class="widget-title">{{ __('text.languages') }}</h5>
                        <div class="rts-footer__widget--menu">
                            <ul>
                                @foreach ($languages as $lang)
                                    <li><a href="{{ route('locale.change', $lang->code) }}">{{ $lang->name }}</a>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- widget end -->

                <!-- widget -->
                <div class="col-lg-3 col-md-4 col-sm-6 rts-footer__widget--column">
                    <div class="rts-footer__widget footer__widget">
                        <div class="social__media">
                            <h5 class="widget-title">{{ __('text.social_media') }}</h5>
                            <div class="social__media--list">
                                <a href="{{ $common->facebook }}" class="media" target="_blank"
                                    aria-label="facebook"><i class="fa-brands fa-facebook-f"></i></a>
                                <a href="{{ $common->linkedin }}" class="media" target="_blank"
                                    aria-label="linkedin"><i class="fa-brands fa-linkedin"></i></a>
                                <a href="{{ $common->x }}" class="media" target="_blank" aria-label="x"><i
                                        class="fa-brands fa-x-twitter"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- widget end -->
            </div>
        </div>
    </footer>
    <div class="rts-footer__copyright-two style-four">
        <div class="container">
            <div class="row">
                <div class="rts-footer__copyright-two__wrapper">
                    <p class="copyright">{{ $common->copyright }}</p>
                </div>
            </div>
        </div>
    </div>
    <!-- FOOTER AREA END -->

    <div id="anywhere-home"></div>
    <!-- side bar area  -->
    <div id="side-bar" class="side-bar header-two">
        <button class="close-icon-menu" aria-label="Close"><i class="fa-thin fa-xmark"></i></button>
        <!-- mobile menu area start -->
        <div class="mobile-menu-main">
            <nav class="nav-main mainmenu-nav mt--30">
                <ul class="mainmenu metismenu" id="mobile-menu-active">
                    @foreach ($nav as $navigator)
                        @if ($navigator->redirect != 'services')
                            <li>
                                <a href="{{ $navigator->redirect ? route($navigator->redirect) : 'javascript:void(0)' }}"
                                    class="main">{{ $navigator->{'name' . $curLanguage} }}</a>
                            </li>
                        @else
                            <li class="has-droupdown">
                                <a href="javascript:void(0);"
                                    class="main">{{ $navigator->{'name' . $curLanguage} }}</a>
                                <ul class="submenu mm-collapse">
                                    @foreach ($navServices as $navServ)
                                        <li>
                                            <a href="{{ route('services.page', $navServ->route) }}"
                                                class="mobile-menu-link">
                                                {{ $navServ->{'name' . $curLanguage} }}
                                            </a>
                                        </li>
                                    @endforeach
                                </ul>
                            </li>
                        @endif
                    @endforeach
                    <li>
                        <a href="{{ route('contact') }}" class="main">{{ __('text.contact_us') }}</a>
                    </li>
                    <li class="has-droupdown">
                        <a href="javascript:void(0);" class="main">{{ __('text.languages') }}</a>
                        <ul class="submenu mm-collapse">
                            @foreach ($languages as $lang)
                                <li><a href="{{ route('locale.change', $lang->code) }}"
                                        class="mobile-menu-link">{{ $lang->name }}</a>
                                </li>
                            @endforeach
                        </ul>
                    </li>
                </ul>
            </nav>

            <ul class="social-area-one pl--20 mt--100">
                <li><a href="{{ $common->facebook }}" aria-label="facebook"><i
                            class="fa-brands fa-facebook-f"></i></a></li>
                <li><a href="{{ $common->linkedin }}" aria-label="linkedin"><i
                            class="fa-brands fa-linkedin"></i></a></li>
                <li><a href="{{ $common->x }}" aria-label="x"><i class="fa-brands fa-x-twitter"></i></a></li>
            </ul>
        </div>
        <!-- mobile menu area end -->
    </div>
    <!-- side abr area end -->

    <!-- BACK TO TOP AREA START -->
    <div class="progress-wrap">
        <svg class="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
            <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
                style="transition: stroke-dashoffset 10ms linear 0s; stroke-dasharray: 307.919, 307.919; stroke-dashoffset: 307.919;">
            </path>
        </svg>
    </div>
    <!-- BACK TO TOP AREA EDN -->

    <!-- jquery js -->
    <script src="https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js"></script>

    <script defer src="assets/js/plugins/jquery.min.js"></script>
    <script defer src="assets/js/plugins/bootstrap.min.js"></script>
    <script defer src="assets/js/plugins/swiper.js"></script>

    <script defer src="assets/js/plugins/popper.js"></script>
    <script defer src="assets/js/vendor/waypoint.js"></script>
    <script defer src="assets/js/plugins/theia-sticky-sidebar.min.js"></script>
    <script defer src="assets/js/plugins/jquery.nice-select.min.js"></script>
    <script defer src="assets/js/plugins/sal.js"></script>
    <script defer src="assets/js/vendor/waw.js"></script>
    <script defer src="assets/js/plugins/counter-up.js"></script>
    <script defer src="assets/js/plugins/magnific-popup.js"></script>

    <script defer src="assets/js/metismenu.min.js"></script>
    <script defer src="assets/js/main.min.js"></script>

    @stack('js')
    {!! $common->src_tag_body_bottom !!}
</body>

</html>
